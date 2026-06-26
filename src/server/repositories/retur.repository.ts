import { prisma } from "@/lib/prisma";

export class ReturRepository {
  static async getReturnedGoods(outletId?: string) {
    return prisma.returnedGoods.findMany({
      where: outletId ? { outletId } : undefined,
      include: {
        outlet: true,
        items: { include: { masterPart: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getRejectedGoods(outletId?: string) {
    return prisma.rejectedGoods.findMany({
      where: outletId ? { outletId } : undefined,
      include: {
        outlet: true,
        items: { include: { masterPart: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
