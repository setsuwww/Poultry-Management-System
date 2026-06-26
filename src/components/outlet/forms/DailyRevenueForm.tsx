"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dailyOutletRevenueSchema, type DailyOutletRevenueFormValues } from "@/lib/validations";
import { submitDailyRevenueAction } from "@/actions/outlet";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";

export function DailyRevenueForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(dailyOutletRevenueSchema),
    defaultValues: {
      date: new Date(),
      totalRevenue: 0,
      cashAmount: 0,
      nonCashAmount: 0,
      receivableAmount: 0,
      expenseAmount: 0,
      expenseNotes: ""
    }
  });

  const watchAllFields = form.watch();

  async function onSubmit(data: DailyOutletRevenueFormValues) {
    if ((data.cashAmount + data.nonCashAmount + data.receivableAmount) !== data.totalRevenue) {
      alert("Total dari (Tunai + Non-Tunai + Piutang) harus sama dengan Total Omset!");
      return;
    }
    setLoading(true);
    const res = await submitDailyRevenueAction(data);
    setLoading(false);
    if (res.success) {
      alert("Omset harian berhasil disimpan!");
      router.refresh();
      form.reset();
    } else {
      alert("Error: " + res.error);
    }
  }

  const netBalance = watchAllFields.totalRevenue - watchAllFields.expenseAmount - watchAllFields.receivableAmount;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-mist-700 border-b pb-2">Pemasukan & Penjualan</h3>

          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="date"
              {...form.register("date", { valueAsDate: true })}
              className="w-full border rounded-md p-2"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-emerald-600 mb-1">Total Omset Kotor (Rp)</label>
            <input type="number" {...form.register("totalRevenue", { valueAsNumber: true })} className="w-full border-emerald-300 rounded-md p-2 font-bold text-lg focus:ring-emerald-500" required />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Tunai (Rp)</label>
              <input type="number" {...form.register("cashAmount", { valueAsNumber: true })} className="w-full border rounded-md p-2 text-sm" required />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Non-Tunai / EDC (Rp)</label>
              <input type="number" {...form.register("nonCashAmount", { valueAsNumber: true })} className="w-full border rounded-md p-2 text-sm" required />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-mist-700 border-b pb-2">Potongan & Pengeluaran</h3>

          <div>
            <label className="block text-sm font-medium mb-1 text-orange-600">Piutang Pelanggan (Rp)</label>
            <input type="number" {...form.register("receivableAmount", { valueAsNumber: true })} className="w-full border-orange-300 rounded-md p-2" required />
          </div>

          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1 text-red-600">Pengeluaran (Rp)</label>
              <input type="number" {...form.register("expenseAmount", { valueAsNumber: true })} className="w-full border-red-300 rounded-md p-2" required />
            </div>
            <div className="w-2/3">
              <label className="block text-sm font-medium mb-1 text-mist-500">Keterangan Pengeluaran</label>
              <input type="text" {...form.register("expenseNotes")} className="w-full border rounded-md p-2" placeholder="Cth: Beli kresek, sapu" />
            </div>
          </div>

          <div className="bg-mist-50 p-4 rounded-lg mt-4 flex justify-between items-center border">
            <div>
              <span className="block text-xs text-mist-500 uppercase font-bold">Kalkulasi Uang Bersih (Kas)</span>
              <span className="text-[10px] text-mist-400">Omset - Piutang - Pengeluaran</span>
            </div>
            <span className="text-2xl font-black text-mist-900">Rp {isNaN(netBalance) ? 0 : netBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full mt-6 bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Laporan Omset"}
      </button>
    </form>
  );
}
