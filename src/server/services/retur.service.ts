import { prisma } from "@/lib/prisma";
import type { ReturnedGoodsFormValues, RejectedGoodsFormValues } from "@/lib/outlet-validations";

export class ReturService {
  static async createReturnedGoods(data: ReturnedGoodsFormValues) {
    return prisma.$transaction(async (tx) => {
      const returnDoc = await tx.returnedGoods.create({
        data: {
          outletId: data.outletId,
          date: data.date,
          status: "MENUNGGU_QC",
          notes: data.notes,
          items: {
            create: data.items.map(item => ({
              masterPartId: item.masterPartId,
              quantity: item.quantity,
              reason: item.reason
            }))
          }
        }
      });

      // Kurangi stok outlet saat itu juga karena barang diretur
      for (const item of data.items) {
        const inv = await tx.outletInventory.findUnique({
          where: { outletId_masterPartId: { outletId: data.outletId, masterPartId: item.masterPartId } }
        });
        if (!inv || inv.stock < item.quantity) {
          throw new Error("Stok Outlet tidak cukup untuk diretur");
        }
        await tx.outletInventory.update({
          where: { id: inv.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_RETURNED_GOODS",
          entity: "ReturnedGoods",
          entityId: returnDoc.id,
          details: JSON.stringify({ itemCount: data.items.length }),
          user: "Kasir Outlet"
        }
      });

      return returnDoc;
    });
  }

  static async createRejectedGoods(data: RejectedGoodsFormValues) {
    return prisma.$transaction(async (tx) => {
      const rejectDoc = await tx.rejectedGoods.create({
        data: {
          outletId: data.outletId,
          date: data.date,
          status: "MENUNGGU_QC",
          notes: data.notes,
          items: {
            create: data.items.map(item => ({
              masterPartId: item.masterPartId,
              quantity: item.quantity,
              reason: item.reason
            }))
          }
        }
      });

      // Kurangi stok outlet
      for (const item of data.items) {
        const inv = await tx.outletInventory.findUnique({
          where: { outletId_masterPartId: { outletId: data.outletId, masterPartId: item.masterPartId } }
        });
        if (!inv || inv.stock < item.quantity) {
          throw new Error("Stok Outlet tidak cukup untuk dirijek");
        }
        await tx.outletInventory.update({
          where: { id: inv.id },
          data: { stock: { decrement: item.quantity } }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_REJECTED_GOODS",
          entity: "RejectedGoods",
          entityId: rejectDoc.id,
          details: JSON.stringify({ itemCount: data.items.length }),
          user: "Kasir Outlet"
        }
      });

      return rejectDoc;
    });
  }
}
