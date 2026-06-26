import { OutletRepository } from "@/server/repositories/outlet.repository";
import { DailyRevenueForm } from "@/components/outlet/forms/DailyRevenueForm";

export default async function OutletOmsetPage() {
  const history = await OutletRepository.getRevenueHistory();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Input Omset Harian</h1>
        <p className="text-mist-500 mt-2">Pencatatan pendapatan dari penjualan di Outlet beserta pemotongan operasional.</p>
      </div>

      <DailyRevenueForm />

      <div className="pt-6">
        <h3 className="font-bold text-mist-900 mb-4">Riwayat Omset 14 Hari Terakhir</h3>
        <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium text-right text-emerald-600">Total Omset</th>
                  <th className="px-4 py-3 font-medium text-right text-red-600">Pengeluaran</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-mist-500">Belum ada riwayat.</td></tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-3 font-semibold">{h.date}</td>
                      <td className="px-4 py-3 text-right font-bold text-mist-900">Rp {h.omset.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-mist-500">Rp {h.pengeluaran.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
