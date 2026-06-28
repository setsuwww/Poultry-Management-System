import Link from "next/link";
import { PackingRepository } from "@/server/repositories/packing.repository";
import { Plus, Eye } from "lucide-react";

export default async function PackingPage() {
  const batches = await PackingRepository.findAllBatches();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Hasil Packing</h1>
          <p className="text-mist-500 mt-2">Daftar rekapitulasi pengemasan hasil produksi.</p>
        </div>
        <Link
          href="/admin-produksi/packing/new"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Input Packing
        </Link>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-6 py-4 font-medium">Packing Date</th>
                <th className="px-6 py-4 font-medium">Production Batch</th>
                <th className="px-6 py-4 font-medium">Total Item</th>
                <th className="px-6 py-4 font-medium text-right">Berat Kotor</th>
                <th className="px-6 py-4 font-medium text-right">Penyusutan</th>
                <th className="px-6 py-4 font-medium text-right">Berat Bersih (Pengambilan)</th>
                <th className="px-6 py-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-mist-500">
                    Belum ada data packing.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => {
                  const totalGross = batch.packingItems.reduce((sum, item) => sum + item.grossWeight, 0);
                  const totalNet = batch.packingItems.reduce((sum, item) => sum + item.netWeight, 0);
                  const totalShrinkage = batch.packingItems.reduce((sum, item) => sum + (item.shrinkage * item.packageCount), 0);

                  return (
                    <tr key={batch.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                      <td className="px-6 py-4 font-bold text-mist-900 dark:text-white">
                        {batch.packingDate.toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-orange-600 font-semibold">
                        {batch.productionBatch.batchNo}
                      </td>
                      <td className="px-6 py-4">{batch.packingItems.length} Jenis</td>
                      <td className="px-6 py-4 text-right font-medium">{totalGross.toFixed(2)} kg</td>
                      <td className="px-6 py-4 text-right text-orange-500 font-medium">{totalShrinkage.toFixed(2)} kg</td>
                      <td className="px-6 py-4 text-right font-bold">{totalNet.toFixed(2)} kg</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/admin-produksi/packing/${batch.id}`}
                          className="inline-flex items-center gap-1 text-sm bg-mist-100 hover:bg-mist-200 dark:bg-mist-800 dark:hover:bg-mist-700 px-3 py-1.5 rounded-md transition-colors font-medium text-mist-700 dark:text-mist-300"
                        >
                          <Eye className="h-4 w-4" /> Detail
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
