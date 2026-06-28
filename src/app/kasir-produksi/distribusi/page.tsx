import { DistributionForm } from "@/components/kasir/forms/DistributionForm";
import { KasirRepository } from "@/server/repositories/kasir.repository";
import { prisma } from "@/lib/prisma";

export default async function KasirDistributionPage() {
  const [packingItems, drivers, vehicles] = await Promise.all([
    KasirRepository.getAvailablePackingItems(),
    prisma.driver.findMany(),
    prisma.vehicle.findMany()
  ]);

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Input Distribusi</h1>
        <p className="text-mist-500 mt-2">Buat Surat Jalan dan kirim barang ke Outlet/Reseller.</p>
      </div>

      <DistributionForm packingItems={packingItems} drivers={drivers} vehicles={vehicles} />
    </div>
  );
}
