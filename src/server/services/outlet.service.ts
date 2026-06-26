import { prisma } from "@/lib/prisma";

export class OutletService {
  /**
   * Menerima barang dari Driver.
   * Menambahkan stok ke OutletInventory.
   * Membuat DriverLiability (Minus Driver) jika kurang.
   */
  static async verifyIncomingDelivery(data: any, cashierName: string = "Kasir Outlet") {
    return prisma.$transaction(async (tx) => {
      const order = await tx.distributionOrder.findUnique({
        where: { id: data.distributionOrderId },
        include: { items: { include: { packingItem: { include: { productionItem: { include: { masterPart: { include: { productPrice: true } } } } } } } } }
      });

      if (!order) throw new Error("Surat Jalan tidak ditemukan");
      if (order.status !== "MENUNGGU_VERIFIKASI_OUTLET") {
        throw new Error("Status Surat Jalan tidak valid");
      }

      let hasMinus = false;
      const receiptItemsData = [];

      for (const reqItem of data.items) {
        const dbItem = order.items.find(i => i.id === reqItem.distributionItemId);
        if (!dbItem) continue;

        const sentQty = dbItem.quantity;
        const receivedQty = reqItem.receivedQuantity;
        const masterPartId = dbItem.packingItem.productionItem.masterPartId;

        const isMatch = sentQty === receivedQty;
        if (!isMatch) hasMinus = true;

        receiptItemsData.push({
          masterPartId,
          sentQuantity: sentQty,
          receivedQuantity: receivedQty,
          status: isMatch ? "Sesuai" : "Tidak Sesuai",
          notes: reqItem.notes
        });

        const outlet = await tx.outlet.findFirst({ where: { name: order.destination } });
        if (!outlet) throw new Error("Outlet tujuan tidak terdaftar di sistem");

        // 1. Tambah Stok Outlet
        await tx.outletInventory.upsert({
          where: { outletId_masterPartId: { outletId: outlet.id, masterPartId } },
          update: { stock: { increment: receivedQty } },
          create: { outletId: outlet.id, masterPartId, stock: receivedQty }
        });

        // 2. Buat DriverLiability (Minus Distribusi) jika kurang
        if (receivedQty < sentQty) {
          const missingQty = sentQty - receivedQty;
          const unitPrice = dbItem.packingItem.productionItem.masterPart.productPrice?.currentPrice || 50000;
          
          await tx.driverLiability.create({
            data: {
              driverId: order.driverId,
              distributionItemId: dbItem.id,
              sentQuantity: sentQty,
              receivedQuantity: receivedQty,
              missingQuantity: missingQty,
              unitPrice,
              totalLoss: missingQty * unitPrice,
              status: "BELUM_DIBAYAR"
            }
          });
        }
      }

      // 3. Buat OutletReceipt
      const receipt = await tx.outletReceipt.create({
        data: {
          distributionOrderId: order.id,
          cashierName,
          items: {
            create: receiptItemsData
          }
        }
      });

      // 4. Update Status DO
      const newStatus = hasMinus ? "BERMASALAH" : "SELESAI";
      await tx.distributionOrder.update({
        where: { id: order.id },
        data: { status: newStatus }
      });

      // 5. Log & Audit
      await tx.deliveryLog.create({
        data: {
          distributionOrderId: order.id,
          status: newStatus,
          notes: `Diterima oleh ${cashierName}. ${hasMinus ? "Terdapat selisih minus barang." : "Sesuai."}`
        }
      });

      await tx.auditLog.create({
        data: {
          action: "OUTLET_RECEIPT",
          entity: "OutletReceipt",
          entityId: receipt.id,
          details: JSON.stringify({ hasMinus, distributionOrderId: order.id }),
          user: cashierName
        }
      });

      return receipt;
    });
  }

  static async submitDailyRevenue(data: any) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.dailyOutletRevenue.findUnique({
        where: { date: data.date }
      });
      if (existing) throw new Error("Omset untuk tanggal ini sudah diinput");

      const netBalance = data.totalRevenue - data.expenseAmount - data.receivableAmount;

      return tx.dailyOutletRevenue.create({
        data: {
          date: data.date,
          totalRevenue: data.totalRevenue,
          cashAmount: data.cashAmount,
          nonCashAmount: data.nonCashAmount,
          receivableAmount: data.receivableAmount,
          expenseAmount: data.expenseAmount,
          expenseNotes: data.expenseNotes,
          netBalance
        }
      });
    });
  }

  static async submitCashDeposit(data: any, cashierName: string = "Kasir Outlet") {
    return prisma.cashDeposit.create({
      data: {
        date: data.date,
        amount: data.amount,
        notes: data.notes,
        cashierName,
        status: "MENUNGGU_VERIFIKASI"
      }
    });
  }
}
