import { FinanceRepository } from "@/server/repositories/finance.repository";

export default async function FinanceLiabilitiesPage() {
  const liabilities = await FinanceRepository.getLiabilities();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Daftar Tanggungan Kasir</h1>
        <p className="text-mist-500 mt-2">Catatan denda kasir akibat selisih kekurangan penyetoran (Kekurangan Uang Fisik × 2).</p>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal Audit</th>
                <th className="px-4 py-3 font-medium">Nama Kasir</th>
                <th className="px-4 py-3 font-medium text-right text-orange-600">Kekurangan Setoran</th>
                <th className="px-4 py-3 font-medium text-right text-red-600">Nilai Tanggungan (2x)</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-mist-500">Tidak ada riwayat tanggungan kasir.</td></tr>
              ) : (
                liabilities.map((l) => (
                  <tr key={l.id} className="border-b">
                    <td className="px-4 py-3 font-semibold">{new Date(l.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="px-4 py-3 font-bold">{l.cashDeposit.cashierName}</td>
                    <td className="px-4 py-3 text-right">Rp {l.shortageAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">Rp {l.liabilityAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${l.status === 'LUNAS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {l.status.replace('_', ' ')}
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
