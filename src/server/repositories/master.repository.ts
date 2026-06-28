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

  // FARMS (Kandang)
  static async createFarm(name: string) {
    return prisma.farm.create({ data: { name } });
  }
  static async updateFarm(id: string, name: string) {
    return prisma.farm.update({ where: { id }, data: { name } });
  }
  static async deleteFarm(id: string) {
    return prisma.farm.delete({ where: { id } });
  }

  // DRIVERS (Supir)
  static async createDriver(name: string) {
    return prisma.driver.create({ data: { name } });
  }
  static async updateDriver(id: string, name: string) {
    return prisma.driver.update({ where: { id }, data: { name } });
  }
  static async deleteDriver(id: string) {
    return prisma.driver.delete({ where: { id } });
  }

  // VEHICLES (Kendaraan)
  static async createVehicle(plateNo: string) {
    return prisma.vehicle.create({ data: { plateNo } });
  }
  static async updateVehicle(id: string, plateNo: string) {
    return prisma.vehicle.update({ where: { id }, data: { plateNo } });
  }
  static async deleteVehicle(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  }
}
