import { ProductionRepository } from "@/server/repositories/production.repository";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { TodayProductionTable } from "@/components/dashboard/TodayProductionTable";
import { FarmRecapTable } from "@/components/dashboard/FarmRecapTable";
import { PartRecapTable } from "@/components/dashboard/PartRecapTable";
import { InventoryStockTable } from "@/components/dashboard/InventoryStockTable";
import { ProductionTrendChart } from "@/components/dashboard/ProductionTrendChart";

export default async function AdminProduksiDashboardPage() {
  const [
    kpiData,
    todayProduction,
    farmRecap,
    partRecap,
    inventoryStock,
    trendData
  ] = await Promise.all([
    ProductionRepository.getDailyKPI(),
    ProductionRepository.getTodayProductionList(),
    ProductionRepository.getProductionRecapByFarm(),
    ProductionRepository.getProductionRecapByPart(),
    ProductionRepository.getInventoryStatus(),
    ProductionRepository.getDailyProductionChart()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Dashboard Produksi</h1>
        <p className="text-mist-500 mt-2">Ringkasan operasional dan inventaris produksi.</p>
      </div>

      {/* 1. KPI Cards */}
      <KpiCards data={kpiData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 2. Chart (Takes 2 columns on XL screens) */}
        <div className="xl:col-span-2 min-h-[400px]">
          <ProductionTrendChart data={trendData} />
        </div>

        {/* 3. Rekap Produksi Per Bagian (Takes 1 column) */}
        <div className="xl:col-span-1">
          <PartRecapTable data={partRecap} />
        </div>
      </div>

      {/* 4. Tabel Hari Ini & Rekap Kandang */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayProductionTable data={todayProduction as any} />
        <FarmRecapTable data={farmRecap} />
      </div>

      {/* 5. Inventory Stock */}
      <InventoryStockTable data={inventoryStock} />

    </div>
  );
}
