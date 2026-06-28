import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class IncomingChickenRepository {
  static async create(data: Prisma.IncomingChickenUncheckedCreateInput) {
    return prisma.incomingChicken.create({
      data,
    });
  }

  static async findAll() {
    return prisma.incomingChicken.findMany({
      include: {
        farm: true,
        driver: true,
        vehicle: true,
        productionBatch: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  static async findAvailableForProduction() {
    return prisma.incomingChicken.findMany({
      where: {
        productionBatch: null, // Only chickens that haven't been processed
      },
      include: {
        farm: true,
        driver: true,
        vehicle: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  static async findById(id: string) {
    return prisma.incomingChicken.findUnique({
      where: { id },
      include: {
        farm: true,
        driver: true,
        vehicle: true,
      },
    });
  }
}
