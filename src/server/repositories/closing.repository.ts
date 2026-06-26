import { prisma } from "@/lib/prisma";

export class ClosingRepository {
  static async getPendingClosings() {
    return prisma.outletClosing.findMany({
      where: { status: "MENUNGGU_VERIFIKASI" },
      include: {
        outlet: true,
        items: { include: { masterPart: true } },
        employees: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getClosingHistory(outletId?: string) {
    return prisma.outletClosing.findMany({
      where: outletId ? { outletId } : undefined,
      include: {
        outlet: true,
        items: { include: { masterPart: true } },
        employees: true,
        verification: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getEmployeeLiabilities() {
    return prisma.employeeLiability.findMany({
      include: {
        stockDifference: {
          include: {
            masterPart: true,
            soVerification: { include: { outletClosing: { include: { outlet: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
