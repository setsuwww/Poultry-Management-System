type PartRecapProps = {
  data: {
    partName: string;
    totalWeight: number;
  }[];
};

export function PartRecapTable({ data }: PartRecapProps) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Rekap Produksi Per Bagian</h2>
      </div>
      <div className="overflow-y-auto max-h-[300px] flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-medium">Bagian Ayam</th>
              <th className="px-4 py-3 font-medium text-right">Total Berat Produksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-mist-500">Belum ada data.</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-4 py-3 font-medium text-mist-900 dark:text-white">{row.partName}</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-600">{row.totalWeight.toFixed(2)} kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
