import Link from "next/link";
import { IncomingChickenRepository } from "@/server/repositories/incoming-chicken.repository";
import { Plus } from "lucide-react";

export default async function IncomingChickenPage() {
  const incomingList = await IncomingChickenRepository.findAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Data Timbangan Ayam Hidup</h1>
          <p className="text-mist-500 mt-2">Daftar penerimaan ayam hidup dari kandang.</p>
        </div>
        <Link
          href="/admin-produksi/incoming/new"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Input Timbangan
        </Link>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">No DO</th>
                <th className="px-6 py-4 font-medium">Kandang</th>
                <th className="px-6 py-4 font-medium">Supir / No Polisi</th>
                <th className="px-6 py-4 font-medium text-right">Berat (kg)</th>
                <th className="px-6 py-4 font-medium text-right">Ekor</th>
                <th className="px-6 py-4 font-medium text-right">Rata-rata/ekor</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {incomingList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-mist-500">
                    Belum ada data timbangan.
                  </td>
                </tr>
              ) : (
                incomingList.map((item) => (
                  <tr key={item.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                    <td className="px-6 py-4">{item.date.toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 font-medium">{item.deliveryOrder}</td>
                    <td className="px-6 py-4">{item.farm.name}</td>
                    <td className="px-6 py-4">
                      {item.driver.name} <br />
                      <span className="text-mist-400 text-xs">{item.vehicle.plateNo}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{item.totalWeight.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{item.totalCount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-mist-500">
                      {(item.totalWeight / item.totalCount).toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.productionBatch ? (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full dark:bg-green-900/30 dark:text-green-400">
                          Diproduksi
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                          Menunggu
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
