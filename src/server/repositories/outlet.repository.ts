import { prisma } from "@/lib/prisma";

export class OutletRepository {
  static async getDashboardKPI() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const incomingToday = await prisma.outletReceipt.aggregate({
      where: { receivedAt: { gte: today } },
      _count: { id: true }
    });

    const itemsToday = await prisma.outletReceiptItem.aggregate({
      where: { outletReceipt: { receivedAt: { gte: today } } },
      _sum: { receivedQuantity: true }
    });

    const inventoryAgg = await prisma.outletInventory.aggregate({
      _sum: { stock: true }
    });

    const revenueToday = await prisma.dailyOutletRevenue.findFirst({
      where: { date: { gte: today } }
    });

    return {
      incomingDeliveriesToday: incomingToday._count.id || 0,
      incomingItemsToday: itemsToday._sum.receivedQuantity || 0,
      totalStock: inventoryAgg._sum.stock || 0,
      omsetToday: revenueToday?.totalRevenue || 0,
      receivableToday: revenueToday?.receivableAmount || 0,
      expenseToday: revenueToday?.expenseAmount || 0,
      netBalance: revenueToday?.netBalance || 0
    };
  }

  static async getPendingDeliveries() {
    return prisma.distributionOrder.findMany({
      where: { status: "MENUNGGU_VERIFIKASI_OUTLET" },
      include: {
        driver: true,
        vehicle: true,
        items: {
          include: {
            packingItem: {
              include: {
                productionItem: { include: { masterPart: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getInventoryList() {
    return prisma.outletInventory.findMany({
      include: { masterPart: true },
      orderBy: { stock: 'desc' }
    });
  }

  static async getRevenueHistory() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 14);

    const revenues = await prisma.dailyOutletRevenue.findMany({
      where: { date: { gte: dateLimit } },
      orderBy: { date: 'asc' }
    });

    return revenues.map(r => ({
      date: r.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      omset: r.totalRevenue,
      pengeluaran: r.expenseAmount
    }));
  }

  static async getIncomingHistoryChart() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 14);

    const receipts = await prisma.outletReceipt.findMany({
      where: { receivedAt: { gte: dateLimit } },
      include: { items: true },
      orderBy: { receivedAt: 'asc' }
    });

    // Group by date
    const grouped = receipts.reduce((acc, receipt) => {
      const dateStr = receipt.receivedAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      const qty = receipt.items.reduce((s, i) => s + i.receivedQuantity, 0);
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += qty;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([date, qty]) => ({ date, qty }));
  }
}
