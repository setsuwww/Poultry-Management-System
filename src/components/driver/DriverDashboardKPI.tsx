type Props = {
  data: {
    sentToday: number;
    inTransit: number;
    completed: number;
    problematic: number;
    totalMinusAmount: number;
    itemsCarriedToday: number;
  };
};

export function DriverDashboardKPI({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Barang Dibawa Hari Ini</span>
        <span className="block text-2xl font-bold mt-2 text-indigo-600">{data.itemsCarriedToday} Pack</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Dalam Perjalanan</span>
        <span className="block text-2xl font-bold mt-2 text-blue-600">{data.inTransit} SJ</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Selesai</span>
        <span className="block text-2xl font-bold mt-2 text-green-600">{data.completed} SJ</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Pengiriman Hari Ini</span>
        <span className="block text-2xl font-bold mt-2 text-mist-900 dark:text-white">{data.sentToday} SJ</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Pengiriman Bermasalah</span>
        <span className="block text-2xl font-bold mt-2 text-orange-600">{data.problematic} SJ</span>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm">
        <span className="text-xs font-medium text-indigo-800 dark:text-indigo-300 uppercase">Total Minus Driver</span>
        <span className="block text-2xl font-black mt-2 text-red-600">Rp {data.totalMinusAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}
