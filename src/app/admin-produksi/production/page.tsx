import Link from "next/link";
import { ProductionRepository } from "@/server/repositories/production.repository";
import { Plus, Eye } from "lucide-react";

export default async function ProductionBatchPage() {
  const batches = await ProductionRepository.findAllBatches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Hasil Produksi</h1>
          <p className="text-mist-500 mt-2">Daftar rekapitulasi hasil produksi dari ayam hidup (DO).</p>
        </div>
        <Link
          href="/admin-produksi/production/new"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Input Produksi
        </Link>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-6 py-4 font-medium">Batch No</th>
                <th className="px-6 py-4 font-medium">Waktu Produksi</th>
                <th className="px-6 py-4 font-medium">No DO / Kandang</th>
                <th className="px-6 py-4 font-medium text-right">Berat Hidup</th>
                <th className="px-6 py-4 font-medium text-right">Total Produksi</th>
                <th className="px-6 py-4 font-medium text-right">Yield</th>
                <th className="px-6 py-4 font-medium text-right">Selisih</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-mist-500">
                    Belum ada data produksi.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                    <td className="px-6 py-4 font-bold text-orange-600">{batch.batchNo}</td>
                    <td className="px-6 py-4">{batch.createdAt.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      {batch.incomingChicken.deliveryOrder} <br />
                      <span className="text-mist-400 text-xs">{batch.incomingChicken.farm.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right">{batch.incomingChicken.totalWeight.toLocaleString()} kg</td>
                    <td className="px-6 py-4 text-right font-semibold">{batch.totalWeight.toLocaleString()} kg</td>
                    <td className="px-6 py-4 text-right font-bold text-orange-600">{batch.yieldPercentage.toFixed(2)}%</td>
                    <td className={`px-6 py-4 text-right font-medium ${batch.weightDifference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {batch.weightDifference > 0 ? '+' : ''}{batch.weightDifference.toFixed(2)} kg
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/production/${batch.id}`}
                        className="inline-flex items-center gap-1 text-sm bg-mist-100 hover:bg-mist-200 dark:bg-mist-800 dark:hover:bg-mist-700 px-3 py-1.5 rounded-md transition-colors font-medium text-mist-700 dark:text-mist-300"
                      >
                        <Eye className="h-4 w-4" /> Detail
                      </Link>
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
