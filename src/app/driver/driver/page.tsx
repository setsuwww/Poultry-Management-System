import { DriverRepository } from "@/server/repositories/driver.repository";
import { prisma } from "@/lib/prisma";
import { DriverDashboardKPI } from "@/components/driver/DriverDashboardKPI";
import { DriverTodayDeliveries } from "@/components/driver/DriverTodayDeliveries";

export default async function DriverDashboardPage() {
  // Simulate fetching logged-in driver
  const driver = await prisma.driver.findFirst();
  if (!driver) return <div>Driver tidak ditemukan. Harap input master data driver terlebih dahulu.</div>;

  const kpiData = await DriverRepository.getDashboardKPI(driver.id);
  const todayDeliveries = await DriverRepository.getTodayDeliveries(driver.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Dashboard Driver</h1>
        <p className="text-mist-500 mt-2">Pantau tugas pengiriman dan cek rekapitulasi performa harian Anda.</p>
      </div>

      <DriverDashboardKPI data={kpiData} />

      <div className="pt-4">
        <DriverTodayDeliveries data={todayDeliveries} />
      </div>
    </div>
  );
}
