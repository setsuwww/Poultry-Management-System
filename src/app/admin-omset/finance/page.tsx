import { FinanceRepository } from "@/server/repositories/finance.repository";
import { FinanceDashboardKPI } from "@/components/finance/FinanceDashboardKPI";
import { ShieldCheck } from "lucide-react";

export default async function FinanceDashboardPage() {
  const kpi = await FinanceRepository.getDashboardKPI();
  const history = await FinanceRepository.getDepositHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Dashboard Finance & Audit</h1>
        <p className="text-mist-500 mt-2">Pusat kontrol validasi setoran, kompensasi kerugian, dan denda karyawan.</p>
      </div>

      <FinanceDashboardKPI data={kpi} />

      <div className="pt-6">
        <h3 className="font-bold text-mist-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rose-500" />
          Riwayat Verifikasi Setoran Terakhir
        </h3>
        <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Tanggal / Kasir</th>
                  <th className="px-4 py-3 font-medium text-center">Disetor (Fisik)</th>
                  <th className="px-4 py-3 font-medium text-center">Sales (Sistem)</th>
                  <th className="px-4 py-3 font-medium text-center">Selisih</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-mist-500">Belum ada riwayat setoran.</td></tr>
                ) : (
                  history.slice(0, 10).map((h) => (
                    <tr key={h.id} className="border-b hover:bg-mist-50">
                      <td className="px-4 py-3">
                        <span className="block font-bold">{new Date(h.date).toLocaleDateString("id-ID")}</span>
                        <span className="text-xs text-mist-500">{h.cashierName}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">Rp {h.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        {h.verification ? `Rp ${h.verification.actualSalesAmount.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-4 py-3 text-center font-bold">
                        {h.verification ? (
                          h.verification.difference < 0
                            ? <span className="text-red-600">- Rp {Math.abs(h.verification.difference).toLocaleString()}</span>
                            : h.verification.difference > 0
                              ? <span className="text-emerald-600">+ Rp {h.verification.difference.toLocaleString()}</span>
                              : <span className="text-mist-500">Sesuai</span>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${h.status === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                            h.status === 'PERLU_KLARIFIKASI' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {h.status.replace('_', ' ')}
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
    </div>
  );
}
