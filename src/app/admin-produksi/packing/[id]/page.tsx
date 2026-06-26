import { PackingRepository } from "@/server/repositories/packing.repository";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, Scale, PackageOpen } from "lucide-react";

export default async function PackingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const batch = await PackingRepository.findBatchById(id);

  if (!batch) {
    notFound();
  }

  const totalGross = batch.packingItems.reduce((sum, item) => sum + item.grossWeight, 0);
  const totalNet = batch.packingItems.reduce((sum, item) => sum + item.netWeight, 0);
  const totalShrinkage = batch.packingItems.reduce((sum, item) => sum + (item.shrinkage * item.packageCount), 0);
  const totalPlastik = batch.packingItems.reduce((sum, item) => sum + item.packageCount, 0);

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-produksi/packing" className="p-2 border rounded-md hover:bg-mist-100 dark:hover:bg-mist-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detail Packing</h1>
            <p className="text-mist-500">
              Tanggal: <span className="font-semibold text-mist-900 dark:text-white">{batch.packingDate.toLocaleDateString('id-ID')}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-mist-500">Oleh: {batch.createdBy}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm md:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Info Produksi</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-mist-500 block">Production Batch</span>
              <span className="font-bold text-orange-600">{batch.productionBatch.batchNo}</span>
            </div>
            <div>
              <span className="text-mist-500 block">No DO / Kandang</span>
              <span className="font-medium">{batch.productionBatch.incomingChicken.deliveryOrder} <br /> {batch.productionBatch.incomingChicken.farm.name}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-mist-50 dark:bg-mist-900 p-4 rounded-xl border flex flex-col">
            <div className="flex items-center gap-2 text-mist-600 dark:text-mist-400 mb-2">
              <Box className="h-5 w-5" />
              <span className="font-medium text-sm">Berat Bersih (Gross)</span>
            </div>
            <span className="text-2xl font-bold">{totalGross.toFixed(2)} kg</span>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900 flex flex-col">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-500 mb-2">
              <Scale className="h-5 w-5" />
              <span className="font-medium text-sm">Penyusutan Kemasan</span>
            </div>
            <span className="text-2xl font-black text-orange-600">{totalShrinkage.toFixed(2)} kg</span>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900 flex flex-col">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-500 mb-2">
              <PackageOpen className="h-5 w-5" />
              <span className="font-medium text-sm">Total Pengambilan (Net)</span>
            </div>
            <span className="text-2xl font-bold text-green-700 dark:text-green-500">{totalNet.toFixed(2)} kg</span>
          </div>
        </div>

      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
          <h2 className="font-semibold text-lg">Rincian Item Packing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-6 py-3 font-medium">Bagian / Part</th>
                <th className="px-6 py-3 font-medium text-center">Ukuran Kemasan</th>
                <th className="px-6 py-3 font-medium text-center">Jml Plastik</th>
                <th className="px-6 py-3 font-medium text-right">Berat Bersih</th>
                <th className="px-6 py-3 font-medium text-right">Penyusutan</th>
                <th className="px-6 py-3 font-medium text-right">Total Ambil</th>
                <th className="px-6 py-3 font-medium text-right">Sisa Stok</th>
              </tr>
            </thead>
            <tbody>
              {batch.packingItems.map((item) => (
                <tr key={item.id} className="border-b dark:border-mist-800">
                  <td className="px-6 py-4 font-medium">{item.productionItem.masterPart.name}</td>
                  <td className="px-6 py-4 text-center font-bold">{item.packageSize} kg</td>
                  <td className="px-6 py-4 text-center">{item.packageCount} pcs</td>
                  <td className="px-6 py-4 text-right font-medium">{item.grossWeight.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-orange-500">{(item.shrinkage * item.packageCount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600 dark:text-green-500">{item.netWeight.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-mist-500">{item.remainingWeight.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold bg-mist-50 dark:bg-mist-900">
              <tr>
                <td colSpan={2} className="px-6 py-4">TOTAL</td>
                <td className="px-6 py-4 text-center">{totalPlastik} pcs</td>
                <td className="px-6 py-4 text-right">{totalGross.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-orange-500">{totalShrinkage.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-green-600">{totalNet.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
