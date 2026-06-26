type Props = {
  data: any[];
};

export function DriverTodayDeliveries({ data }: Props) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Surat Jalan Hari Ini</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-4 py-3 font-medium">No. SJ</th>
              <th className="px-4 py-3 font-medium">Tujuan</th>
              <th className="px-4 py-3 font-medium text-center">Jml Item</th>
              <th className="px-4 py-3 font-medium text-right">Berat</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-mist-500">Tidak ada pengiriman hari ini.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-4 py-3 font-bold text-indigo-600">{row.sjNumber}</td>
                  <td className="px-4 py-3 font-medium">{row.destination}</td>
                  <td className="px-4 py-3 text-center">{row.totalItems} Pack</td>
                  <td className="px-4 py-3 text-right font-medium">{row.totalWeight.toFixed(2)} kg</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-mist-100 text-mist-700 px-2 py-1 rounded-full text-[10px] font-bold">
                      {row.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
