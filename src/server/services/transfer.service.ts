import { prisma } from "@/lib/prisma";
import type { StockTransferFormValues } from "@/lib/outlet-validations";

export class TransferService {
  static async createTransfer(data: StockTransferFormValues) {
    return prisma.$transaction(async (tx) => {
      // Generate Transfer No
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const count = await tx.stockTransfer.count({ where: { date: data.date } }) + 1;
      const transferNo = `TRF-${dateStr}-${count.toString().padStart(4, '0')}`;

      const transfer = await tx.stockTransfer.create({
        data: {
          transferNo,
          date: data.date,
          fromOutletId: data.fromOutletId,
          toOutletId: data.toOutletId,
          status: "MENUNGGU_PERSETUJUAN",
          notes: data.notes,
          items: {
            create: data.items.map(item => ({
              masterPartId: item.masterPartId,
              quantity: item.quantity,
              notes: item.notes
            }))
          }
        }
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE_TRANSFER",
          entity: "StockTransfer",
          entityId: transfer.id,
          details: JSON.stringify({ transferNo, from: data.fromOutletId, to: data.toOutletId }),
          user: "Kasir Outlet"
        }
      });

      return transfer;
    });
  }

  static async updateTransferStatus(transferId: string, status: string, user: string = "Admin/Outlet") {
    return prisma.$transaction(async (tx) => {
      const transfer = await tx.stockTransfer.findUnique({
        where: { id: transferId },
        include: { items: true }
      });

      if (!transfer) throw new Error("Transfer tidak ditemukan");

      // Validasi flow: MENUNGGU_PERSETUJUAN -> DIKIRIM -> DITERIMA
      if (status === "DIKIRIM" && transfer.status !== "MENUNGGU_PERSETUJUAN") {
        throw new Error("Status tidak valid untuk dikirim");
      }
      if (status === "DITERIMA" && transfer.status !== "DIKIRIM") {
        throw new Error("Status tidak valid untuk diterima");
      }

      await tx.stockTransfer.update({
        where: { id: transferId },
        data: { status }
      });

      // Jika DIKIRIM: Kurangi stok pengirim
      if (status === "DIKIRIM") {
        for (const item of transfer.items) {
          const inv = await tx.outletInventory.findUnique({
            where: { outletId_masterPartId: { outletId: transfer.fromOutletId, masterPartId: item.masterPartId } }
          });
          if (!inv || inv.stock < item.quantity) {
            throw new Error("Stok pengirim tidak mencukupi untuk dikirim");
          }
          await tx.outletInventory.update({
            where: { id: inv.id },
            data: { stock: { decrement: item.quantity } }
          });
        }
      }

      // Jika DITERIMA: Tambah stok penerima
      if (status === "DITERIMA") {
        for (const item of transfer.items) {
          await tx.outletInventory.upsert({
            where: { outletId_masterPartId: { outletId: transfer.toOutletId, masterPartId: item.masterPartId } },
            update: { stock: { increment: item.quantity } },
            create: { outletId: transfer.toOutletId, masterPartId: item.masterPartId, stock: item.quantity }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: `UPDATE_TRANSFER_${status}`,
          entity: "StockTransfer",
          entityId: transfer.id,
          details: JSON.stringify({ oldStatus: transfer.status, newStatus: status }),
          user
        }
      });

      return transfer;
    });
  }
}
