import { ClosingRepository } from "@/server/repositories/closing.repository";
import { LedgerService } from "@/server/services/ledger.service";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { AdminSODashboard } from "@/components/admin-so/dashboard/AdminSODashboard";

export default async function AdminSOPage() {
  const pendingClosings = await ClosingRepository.getPendingClosings();
  const differences = await LedgerService.getStockDifferencesData();

  let totalSusut = 0;
  let totalHilang = 0;

  // Aggregate data for charts
  const chartMap: Record<string, { date: string, susut: number, hilang: number }> = {};

  differences.forEach(diff => {
    if (diff.classification === "SUSUT") totalSusut += diff.missingQuantity;
    if (diff.classification === "HILANG") totalHilang += diff.missingQuantity;

    const date = new Date(diff.createdAt).toLocaleDateString("id-ID");
    if (!chartMap[date]) chartMap[date] = { date, susut: 0, hilang: 0 };

    if (diff.classification === "SUSUT") chartMap[date].susut += diff.missingQuantity;
    if (diff.classification === "HILANG") chartMap[date].hilang += diff.missingQuantity;
  });

  const chartData = Object.values(chartMap).slice(-14); // Last 14 days

  return (
    <div className="mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Audit Stock Opname</h1>
          <p className="text-mist-500 mt-2">Daftar laporan Closing Harian Outlet yang menunggu verifikasi fisik oleh Admin SO.</p>
        </div>
      </div>

      <AdminSODashboard totalSusut={totalSusut} totalHilang={totalHilang} chartData={chartData} />

      <div className="bg-white dark:bg-mist-950 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900 border-b">
              <tr>
                <th className="px-6 py-4">Tanggal / Waktu</th>
                <th className="px-6 py-4">Outlet</th>
                <th className="px-6 py-4">Petugas Shift</th>
                <th className="px-6 py-4 text-center">Jumlah Item</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingClosings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-mist-500">
                    <ClipboardList className="w-12 h-12 mx-auto text-mist-300 mb-3" />
                    Tidak ada antrean closing yang menunggu verifikasi.
                  </td>
                </tr>
              ) : (
                pendingClosings.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-mist-50 dark:hover:bg-mist-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-mist-900">{new Date(c.date).toLocaleDateString("id-ID")}</div>
                      <div className="text-xs text-mist-500">{new Date(c.createdAt).toLocaleTimeString("id-ID")}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-rose-600">
                      {c.outlet.name}
                    </td>
                    <td className="px-6 py-4">
                      {c.employees.map(emp => (
                        <div key={emp.id} className="text-xs font-medium bg-mist-100 dark:bg-mist-800 px-2 py-1 rounded inline-block mr-1 mb-1">
                          {emp.name} <span className="text-mist-400 font-normal">({emp.role})</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {c.items.length}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin-so/so/verifikasi/${c.id}`}>
                        <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 w-full md:w-auto">
                          Verifikasi SO <ArrowRight className="w-4 h-4" />
                        </button>
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
