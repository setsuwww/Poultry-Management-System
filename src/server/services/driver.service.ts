import { prisma } from "@/lib/prisma";
import type { DriverVerificationFormValues } from "@/lib/validations";

export class DriverService {
  
  static async verifyDeparture(data: DriverVerificationFormValues, userIp: string = "127.0.0.1") {
    return prisma.$transaction(async (tx) => {
      const order = await tx.distributionOrder.findUnique({
        where: { id: data.distributionOrderId }
      });
      if (!order) throw new Error("Surat Jalan tidak ditemukan");
      if (order.status !== "MENUNGGU_VERIFIKASI_DRIVER") {
        throw new Error("Status Surat Jalan tidak valid untuk diverifikasi driver");
      }

      const newStatus = data.status === "APPROVED" ? "DALAM_PENGIRIMAN" : "PERLU_PERBAIKAN";

      // Update SJ Status
      const updatedOrder = await tx.distributionOrder.update({
        where: { id: data.distributionOrderId },
        data: { status: newStatus }
      });

      // Record Verification
      await tx.deliveryVerification.create({
        data: {
          distributionOrderId: data.distributionOrderId,
          isApproved: data.status === "APPROVED",
          notes: data.notes
        }
      });

      // Record Signature if Approved
      if (data.status === "APPROVED" && (data as any).signatureData) {
        await tx.deliverySignature.create({
          data: {
            distributionOrderId: data.distributionOrderId,
            signatureData: (data as any).signatureData
          }
        });
      }

      // Record Log
      await tx.deliveryLog.create({
        data: {
          distributionOrderId: data.distributionOrderId,
          status: newStatus,
          notes: data.notes || (data.status === "APPROVED" ? "Driver menyetujui muatan barang" : "Driver menolak muatan barang")
        }
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "VERIFY_DEPARTURE",
          entity: "DistributionOrder",
          entityId: data.distributionOrderId,
          details: JSON.stringify({ isApproved: data.status === "APPROVED", notes: data.notes, ip: userIp }),
          user: `Driver-${order.driverId}`
        }
      });

      return updatedOrder;
    });
  }

  static async confirmArrival(distributionOrderId: string, driverId: string, userIp: string = "127.0.0.1") {
    return prisma.$transaction(async (tx) => {
      const order = await tx.distributionOrder.findUnique({
        where: { id: distributionOrderId }
      });
      if (!order) throw new Error("Surat Jalan tidak ditemukan");
      if (order.status !== "DALAM_PENGIRIMAN") {
        throw new Error("Status harus Dalam Pengiriman");
      }

      const newStatus = "MENUNGGU_VERIFIKASI_OUTLET";

      const updatedOrder = await tx.distributionOrder.update({
        where: { id: distributionOrderId },
        data: { status: newStatus }
      });

      await tx.deliveryLog.create({
        data: {
          distributionOrderId: distributionOrderId,
          status: newStatus,
          notes: "Driver mengkonfirmasi barang telah sampai di tujuan."
        }
      });

      await tx.auditLog.create({
        data: {
          action: "CONFIRM_ARRIVAL",
          entity: "DistributionOrder",
          entityId: distributionOrderId,
          details: JSON.stringify({ ip: userIp }),
          user: `Driver-${driverId}`
        }
      });

      return updatedOrder;
    });
  }
}
