import { KasirRepository } from "@/server/repositories/kasir.repository";
import { KasirKpiCards } from "@/components/kasir/KasirKpiCards";
import { KasirTrendChart } from "@/components/kasir/KasirTrendChart";
import { TodayDistributionTable } from "@/components/kasir/TodayDistributionTable";
import { RekapStokTable } from "@/components/kasir/RekapStokTable";

export default async function KasirDashboardPage() {
  const [kpiData, trendData, todayDistribution, stockRecap] = await Promise.all([
    KasirRepository.getDashboardKPI(),
    KasirRepository.getDailyRevenueChart(),
    KasirRepository.getTodayDistributionList(),
    KasirRepository.getStockRecap(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Dashboard Kasir Produksi</h1>
        <p className="text-mist-500 mt-2">Ringkasan aliran barang, stok inventory, dan pencatatan omset.</p>
      </div>

      <KasirKpiCards data={kpiData} />

      <div className="grid grid-cols-1 gap-6">
        <KasirTrendChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TodayDistributionTable data={todayDistribution as any} />
        <RekapStokTable data={stockRecap} />
      </div>
    </div>
  );
}
