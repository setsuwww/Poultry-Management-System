import { DriverRepository } from "@/server/repositories/driver.repository";
import { prisma } from "@/lib/prisma";
import { AlertTriangle } from "lucide-react";

export default async function DriverMinusPage() {
  const driver = await prisma.driver.findFirst();
  if (!driver) return <div>Driver tidak ditemukan.</div>;

  const liabilities = await DriverRepository.getDriverLiabilities(driver.id);

  const totalUnpaid = liabilities
    .filter(l => l.status === "BELUM_DIBAYAR")
    .reduce((sum, curr) => sum + curr.totalLoss, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Detail Minus Driver</h1>
        <p className="text-mist-500 mt-2">Daftar selisih barang kurang saat tiba di tujuan yang menjadi tanggung jawab Anda.</p>
      </div>

      <div className="bg-red-50 border border-red-200 p-6 rounded-xl flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full text-red-600">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-sm font-semibold text-red-800 uppercase tracking-wider">Total Kerugian Berjalan</span>
          <span className="block text-3xl font-black text-red-600 mt-1">Rp {totalUnpaid.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal / SJ</th>
                <th className="px-4 py-3 font-medium">Barang</th>
                <th className="px-4 py-3 font-medium text-center">Dikirim</th>
                <th className="px-4 py-3 font-medium text-center">Diterima</th>
                <th className="px-4 py-3 font-medium text-center text-red-600">Minus</th>
                <th className="px-4 py-3 font-medium text-right">Nilai Minus</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-mist-500">Alhamdulillah, tidak ada riwayat barang minus.</td>
                </tr>
              ) : (
                liabilities.map((row) => (
                  <tr key={row.id} className="border-b dark:border-mist-800 hover:bg-mist-50">
                    <td className="px-4 py-3">
                      <span className="block font-bold text-mist-900">{row.distributionItem.distribution.sjNumber}</span>
                      <span className="text-xs text-mist-500">{new Date(row.createdAt).toLocaleDateString("id-ID")}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {row.distributionItem.packingItem.productionItem.masterPart.name}
                    </td>
                    <td className="px-4 py-3 text-center">{row.sentQuantity}</td>
                    <td className="px-4 py-3 text-center">{row.receivedQuantity}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-600">{row.missingQuantity}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="block text-xs text-mist-500">Rp {row.unitPrice.toLocaleString()}/pcs</span>
                      <span className="block font-bold text-mist-900">Rp {row.totalLoss.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'LUNAS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.status.replace('_', ' ')}
                      </span>
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
