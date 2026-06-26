type TodayProductionProps = {
  data: {
    id: string;
    batchNo: string;
    totalWeight: number;
    yieldPercentage: number;
    createdAt: Date;
    incomingChicken: {
      deliveryOrder: string;
      totalWeight: number;
      farm: { name: string };
    };
  }[];
};

export function TodayProductionTable({ data }: TodayProductionProps) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Hasil Pemotongan Hari Ini</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-6 py-3 font-medium">Batch No</th>
              <th className="px-6 py-3 font-medium">Delivery Order</th>
              <th className="px-6 py-3 font-medium">Kandang</th>
              <th className="px-6 py-3 font-medium text-right">Berat Masuk</th>
              <th className="px-6 py-3 font-medium text-right">Berat Produksi</th>
              <th className="px-6 py-3 font-medium text-right">Yield</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-mist-500">
                  Belum ada data pemotongan hari ini.
                </td>
              </tr>
            ) : (
              data.map((batch) => (
                <tr key={batch.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-6 py-4 font-bold text-orange-600">{batch.batchNo}</td>
                  <td className="px-6 py-4 font-medium">{batch.incomingChicken.deliveryOrder}</td>
                  <td className="px-6 py-4">{batch.incomingChicken.farm.name}</td>
                  <td className="px-6 py-4 text-right text-mist-500">{batch.incomingChicken.totalWeight.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">{batch.totalWeight.toFixed(2)} kg</td>
                  <td className="px-6 py-4 text-right font-semibold">{batch.yieldPercentage.toFixed(2)}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
