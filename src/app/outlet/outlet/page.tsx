import { OutletRepository } from "@/server/repositories/outlet.repository";
import { OutletDashboardKPI } from "@/components/outlet/OutletDashboardKPI";

export default async function OutletDashboardPage() {
  const kpi = await OutletRepository.getDashboardKPI();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Dashboard Outlet</h1>
        <p className="text-mist-500 mt-2">Pantau stok barang masuk dan aktivitas keuangan di Outlet.</p>
      </div>

      <OutletDashboardKPI data={kpi} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex items-center justify-center min-h-[300px]">
          <p className="text-mist-400">Grafik Omset Harian (Coming Soon)</p>
        </div>
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex items-center justify-center min-h-[300px]">
          <p className="text-mist-400">Grafik Barang Masuk Harian (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
}
