import { prisma } from "@/lib/prisma";

export class TransferRepository {
  static async getTransfers(outletId?: string) {
    return prisma.stockTransfer.findMany({
      where: outletId ? {
        OR: [{ fromOutletId: outletId }, { toOutletId: outletId }]
      } : undefined,
      include: {
        fromOutlet: true,
        toOutlet: true,
        items: { include: { masterPart: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getOutlets() {
    return prisma.outlet.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
