import { prisma } from "@/lib/prisma";

export class DriverRepository {
  // We use driverId parameter to filter data specific to a driver.
  // In a real app, this driverId comes from session.
  // For this prototype, we pass it or default to a known driver.

  static async getDashboardKPI(driverId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      sentToday,
      inTransit,
      completed,
      problematic,
      liabilities,
      itemsCarried
    ] = await Promise.all([
      prisma.distributionOrder.count({
        where: { driverId, date: { gte: today } }
      }),
      prisma.distributionOrder.count({
        where: { driverId, status: "DALAM_PENGIRIMAN" }
      }),
      prisma.distributionOrder.count({
        where: { driverId, status: "SELESAI" }
      }),
      prisma.distributionOrder.count({
        where: { driverId, status: { in: ["PERLU_PERBAIKAN", "BERMASALAH"] } }
      }),
      prisma.driverLiability.aggregate({
        where: { driverId, status: "BELUM_DIBAYAR" },
        _sum: { totalLoss: true }
      }),
      prisma.distributionOrder.aggregate({
        where: { driverId, date: { gte: today }, status: { in: ["DALAM_PENGIRIMAN", "MENUNGGU_VERIFIKASI_OUTLET", "SELESAI"] } },
        _sum: { totalItems: true }
      })
    ]);

    return {
      sentToday,
      inTransit,
      completed,
      problematic,
      totalMinusAmount: liabilities._sum.totalLoss || 0,
      itemsCarriedToday: itemsCarried._sum.totalItems || 0,
    };
  }

  static async getTodayDeliveries(driverId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.distributionOrder.findMany({
      where: { driverId, date: { gte: today } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPendingVerifications(driverId: string) {
    return prisma.distributionOrder.findMany({
      where: { driverId, status: "MENUNGGU_VERIFIKASI_DRIVER" },
      include: {
        items: {
          include: { packingItem: { include: { productionItem: { include: { masterPart: true } } } } }
        },
        vehicle: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getInTransitDeliveries(driverId: string) {
    return prisma.distributionOrder.findMany({
      where: { driverId, status: "DALAM_PENGIRIMAN" },
      include: {
        items: {
          include: { packingItem: { include: { productionItem: { include: { masterPart: true } } } } }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getDeliveryHistory(driverId: string) {
    return prisma.distributionOrder.findMany({
      where: { driverId },
      include: { logs: true },
      orderBy: { date: 'desc' }
    });
  }

  static async getDriverLiabilities(driverId: string) {
    return prisma.driverLiability.findMany({
      where: { driverId },
      include: {
        distributionItem: {
          include: {
            distribution: true,
            packingItem: { include: { productionItem: { include: { masterPart: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
