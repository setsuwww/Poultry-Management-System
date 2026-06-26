import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  const hash = await bcrypt.hash("password123", 10);

  // ROLES
  const roleNames = [
    "Admin Produksi",
    "Kasir Produksi",
    "Driver",
    "Kasir Outlet",
    "Admin SO",
    "Admin Omset",
    "Checker Sasak"
  ];

  for (const role of roleNames) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role }
    });
  }

  const adminProdRole = await prisma.role.findUnique({ where: { name: "Admin Produksi" } });
  const kasirProdRole = await prisma.role.findUnique({ where: { name: "Kasir Produksi" } });
  const driverRole = await prisma.role.findUnique({ where: { name: "Driver" } });
  const kasirOutletRole = await prisma.role.findUnique({ where: { name: "Kasir Outlet" } });
  const adminSORole = await prisma.role.findUnique({ where: { name: "Admin SO" } });
  const adminOmsetRole = await prisma.role.findUnique({ where: { name: "Admin Omset" } });
  const checkerRole = await prisma.role.findUnique({ where: { name: "Checker Sasak" } });

  // USERS
  if (adminProdRole) await prisma.user.upsert({ where: { email: "adminproduksi@test.com" }, update: { password: hash }, create: { name: "Admin Prod 1", email: "adminproduksi@test.com", password: hash, roleId: adminProdRole.id } });
  if (kasirProdRole) await prisma.user.upsert({ where: { email: "kasirproduksi@test.com" }, update: { password: hash }, create: { name: "Kasir Prod 1", email: "kasirproduksi@test.com", password: hash, roleId: kasirProdRole.id } });
  if (driverRole) await prisma.user.upsert({ where: { email: "driver@test.com" }, update: { password: hash }, create: { name: "Supri Driver", email: "driver@test.com", password: hash, roleId: driverRole.id } });
  if (kasirOutletRole) await prisma.user.upsert({ where: { email: "kasiroutlet@test.com" }, update: { password: hash }, create: { name: "Siti Kasir", email: "kasiroutlet@test.com", password: hash, roleId: kasirOutletRole.id } });
  if (adminSORole) await prisma.user.upsert({ where: { email: "adminso@test.com" }, update: { password: hash }, create: { name: "Auditor 1", email: "adminso@test.com", password: hash, roleId: adminSORole.id } });
  if (adminOmsetRole) await prisma.user.upsert({ where: { email: "adminomset@test.com" }, update: { password: hash }, create: { name: "Finance 1", email: "adminomset@test.com", password: hash, roleId: adminOmsetRole.id } });
  if (checkerRole) await prisma.user.upsert({ where: { email: "checker@test.com" }, update: { password: hash }, create: { name: "QC 1", email: "checker@test.com", password: hash, roleId: checkerRole.id } });

  // OUTLETS & GUDANG
  await prisma.outlet.upsert({ where: { name: "Outlet Sasak Pusat" }, update: {}, create: { name: "Outlet Sasak Pusat" } });
  await prisma.outlet.upsert({ where: { name: "Outlet Sasak Cabang 1" }, update: {}, create: { name: "Outlet Sasak Cabang 1" } });

  // MASTER PARTS
  const parts = ["Dada", "Paha Atas", "Paha Bawah", "Sayap", "Karkas", "Kepala", "Ceker", "Usus", "Hati", "Ampela"];
  for (const p of parts) {
    const part = await prisma.masterPart.upsert({ where: { name: p }, update: {}, create: { name: p } });
    await prisma.productPrice.upsert({
      where: { masterPartId: part.id },
      update: {},
      create: { masterPartId: part.id, currentPrice: 50000 }
    });
  }

  // FARM & DRIVER (Legacy entities)
  await prisma.farm.upsert({ where: { id: "farm1" }, update: {}, create: { id: "farm1", name: "PT. Farm Sejahtera" } });
  await prisma.driver.upsert({ where: { id: "driver1" }, update: {}, create: { id: "driver1", name: "Pak Supri" } });
  await prisma.vehicle.upsert({ where: { plateNo: "B1234XYZ" }, update: {}, create: { plateNo: "B1234XYZ" } });

  console.log("Seeding finished successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
