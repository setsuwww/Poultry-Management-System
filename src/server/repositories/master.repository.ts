import { prisma } from "@/lib/prisma";

export class MasterRepository {
  static async getFarms() {
    return prisma.farm.findMany({ orderBy: { name: 'asc' } });
  }

  static async getDrivers() {
    return prisma.driver.findMany({ orderBy: { name: 'asc' } });
  }

  static async getVehicles() {
    return prisma.vehicle.findMany({ orderBy: { plateNo: 'asc' } });
  }

  static async getMasterParts() {
    return prisma.masterPart.findMany({ orderBy: { name: 'asc' } });
  }
}
