type Props = {
  data: {
    incomingDeliveriesToday: number;
    incomingItemsToday: number;
    totalStock: number;
    omsetToday: number;
    receivableToday: number;
    expenseToday: number;
    netBalance: number;
  };
};

export function OutletDashboardKPI({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Barang Diterima Hari Ini</span>
        <span className="block text-2xl font-bold mt-2 text-emerald-600">{data.incomingItemsToday} Pack</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Total Stok Outlet</span>
        <span className="block text-2xl font-bold mt-2 text-mist-900 dark:text-white">{data.totalStock} Pack</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">SJ Masuk Hari Ini</span>
        <span className="block text-2xl font-bold mt-2 text-blue-600">{data.incomingDeliveriesToday} Surat</span>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-100 shadow-sm">
        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 uppercase">Omset Hari Ini</span>
        <span className="block text-2xl font-black mt-2 text-emerald-700 dark:text-emerald-400">Rp {data.omsetToday.toLocaleString()}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm col-span-1 md:col-span-2">
        <span className="text-xs font-medium text-mist-500 uppercase">Pengeluaran & Piutang</span>
        <div className="flex gap-4 mt-2">
          <div className="flex-1">
            <span className="text-[10px] text-mist-400">Pengeluaran</span>
            <span className="block font-bold text-red-500">Rp {data.expenseToday.toLocaleString()}</span>
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-mist-400">Piutang</span>
            <span className="block font-bold text-orange-500">Rp {data.receivableToday.toLocaleString()}</span>
          </div>
          <div className="flex-1 border-l pl-4">
            <span className="text-[10px] text-mist-400">Kas Bersih</span>
            <span className="block font-bold text-mist-900 dark:text-white">Rp {data.netBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
