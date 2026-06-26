import { prisma } from "@/lib/prisma";

export class ProductionRepository {
  static async createBatch(data: {
    batchNo: string;
    incomingChickenId: string;
    totalWeight: number;
    yieldPercentage: number;
    weightDifference: number;
    items: {
      masterPartId: string;
      weight: number;
    }[];
  }) {
    return prisma.productionBatch.create({
      data: {
        batchNo: data.batchNo,
        incomingChickenId: data.incomingChickenId,
        totalWeight: data.totalWeight,
        yieldPercentage: data.yieldPercentage,
        weightDifference: data.weightDifference,
        productionItems: {
          create: data.items.map(item => ({
            masterPartId: item.masterPartId,
            weight: item.weight,
          })),
        },
      },
      include: {
        productionItems: true,
      }
    });
  }

  static async findAllBatches() {
    return prisma.productionBatch.findMany({
      include: {
        incomingChicken: {
          include: {
            farm: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });
  }

  static async findBatchById(id: string) {
    return prisma.productionBatch.findUnique({
      where: { id },
      include: {
        incomingChicken: {
          include: {
            farm: true,
            driver: true,
            vehicle: true,
          }
        },
        productionItems: {
          include: {
            masterPart: true,
          }
        }
      }
    });
  }

  // 1. KPI Hari Ini
  static async getDailyKPI() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      batchesToday,
      incomingStats,
      productionStats
    ] = await Promise.all([
      prisma.productionBatch.count({
        where: { createdAt: { gte: today } }
      }),
      prisma.incomingChicken.aggregate({
        where: { date: { gte: today } },
        _sum: { totalWeight: true, totalCount: true }
      }),
      prisma.productionBatch.aggregate({
        where: { createdAt: { gte: today } },
        _sum: { totalWeight: true },
        _avg: { yieldPercentage: true }
      })
    ]);

    return {
      batchCount: batchesToday,
      totalIncomingWeight: incomingStats._sum.totalWeight || 0,
      totalChickenCount: incomingStats._sum.totalCount || 0,
      totalProductionWeight: productionStats._sum.totalWeight || 0,
      avgYield: productionStats._avg.yieldPercentage || 0,
    };
  }

  // 2. Tabel Hasil Pemotongan Hari Ini
  static async getTodayProductionList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.productionBatch.findMany({
      where: { createdAt: { gte: today } },
      include: {
        incomingChicken: {
          include: { farm: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 3. Rekap Produksi Per Kandang
  static async getProductionRecapByFarm() {
    const farms = await prisma.farm.findMany({
      include: {
        incomingChickens: {
          include: { productionBatch: true }
        }
      }
    });

    return farms.map(farm => {
      let batchCount = 0;
      let totalIncoming = 0;
      let totalProduction = 0;

      farm.incomingChickens.forEach(inc => {
        if (inc.productionBatch) {
          batchCount++;
          totalIncoming += inc.totalWeight;
          totalProduction += inc.productionBatch.totalWeight;
        }
      });

      return {
        farmName: farm.name,
        batchCount,
        totalIncoming,
        totalProduction
      };
    }).filter(f => f.batchCount > 0).sort((a, b) => b.totalProduction - a.totalProduction);
  }

  // 4. Rekap Produksi Per Bagian Ayam
  static async getProductionRecapByPart() {
    const grouped = await prisma.productionItem.groupBy({
      by: ['masterPartId'],
      _sum: { weight: true }
    });

    const parts = await prisma.masterPart.findMany();
    
    return parts.map(part => {
      const g = grouped.find(x => x.masterPartId === part.id);
      return {
        partName: part.name,
        totalWeight: g?._sum.weight || 0
      };
    }).sort((a, b) => b.totalWeight - a.totalWeight);
  }

  // 5. Stok Utama (Inventory Status)
  static async getInventoryStatus() {
    const parts = await prisma.masterPart.findMany();
    
    const prodGrouped = await prisma.productionItem.groupBy({
      by: ['masterPartId'],
      _sum: { weight: true }
    });

    const packingItems = await prisma.packingItem.findMany({
      include: { productionItem: true }
    });

    const packingMap = new Map<string, number>();
    for (const item of packingItems) {
      const partId = item.productionItem.masterPartId;
      const current = packingMap.get(partId) || 0;
      packingMap.set(partId, current + item.netWeight);
    }

    return parts.map(part => {
      const produced = prodGrouped.find(x => x.masterPartId === part.id)?._sum.weight || 0;
      const packed = packingMap.get(part.id) || 0;
      const distributed = 0;
      
      return {
        partName: part.name,
        produced,
        packed,
        distributed,
        remaining: produced - packed - distributed
      };
    }).sort((a, b) => b.remaining - a.remaining);
  }

  // 6. Grafik Produksi Harian (Trend)
  static async getDailyProductionChart() {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 14);

    const batches = await prisma.productionBatch.findMany({
      where: { createdAt: { gte: dateLimit } },
      include: { incomingChicken: true },
      orderBy: { createdAt: 'asc' }
    });

    const dailyMap = new Map<string, { date: string, incoming: number, production: number }>();

    for (const b of batches) {
      // Gunakan local date string
      const dateStr = b.createdAt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, { date: dateStr, incoming: 0, production: 0 });
      }
      const dayData = dailyMap.get(dateStr)!;
      dayData.incoming += b.incomingChicken.totalWeight;
      dayData.production += b.totalWeight;
    }

    return Array.from(dailyMap.values());
  }
}
