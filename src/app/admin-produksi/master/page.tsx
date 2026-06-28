import { MasterRepository } from "@/server/repositories/master.repository";
import { MasterTabsUI } from "@/components/master/MasterTabsUI";

export default async function DataMasterPage() {
  const [farms, drivers, vehicles] = await Promise.all([
    MasterRepository.getFarms(),
    MasterRepository.getDrivers(),
    MasterRepository.getVehicles(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Data Master</h1>
        <p className="text-mist-500 mt-2">Kelola data referensi Kandang, Supir, dan Kendaraan untuk sistem produksi.</p>
      </div>

      <MasterTabsUI farms={farms} drivers={drivers} vehicles={vehicles} />
    </div>
  );
}
