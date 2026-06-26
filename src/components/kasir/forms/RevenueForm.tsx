"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dailyRevenueSchema, type DailyRevenueFormValues } from "@/lib/validations";
import { createDailyRevenueAction } from "@/actions/kasir";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RevenueForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(dailyRevenueSchema),
    defaultValues: {
      date: new Date(),
      cashAmount: 0,
      nonCashAmount: 0,
      receivableAmount: 0,
      expenseAmount: 0,
      expenseNotes: ""
    }
  });

  const { watch } = form;
  const cash = watch("cashAmount") || 0;
  const nonCash = watch("nonCashAmount") || 0;
  const rec = watch("receivableAmount") || 0;
  const exp = watch("expenseAmount") || 0;

  const totalRevenue = Number(cash) + Number(nonCash) + Number(rec);
  const netBalance = totalRevenue - Number(exp);

  async function onSubmit(data: DailyRevenueFormValues) {
    setLoading(true);
    const res = await createDailyRevenueAction(data);
    setLoading(false);
    if (res.success) {
      alert("Omset berhasil disimpan!");
      router.push("/kasir-produksi/kasir");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <input type="date" {...form.register("date", { valueAsDate: true })} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div className="col-span-2">
          <hr className="my-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Penerimaan Tunai (Rp)</label>
          <input type="number" {...form.register("cashAmount")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Penerimaan Non-Tunai (Rp)</label>
          <input type="number" {...form.register("nonCashAmount")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Piutang (Rp)</label>
          <input type="number" {...form.register("receivableAmount")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>

        <div className="col-span-2">
          <hr className="my-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Pengeluaran (Rp)</label>
          <input type="number" {...form.register("expenseAmount")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Keterangan Pengeluaran</label>
          <textarea {...form.register("expenseNotes")} className="w-full border rounded-md p-2 dark:bg-mist-900" rows={2} />
        </div>
      </div>

      <div className="bg-mist-50 dark:bg-mist-900 p-4 rounded-lg flex justify-between items-center">
        <div>
          <span className="block text-sm text-mist-500">Total Omset</span>
          <span className="text-xl font-bold text-teal-600">Rp {totalRevenue.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="block text-sm text-mist-500">Saldo Bersih</span>
          <span className="text-2xl font-black text-blue-600">Rp {netBalance.toLocaleString()}</span>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Omset Harian"}
      </button>
    </form>
  );
}
