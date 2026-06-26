import { LedgerService } from "@/server/services/ledger.service";
import { ArrowDownRight, ArrowUpRight, MinusSquare } from "lucide-react";

export default async function InventoryLedgerPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const transactions = await LedgerService.getInventoryLedgers({});

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Buku Besar Persediaan</h1>
          <p className="text-mist-500 mt-2">Pencatatan riwayat *Double-Entry* untuk seluruh pergerakan barang (Inventory Ledger).</p>
        </div>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-mist-50 dark:bg-mist-900">
          <p className="text-sm font-semibold text-mist-600">Terakhir diperbarui: 200 Transaksi Terbaru</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-100 dark:bg-mist-800 border-b">
              <tr>
                <th className="px-6 py-4">Waktu & Tanggal</th>
                <th className="px-6 py-4">Outlet</th>
                <th className="px-6 py-4">Tipe Transaksi / Ref</th>
                <th className="px-6 py-4">Barang</th>
                <th className="px-6 py-4 text-center">Masuk</th>
                <th className="px-6 py-4 text-center">Keluar</th>
                <th className="px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-mist-500">
                    Belum ada riwayat transaksi mutasi.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="border-b hover:bg-mist-50 dark:hover:bg-mist-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-mist-900">{new Date(trx.createdAt).toLocaleDateString("id-ID")}</div>
                      <div className="text-xs text-mist-500">{new Date(trx.createdAt).toLocaleTimeString("id-ID")}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {trx.outlet.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 font-bold text-mist-800 text-xs px-2 py-1 bg-mist-200 rounded">
                        {trx.transactionType.replace('_', ' ')}
                      </div>
                      <div className="text-xs font-mono text-mist-500 mt-1">{trx.referenceNo}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {trx.masterPart.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {trx.qtyIn > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                          <ArrowDownRight className="w-4 h-4" /> +{trx.qtyIn}
                        </span>
                      ) : (
                        <span className="text-mist-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {trx.qtyOut > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">
                          <ArrowUpRight className="w-4 h-4" /> -{trx.qtyOut}
                        </span>
                      ) : (
                        <span className="text-mist-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-mist-600 font-medium">
                      {trx.user}
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
