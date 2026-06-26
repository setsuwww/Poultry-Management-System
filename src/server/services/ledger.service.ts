import { prisma } from "@/lib/prisma";

export class LedgerService {
  static async getInventoryLedgers(filters?: { outletId?: string; startDate?: Date; endDate?: Date; transactionType?: string; masterPartId?: string }) {
    const where: any = {};
    if (filters) {
      if (filters.outletId) where.outletId = filters.outletId;
      if (filters.masterPartId) where.masterPartId = filters.masterPartId;
      if (filters.transactionType) where.transactionType = filters.transactionType;
      
      if (filters.startDate && filters.endDate) {
        where.date = { gte: filters.startDate, lte: filters.endDate };
      }
    }

    return prisma.inventoryLedger.findMany({
      where,
      include: {
        outlet: true,
        masterPart: true
      },
      orderBy: { createdAt: 'desc' },
      take: 200 // Limit for performance
    });
  }

  static async getStockDifferencesData() {
    return prisma.stockDifference.findMany({
      include: {
        masterPart: true,
        soVerification: {
          include: { outletClosing: { include: { outlet: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
