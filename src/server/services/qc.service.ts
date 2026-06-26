import { prisma } from "@/lib/prisma";

export class QCService {
  static async submitVerification(data: any, checkerName: string) {
    return prisma.$transaction(async (tx) => {
      const header = await tx.qualityControlHeader.findUnique({
        where: { id: data.qcHeaderId }
      });
      if (!header) throw new Error("QC Header not found");
      if (header.status !== "MENUNGGU_QC") throw new Error("Already verified");

      // Cari Gudang Pusat
      const pusatOutlet = await tx.outlet.findUnique({ where: { name: "Outlet Sasak Pusat" } });
      if (!pusatOutlet) throw new Error("Gudang Pusat tidak ditemukan");

      // 1. Update QC Header
      await tx.qualityControlHeader.update({
        where: { id: header.id },
        data: { status: "SELESAI", verifiedBy: checkerName }
      });

      // 2. Loop QC Items
      for (const item of data.items) {
        // Update item qc result
        await tx.qualityControlItem.update({
          where: { id: item.qcItemId },
          data: { qcResult: item.qcResult, notes: item.notes }
        });

        if (item.qcResult === "LAYAK_DIJUAL") {
          // Tambahkan ke Pusat (Stock Adjustment Positif)
          await tx.outletInventory.upsert({
            where: { outletId_masterPartId: { outletId: pusatOutlet.id, masterPartId: item.masterPartId } },
            update: { stock: { increment: item.quantity } },
            create: { outletId: pusatOutlet.id, masterPartId: item.masterPartId, stock: item.quantity }
          });

          // Ledger In
          await tx.inventoryLedger.create({
            data: {
              date: new Date(),
              outletId: pusatOutlet.id,
              masterPartId: item.masterPartId,
              transactionType: `QC_${header.type}_IN`,
              referenceNo: `QC-${header.id.slice(-6).toUpperCase()}`,
              qtyIn: item.quantity,
              qtyOut: 0,
              balance: 0, 
              user: checkerName
            }
          });
        } else {
          // TIDAK LAYAK -> Masuk Rejected Inventory & Disposal Candidate
          await tx.rejectedInventory.upsert({
            where: { masterPartId: item.masterPartId },
            update: { stock: { increment: item.quantity } },
            create: { masterPartId: item.masterPartId, stock: item.quantity }
          });

          await tx.disposalCandidate.create({
            data: {
              date: new Date(),
              masterPartId: item.masterPartId,
              quantity: item.quantity,
              reason: `QC ${header.type} Reject: ${item.notes || ''}`
            }
          });
        }
      }

      // 3. Ubah status induk (ReturnedGoods / RejectedGoods) jika ada
      if (header.type === "RETUR") {
        await tx.returnedGoods.updateMany({
          where: { id: header.referenceId },
          data: { status: "SELESAI" }
        });
      } else if (header.type === "RIJEK") {
        await tx.rejectedGoods.updateMany({
          where: { id: header.referenceId },
          data: { status: "SELESAI" }
        });
      }

      await tx.qualityControlLog.create({
        data: {
          qcHeaderId: header.id,
          action: "QC_VERIFIED",
          user: checkerName
        }
      });

      return true;
    });
  }
}
