type InventoryStockProps = {
  data: {
    partName: string;
    produced: number;
    packed: number;
    distributed: number;
    remaining: number;
  }[];
};

export function InventoryStockTable({ data }: InventoryStockProps) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Stok Utama Hasil Produksi</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-6 py-3 font-medium">Bagian Ayam</th>
              <th className="px-6 py-3 font-medium text-right">Total Produksi</th>
              <th className="px-6 py-3 font-medium text-right">Total Packing (Net)</th>
              <th className="px-6 py-3 font-medium text-right">Distribusi</th>
              <th className="px-6 py-3 font-medium text-right text-orange-600">Sisa Stok</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-mist-500">Belum ada data stok.</td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-6 py-4 font-bold text-mist-900 dark:text-white">{row.partName}</td>
                  <td className="px-6 py-4 text-right font-medium">{row.produced.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-right text-blue-600 font-medium">{row.packed.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-right text-mist-400">{row.distributed.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-right font-black text-orange-600">{row.remaining.toFixed(2)} kg</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
