import { prisma } from "@/lib/prisma";
import type { OutletClosingFormValues, SOVerificationFormValues } from "@/lib/outlet-validations";

export class ClosingService {
  static async submitClosing(data: OutletClosingFormValues) {
    return prisma.$transaction(async (tx) => {
      // 1. Buat Header
      const closing = await tx.outletClosing.create({
        data: {
          outletId: data.outletId,
          date: data.date,
          status: "MENUNGGU_VERIFIKASI"
        }
      });

      // 2. Insert Karyawan Bertugas
      await tx.closingEmployee.createMany({
        data: data.employees.map(emp => ({
          outletClosingId: closing.id,
          name: emp.name,
          role: emp.role
        }))
      });

      // 3. Insert Items & Kalkulasi Barang Keluar
      for (const item of data.items) {
        const systemOut = item.initialStock - item.finalPhysical;
        await tx.outletClosingItem.create({
          data: {
            outletClosingId: closing.id,
            masterPartId: item.masterPartId,
            initialStock: item.initialStock,
            systemOut: systemOut,
            finalPhysical: item.finalPhysical,
            notes: item.notes
          }
        });

        // 4. Update Stok Outlet menjadi sisa fisik (Sync Stock)
        await tx.outletInventory.upsert({
          where: { outletId_masterPartId: { outletId: data.outletId, masterPartId: item.masterPartId } },
          update: { stock: item.finalPhysical },
          create: { outletId: data.outletId, masterPartId: item.masterPartId, stock: item.finalPhysical }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_CLOSING",
          entity: "OutletClosing",
          entityId: closing.id,
          details: JSON.stringify({ itemCount: data.items.length }),
          user: "Kasir Outlet"
        }
      });

      return closing;
    });
  }

  static async verifyClosing(data: SOVerificationFormValues, adminName: string = "Admin SO") {
    return prisma.$transaction(async (tx) => {
      const closing = await tx.outletClosing.findUnique({
        where: { id: data.outletClosingId },
        include: { items: true, employees: true, outlet: true }
      });

      if (!closing) throw new Error("Data closing tidak ditemukan");
      if (closing.status !== "MENUNGGU_VERIFIKASI") throw new Error("Sudah diverifikasi");

      if (data.isRejected) {
        // Jika ditolak, maka status di-reject dan closing dianggap invalid
        await tx.outletClosing.update({
          where: { id: closing.id },
          data: { status: "DITOLAK" }
        });
        await tx.auditLog.create({
          data: {
            action: "REJECT_CLOSING_SO",
            entity: "StockOpnameVerification",
            entityId: closing.id,
            details: JSON.stringify({ reason: data.notes }),
            user: adminName
          }
        });
        return closing;
      }

      const newStatus = data.isMatch ? "SESUAI" : "MINUS_BARANG";

      // Update Header
      await tx.outletClosing.update({
        where: { id: closing.id },
        data: { status: newStatus }
      });

      // Create SO Verification Record
      const verification = await tx.stockOpnameVerification.create({
        data: {
          outletClosingId: closing.id,
          verifiedBy: adminName,
          status: newStatus,
          approvalStatus: "APPROVED",
          notes: data.notes
        }
      });

      if (!data.isMatch && data.differences && data.differences.length > 0) {
        const employeeCount = closing.employees.length;
        if (employeeCount === 0) throw new Error("Tidak ada data karyawan pada closing ini");

        // Prepare Stock Adjustment 
        const adjustment = await tx.stockAdjustment.create({
          data: {
            date: closing.date,
            outletId: closing.outletId,
            referenceId: verification.id,
            reason: `Koreksi Audit SO - ${data.notes || ''}`,
            createdBy: adminName
          }
        });

        for (const diff of data.differences) {
          // Buat record Perbedaan
          const priceObj = await tx.productPrice.findUnique({
            where: { masterPartId: diff.masterPartId }
          });
          const unitPrice = priceObj?.currentPrice || 50000;
          const totalLoss = diff.missingQuantity * unitPrice;
          
          const sd = await tx.stockDifference.create({
            data: {
              soVerificationId: verification.id,
              masterPartId: diff.masterPartId,
              missingQuantity: diff.missingQuantity,
              classification: diff.classification,
              unitPrice,
              totalLoss
            }
          });

          // Stock Adjustment Item
          await tx.stockAdjustmentItem.create({
            data: {
              stockAdjustmentId: adjustment.id,
              masterPartId: diff.masterPartId,
              qtyAdjusted: -diff.missingQuantity // Karena minus
            }
          });

          // Inventory Ledger Entry (Minus Stok Riil karena sebelumnya tidak dihitung sebagai keluar)
          // Wait, sisa fisik sudah diinput kasir, dan OutletInventory di-update saat Closing Harian (submitClosing).
          // Jika SO menemukan minus, artinya stok fisik yang sebenarnya lebih sedikit lagi dari yang dilaporkan kasir?
          // Ataukah "Minus Barang" ini berarti bahwa Kasir melaporkan Sisa Fisik X, padahal sistem seharusnya Y?
          // Di step sebelumnya, submitClosing sudah mem-force stok menjadi `finalPhysical` yang diinput kasir.
          // Jadi InventoryLedger di sini berfungsi merekam bahwa selisih (SystemOut - Sales = Hilang)
          // kita rekam sebagai SO_ADJUSTMENT agar pembukuannya seimbang.
          
          const ledgerEntry = await tx.inventoryLedger.create({
            data: {
              date: new Date(),
              outletId: closing.outletId,
              masterPartId: diff.masterPartId,
              transactionType: "SO_ADJUSTMENT",
              referenceNo: `SO-${closing.id.slice(-6).toUpperCase()}`,
              qtyIn: 0,
              qtyOut: diff.missingQuantity,
              balance: 0, // Should be calculated, but since stock was already adjusted by Kasir, we just log the out.
              user: adminName
            }
          });

          // Bebankan hanya jika HILANG
          if (diff.classification === "HILANG") {
            const liabilityPerEmployee = totalLoss / employeeCount;
            await tx.employeeLiability.createMany({
              data: closing.employees.map(emp => ({
                stockDifferenceId: sd.id,
                employeeName: emp.name,
                employeeRole: emp.role,
                liabilityAmount: liabilityPerEmployee,
                status: "BELUM_DIBAYAR"
              }))
            });
          }
        }
      }

      await tx.auditLog.create({
        data: {
          action: "APPROVE_CLOSING_SO",
          entity: "StockOpnameVerification",
          entityId: verification.id,
          details: JSON.stringify({ isMatch: data.isMatch }),
          user: adminName
        }
      });
      
      return verification;
    });
  }
}
