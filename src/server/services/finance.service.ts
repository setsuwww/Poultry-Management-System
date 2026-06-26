import { prisma } from "@/lib/prisma";

export class FinanceService {
  
  static async verifyDeposit(data: any, adminName: string = "Admin Omset") {
    return prisma.$transaction(async (tx) => {
      const deposit = await tx.cashDeposit.findUnique({
        where: { id: data.cashDepositId }
      });

      if (!deposit) throw new Error("Setoran tidak ditemukan");
      if (deposit.status !== "MENUNGGU_VERIFIKASI") throw new Error("Status setoran tidak valid");

      const difference = deposit.amount - data.actualSalesAmount;
      const isShortage = difference < 0;
      const isExcess = difference > 0;

      let newStatus = isShortage ? "PERLU_KLARIFIKASI" : "DISETUJUI";

      const verification = await tx.depositVerification.create({
        data: {
          cashDepositId: deposit.id,
          verifiedBy: adminName,
          actualSalesAmount: data.actualSalesAmount,
          difference: difference,
          notes: data.notes
        }
      });

      // 1. Jika Kurang: Buat CashierLiability = Kekurangan x 2
      if (isShortage) {
        const shortageAmount = Math.abs(difference);
        const liabilityAmount = shortageAmount * 2;

        await tx.cashierLiability.create({
          data: {
            cashDepositId: deposit.id,
            shortageAmount,
            liabilityAmount,
            status: "BELUM_DIBAYAR"
          }
        });
      }

      // 2. Jika Lebih: Kompensasi Minus Barang (FIFO)
      if (isExcess) {
        let remainingExcess = difference;

        const unpaidLiabilities = await tx.driverLiability.findMany({
          where: { status: "BELUM_DIBAYAR" },
          orderBy: { createdAt: 'asc' }
        });

        for (const liability of unpaidLiabilities) {
          if (remainingExcess <= 0) break;

          // Ambil sisa kompensasi sebelumnya jika ada, tapi karena totalLoss statis, kita asumsikan 
          // ada field tambahan atau kita bayar full. 
          // Sederhananya, jika remainingExcess >= totalLoss, lunaskan.
          
          const compensationsSoFar = await tx.minusCompensation.aggregate({
            where: { driverLiabilityId: liability.id },
            _sum: { amountApplied: true }
          });
          
          const alreadyPaid = compensationsSoFar._sum.amountApplied || 0;
          const remainingDebt = liability.totalLoss - alreadyPaid;

          if (remainingDebt > 0) {
            const amountToApply = Math.min(remainingExcess, remainingDebt);
            
            await tx.minusCompensation.create({
              data: {
                depositVerificationId: verification.id,
                driverLiabilityId: liability.id,
                amountApplied: amountToApply
              }
            });

            remainingExcess -= amountToApply;

            if (amountToApply >= remainingDebt) {
              await tx.driverLiability.update({
                where: { id: liability.id },
                data: { status: "LUNAS" }
              });
            }
          }
        }
      }

      // Update Deposit Status
      await tx.cashDeposit.update({
        where: { id: deposit.id },
        data: { status: newStatus }
      });

      await tx.auditLog.create({
        data: {
          action: "VERIFY_DEPOSIT",
          entity: "CashDeposit",
          entityId: deposit.id,
          details: JSON.stringify({ actualSalesAmount: data.actualSalesAmount, difference, isShortage, isExcess }),
          user: adminName
        }
      });

      return verification;
    });
  }
}
