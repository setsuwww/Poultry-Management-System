import { prisma } from "@/lib/prisma";

export class KasirRepository {
  
  static async getDashboardKPI() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      purchasesToday,
      distributionsToday,
      revenuesToday,
    ] = await Promise.all([
      prisma.purchaseItem.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { quantity: true }
      }),
      prisma.distributionOrder.aggregate({
        where: { date: { gte: today } },
        _count: { id: true },
        _sum: { totalItems: true }
      }),
      prisma.dailyRevenue.aggregate({
        where: { date: { gte: today } },
        _sum: { totalRevenue: true, receivableAmount: true, expenseAmount: true }
      })
    ]);

    // Selisih barang (Retur hari ini)
    const returnedAgg = await prisma.returnedItem.aggregate({
      where: { date: { gte: today } },
      _sum: { quantity: true }
    });

    return {
      incomingItemsToday: purchasesToday._sum.quantity || 0,
      outgoingItemsToday: distributionsToday._sum.totalItems || 0,
      distributionCountToday: distributionsToday._count.id || 0,
      totalRevenueToday: revenuesToday._sum.totalRevenue || 0,
      totalReceivable: revenuesToday._sum.receivableAmount || 0,
      totalExpense: revenuesToday._sum.expenseAmount || 0,
      itemDifference: returnedAgg._sum.quantity || 0 // Selisih / Retur
    };
  }

  static async getTodayDistributionList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.distributionOrder.findMany({
      where: { date: { gte: today } },
      include: {
        driver: true,
        vehicle: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getStockRecap() {
    // Stok Produksi = Net dari PackingItem
    // Distribusi = Total qty distribution
    // Barang sisa = Total qty returned
    
    const parts = await prisma.masterPart.findMany();
    
    // Group packing items
    const packingItems = await prisma.packingItem.findMany({
      include: { productionItem: true }
    });
    
    const distItems = await prisma.distributionItem.findMany({
      include: { packingItem: { include: { productionItem: true } } }
    });

    const returItems = await prisma.returnedItem.findMany({
      include: { distributionItem: { include: { packingItem: { include: { productionItem: true } } } } }
    });

    const result = parts.map(part => {
      // 1. Produksi (Packing)
      const packedInPart = packingItems
        .filter(p => p.productionItem.masterPartId === part.id)
        .reduce((sum, p) => sum + p.packageCount, 0);

      // 2. Distribusi
      const distInPart = distItems
        .filter(d => d.packingItem.productionItem.masterPartId === part.id)
        .reduce((sum, d) => sum + d.quantity, 0);

      // 3. Barang Sisa
      const returInPart = returItems
        .filter(r => r.distributionItem.packingItem.productionItem.masterPartId === part.id)
        .reduce((sum, r) => sum + r.quantity, 0);

      const currentStock = packedInPart - distInPart + returInPart; // Retur nambah gudang? Wait, the prompt says "Barang otomatis masuk ke stok gudang". Yes, add it back.

      return {
        partName: part.name,
        produksi: packedInPart,
        distribusi: distInPart,
        barangSisa: returInPart,
        stokSaatIni: currentStock
      };
    });

    return result.sort((a, b) => b.stokSaatIni - a.stokSaatIni);
  }

  static async getDailyRevenueChart() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 14);

    const revenues = await prisma.dailyRevenue.findMany({
      where: { date: { gte: dateLimit } },
      orderBy: { date: 'asc' }
    });

    return revenues.map(r => ({
      date: r.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      omset: r.totalRevenue
    }));
  }

  static async getAvailablePackingItems() {
    // Digunakan untuk Form Distribusi
    const packingItems = await prisma.packingItem.findMany({
      include: {
        productionItem: { include: { masterPart: true } },
        distributionItems: true
      }
    });

    return packingItems.map(p => {
      const distQty = p.distributionItems.reduce((s, d) => s + d.quantity, 0);
      return {
        ...p,
        availableQuantity: p.packageCount - distQty
      };
    }).filter(p => p.availableQuantity > 0);
  }

  static async getAvailableDistributionItems() {
    // Digunakan untuk Form Retur (Barang Sisa)
    const distItems = await prisma.distributionItem.findMany({
      include: {
        packingItem: { include: { productionItem: { include: { masterPart: true } } } },
        returnedItems: true
      }
    });

    return distItems.map(d => {
      const returnedQty = d.returnedItems.reduce((s, r) => s + r.quantity, 0);
      return {
        ...d,
        availableToReturn: d.quantity - returnedQty
      };
    }).filter(d => d.availableToReturn > 0);
  }


}
