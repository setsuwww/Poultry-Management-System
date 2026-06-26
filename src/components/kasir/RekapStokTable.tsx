type Props = {
  data: {
    partName: string;
    produksi: number;
    distribusi: number;
    barangSisa: number;
    stokSaatIni: number;
  }[];
};

export function RekapStokTable({ data }: Props) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Rekap Stok Produksi (Inventory)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Barang</th>
              <th className="px-4 py-3 font-medium text-center">Produksi</th>
              <th className="px-4 py-3 font-medium text-center">Distribusi</th>
              <th className="px-4 py-3 font-medium text-center">Brg Sisa (Retur)</th>
              <th className="px-4 py-3 font-medium text-center">Stok Saat Ini</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-mist-500">Belum ada data stok.</td>
              </tr>
            ) : (
              data.map((row, idx) => {
                let statusColor = "bg-green-100 text-green-700";
                let statusText = "Aman";

                if (row.stokSaatIni < 0) {
                  statusColor = "bg-red-100 text-red-700";
                  statusText = "Minus";
                } else if (row.stokSaatIni > 0 && row.stokSaatIni <= 5) {
                  statusColor = "bg-yellow-100 text-yellow-700";
                  statusText = "Hampir Habis";
                }

                return (
                  <tr key={idx} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                    <td className="px-4 py-3 font-bold text-mist-900 dark:text-white">{row.partName}</td>
                    <td className="px-4 py-3 text-center text-blue-600 font-medium">{row.produksi} Pack</td>
                    <td className="px-4 py-3 text-center text-orange-600 font-medium">{row.distribusi} Pack</td>
                    <td className="px-4 py-3 text-center text-mist-500">{row.barangSisa} Pack</td>
                    <td className="px-4 py-3 text-center font-black text-mist-900 dark:text-white text-lg">
                      {row.stokSaatIni}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
