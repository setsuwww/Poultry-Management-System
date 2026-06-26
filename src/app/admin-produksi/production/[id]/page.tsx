import { ProductionRepository } from "@/server/repositories/production.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, Scale, Percent } from "lucide-react";

export default async function ProductionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const batch = await ProductionRepository.findBatchById(id);

  if (!batch) {
    notFound();
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin-produksi/production" className="p-2 border rounded-md hover:bg-mist-100 dark:hover:bg-mist-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Produksi</h1>
          <p className="text-mist-500">Batch: <span className="font-semibold text-orange-600">{batch.batchNo}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Kolom Kiri: Info Ayam Masuk */}
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4 md:col-span-1">
          <h2 className="font-semibold text-lg border-b pb-2">Data Ayam Masuk</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-mist-500 block">No DO</span>
              <span className="font-medium">{batch.incomingChicken.deliveryOrder}</span>
            </div>
            <div>
              <span className="text-mist-500 block">Kandang</span>
              <span className="font-medium">{batch.incomingChicken.farm.name}</span>
            </div>
            <div>
              <span className="text-mist-500 block">Tanggal Timbang</span>
              <span className="font-medium">{batch.incomingChicken.date.toLocaleDateString('id-ID')}</span>
            </div>
            <div>
              <span className="text-mist-500 block">Supir / Kendaraan</span>
              <span className="font-medium">{batch.incomingChicken.driver.name} / {batch.incomingChicken.vehicle.plateNo}</span>
            </div>
            <div className="pt-2 border-t mt-2">
              <span className="text-mist-500 block">Berat Hidup Total</span>
              <span className="font-bold text-lg">{batch.incomingChicken.totalWeight.toLocaleString()} kg</span>
            </div>
            <div>
              <span className="text-mist-500 block">Jumlah Ekor</span>
              <span className="font-medium">{batch.incomingChicken.totalCount.toLocaleString()} ekor</span>
            </div>
          </div>
        </div>

        {/* Kolom Tengah & Kanan: Hasil Produksi & KPI */}
        <div className="space-y-6 md:col-span-2">

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900 flex flex-col">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500 mb-2">
                <Box className="h-5 w-5" />
                <span className="font-medium text-sm">Total Produksi</span>
              </div>
              <span className="text-2xl font-bold">{batch.totalWeight.toLocaleString()} kg</span>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900 flex flex-col">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500 mb-2">
                <Percent className="h-5 w-5" />
                <span className="font-medium text-sm">Yield Produksi</span>
              </div>
              <span className="text-2xl font-black">{batch.yieldPercentage.toFixed(2)}%</span>
            </div>

            <div className="bg-mist-50 dark:bg-mist-900 p-4 rounded-xl border flex flex-col">
              <div className="flex items-center gap-2 text-mist-600 dark:text-mist-400 mb-2">
                <Scale className="h-5 w-5" />
                <span className="font-medium text-sm">Selisih Berat</span>
              </div>
              <span className={`text-2xl font-bold ${batch.weightDifference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {batch.weightDifference > 0 ? '+' : ''}{batch.weightDifference.toFixed(2)} kg
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
              <h2 className="font-semibold text-lg">Rincian Bagian Ayam</h2>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Bagian / Part</th>
                  <th className="px-6 py-3 font-medium text-right">Berat (kg)</th>
                  <th className="px-6 py-3 font-medium text-right">Persentase (%)</th>
                </tr>
              </thead>
              <tbody>
                {batch.productionItems.map((item) => (
                  <tr key={item.id} className="border-b dark:border-mist-800">
                    <td className="px-6 py-4 font-medium">{item.masterPart.name}</td>
                    <td className="px-6 py-4 text-right font-semibold">{item.weight.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-mist-500">
                      {((item.weight / batch.incomingChicken.totalWeight) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-bold bg-mist-50 dark:bg-mist-900">
                <tr>
                  <td className="px-6 py-4">TOTAL</td>
                  <td className="px-6 py-4 text-right text-orange-600">{batch.totalWeight.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-orange-600">{batch.yieldPercentage.toFixed(2)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
