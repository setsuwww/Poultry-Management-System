import { Truck, ShoppingCart, DollarSign, Wallet, FileOutput, PackageOpen } from "lucide-react";

type Props = {
  data: {
    incomingItemsToday: number;
    outgoingItemsToday: number;
    distributionCountToday: number;
    totalRevenueToday: number;
    totalReceivable: number;
    totalExpense: number;
    itemDifference: number;
  };
};

export function KasirKpiCards({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Brg Masuk (Beli)</span>
        <span className="text-xl font-bold mt-2 text-blue-600">{data.incomingItemsToday}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Brg Keluar (Dist)</span>
        <span className="text-xl font-bold mt-2 text-green-600">{data.outgoingItemsToday}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Jml Distribusi</span>
        <span className="text-xl font-bold mt-2">{data.distributionCountToday} SJ</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Omset Hari Ini</span>
        <span className="text-xl font-bold mt-2 text-teal-600">Rp {data.totalRevenueToday.toLocaleString()}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Total Piutang</span>
        <span className="text-xl font-bold mt-2 text-orange-600">Rp {data.totalReceivable.toLocaleString()}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Pengeluaran</span>
        <span className="text-xl font-bold mt-2 text-red-600">Rp {data.totalExpense.toLocaleString()}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-4 rounded-xl border shadow-sm flex flex-col">
        <span className="text-xs font-medium text-mist-500 uppercase">Barang Sisa (Retur)</span>
        <span className="text-xl font-bold mt-2 text-purple-600">{data.itemDifference}</span>
      </div>
    </div>
  );
}
