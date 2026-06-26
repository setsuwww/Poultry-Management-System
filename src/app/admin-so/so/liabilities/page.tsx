import { ClosingRepository } from "@/server/repositories/closing.repository";

export default async function EmployeeLiabilitiesPage() {
  const liabilities = await ClosingRepository.getEmployeeLiabilities();

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Tanggungan Karyawan (Minus Barang)</h1>
        <p className="text-mist-500 mt-2">Pemantauan beban kerugian akibat selisih fisik yang dipotong dari masing-masing petugas shift.</p>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900 border-b">
              <tr>
                <th className="px-6 py-4">Tanggal Kejadian</th>
                <th className="px-6 py-4">Outlet</th>
                <th className="px-6 py-4">Nama Petugas</th>
                <th className="px-6 py-4">Barang Hilang</th>
                <th className="px-6 py-4 text-right">Tanggungan (Rp)</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-mist-500">
                    Tidak ada catatan tanggungan karyawan. Bagus!
                  </td>
                </tr>
              ) : (
                liabilities.map((l) => {
                  const closingDate = l.stockDifference.soVerification.outletClosing.date;
                  const outletName = l.stockDifference.soVerification.outletClosing.outlet.name;
                  const partName = l.stockDifference.masterPart.name;
                  const missingQty = l.stockDifference.missingQuantity;

                  return (
                    <tr key={l.id} className="border-b hover:bg-mist-50 dark:hover:bg-mist-900">
                      <td className="px-6 py-4 text-mist-600">
                        {new Date(closingDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 font-bold text-rose-600">{outletName}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-mist-900">{l.employeeName}</div>
                        <div className="text-xs text-mist-500">{l.employeeRole}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold">{partName}</span> ({missingQty} Pack)
                      </td>
                      <td className="px-6 py-4 text-right font-black text-red-600">
                        {formatRupiah(l.liabilityAmount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${l.status === 'BELUM_DIBAYAR' ? 'bg-red-100 text-red-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                          {l.status.replace('_', ' ')}
                        </span>
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
