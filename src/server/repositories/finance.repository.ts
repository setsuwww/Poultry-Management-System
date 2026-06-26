import { prisma } from "@/lib/prisma";

export class FinanceRepository {
  static async getDashboardKPI() {
    const pendingDeposits = await prisma.cashDeposit.aggregate({
      where: { status: "MENUNGGU_VERIFIKASI" },
      _count: { id: true },
      _sum: { amount: true }
    });

    const liabilities = await prisma.cashierLiability.aggregate({
      where: { status: "BELUM_DIBAYAR" },
      _sum: { liabilityAmount: true }
    });

    const compensations = await prisma.minusCompensation.aggregate({
      _sum: { amountApplied: true }
    });

    return {
      pendingDepositCount: pendingDeposits._count.id || 0,
      pendingDepositAmount: pendingDeposits._sum.amount || 0,
      totalCashierLiabilities: liabilities._sum.liabilityAmount || 0,
      totalMinusCompensated: compensations._sum.amountApplied || 0
    };
  }

  static async getPendingDeposits() {
    return prisma.cashDeposit.findMany({
      where: { status: "MENUNGGU_VERIFIKASI" },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async getDepositHistory() {
    return prisma.cashDeposit.findMany({
      include: {
        verification: true,
        liabilities: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getLiabilities() {
    return prisma.cashierLiability.findMany({
      include: {
        cashDeposit: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
