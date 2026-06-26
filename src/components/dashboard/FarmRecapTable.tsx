type FarmRecapProps = {
  data: {
    farmName: string;
    batchCount: number;
    totalIncoming: number;
    totalProduction: number;
  }[];
};

export function FarmRecapTable({ data }: FarmRecapProps) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Rekap Produksi Per Kandang</h2>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-4 py-3 font-medium">Nama Kandang</th>
              <th className="px-4 py-3 font-medium text-center">Jumlah Batch</th>
              <th className="px-4 py-3 font-medium text-right">Berat Masuk</th>
              <th className="px-4 py-3 font-medium text-right">Berat Produksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-mist-500">Belum ada data.</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-4 py-3 font-medium text-mist-900 dark:text-white">{row.farmName}</td>
                  <td className="px-4 py-3 text-center font-bold text-orange-600">{row.batchCount}</td>
                  <td className="px-4 py-3 text-right text-mist-500">{row.totalIncoming.toFixed(2)} kg</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">{row.totalProduction.toFixed(2)} kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
