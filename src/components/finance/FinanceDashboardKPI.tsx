type Props = {
  data: {
    pendingDepositCount: number;
    pendingDepositAmount: number;
    totalCashierLiabilities: number;
    totalMinusCompensated: number;
  };
};

export function FinanceDashboardKPI({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Setoran Menunggu</span>
        <span className="block text-2xl font-bold mt-2 text-rose-600">{data.pendingDepositCount} Trx</span>
      </div>
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm">
        <span className="text-xs font-medium text-mist-500 uppercase">Nilai Setoran Menunggu</span>
        <span className="block text-2xl font-bold mt-2 text-blue-600">Rp {data.pendingDepositAmount.toLocaleString()}</span>
      </div>
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-100 shadow-sm">
        <span className="text-xs font-medium text-red-800 dark:text-red-300 uppercase">Total Denda Kasir (Tanggungan)</span>
        <span className="block text-2xl font-black mt-2 text-red-600">Rp {data.totalCashierLiabilities.toLocaleString()}</span>
      </div>
      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-100 shadow-sm">
        <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 uppercase">Minus Barang Terkompensasi</span>
        <span className="block text-2xl font-black mt-2 text-emerald-600">Rp {data.totalMinusCompensated.toLocaleString()}</span>
      </div>
    </div>
  );
}
