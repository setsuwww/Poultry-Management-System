import { prisma } from "@/lib/prisma";

export class PackingRepository {
  static async getProductionBatchesForPacking() {
    return prisma.productionBatch.findMany({
      include: {
        incomingChicken: {
          include: { farm: true }
        },
        productionItems: {
          include: { masterPart: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProductionBatchItemsWithRemainingWeight(batchId: string) {
    const items = await prisma.productionItem.findMany({
      where: { productionBatchId: batchId },
      include: {
        masterPart: true,
        packingItems: true,
      }
    });

    return items.map(item => {
      const totalPackedWeight = item.packingItems.reduce((sum, p) => sum + p.netWeight, 0);
      return {
        ...item,
        totalPackedWeight,
        remainingWeight: item.weight - totalPackedWeight
      };
    });
  }

  static async findAllBatches() {
    return prisma.packingBatch.findMany({
      include: {
        productionBatch: {
          include: { incomingChicken: { include: { farm: true } } }
        },
        packingItems: {
          include: { productionItem: { include: { masterPart: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findBatchById(id: string) {
    return prisma.packingBatch.findUnique({
      where: { id },
      include: {
        productionBatch: {
          include: { incomingChicken: { include: { farm: true, driver: true, vehicle: true } } }
        },
        packingItems: {
          include: { productionItem: { include: { masterPart: true } } }
        }
      }
    });
  }

  static async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [batchCount, items] = await Promise.all([
      prisma.packingBatch.count({
        where: { packingDate: { gte: today } }
      }),
      prisma.packingItem.findMany({
        where: { packingBatch: { packingDate: { gte: today } } }
      })
    ]);

    let totalGrossWeight = 0;
    let totalShrinkage = 0;
    let count5kg = 0;
    let count10kg = 0;

    for (const item of items) {
      totalGrossWeight += item.grossWeight;
      totalShrinkage += (item.shrinkage * item.packageCount);
      if (item.packageSize === 5) count5kg += item.packageCount;
      if (item.packageSize === 10) count10kg += item.packageCount;
    }

    return {
      batchCount,
      totalGrossWeight,
      totalShrinkage,
      count5kg,
      count10kg
    };
  }

  static async createPackingBatch(data: {
    productionBatchId: string;
    packingDate: Date;
    notes?: string;
    items: {
      productionItemId: string;
      packageSize: number;
      packageCount: number;
    }[];
  }) {
    return prisma.$transaction(async (tx) => {
      // Validasi setiap item
      const processedItems = [];

      for (const item of data.items) {
        const prodItem = await tx.productionItem.findUnique({
          where: { id: item.productionItemId },
        });
        if (!prodItem) throw new Error(`Production Item ${item.productionItemId} not found`);

        const packedAgg = await tx.packingItem.aggregate({
          where: { productionItemId: item.productionItemId },
          _sum: { netWeight: true }
        });
        const currentPacked = packedAgg._sum.netWeight || 0;
        
        const SHRINKAGE = 0.2;
        const netWeight = (item.packageSize + SHRINKAGE) * item.packageCount;

        if (prodItem.weight - currentPacked < netWeight) {
          throw new Error(`Berat produksi tidak mencukupi.`);
        }
        
        processedItems.push({
          productionItemId: item.productionItemId,
          packageSize: item.packageSize,
          shrinkage: SHRINKAGE,
          packageCount: item.packageCount,
          grossWeight: item.packageSize * item.packageCount,
          netWeight: netWeight,
          remainingWeight: prodItem.weight - currentPacked - netWeight,
        });
      }

      const packingBatch = await tx.packingBatch.create({
        data: {
          productionBatchId: data.productionBatchId,
          packingDate: data.packingDate,
          notes: data.notes,
          packingItems: {
            create: processedItems
          }
        },
        include: { packingItems: true }
      });

      return packingBatch;
    });
  }
}
