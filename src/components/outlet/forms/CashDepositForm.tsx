"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cashDepositSchema, type CashDepositFormValues } from "@/lib/validations";
import { submitCashDepositAction } from "@/actions/outlet";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

export function CashDepositForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(cashDepositSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      notes: ""
    }
  });

  async function onSubmit(data: CashDepositFormValues) {
    if (!confirm("Apakah Anda yakin nominal setoran sudah benar?")) return;
    setLoading(true);
    const res = await submitCashDepositAction(data);
    setLoading(false);
    if (res.success) {
      alert("Setoran berhasil diajukan dan sedang menunggu verifikasi Admin Omset.");
      router.refresh();
      form.reset();
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-blue-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Wallet className="w-32 h-32" />
      </div>

      <div className="relative z-10 space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Penyerahan</label>
          <input
            type="date"
            {...form.register("date", { valueAsDate: true })}
            className="w-full border rounded-md p-2"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-blue-600 mb-1">Nominal Uang Fisik (Rp)</label>
          <input
            type="number"
            {...form.register("amount", { valueAsNumber: true })}
            className="w-full border-blue-300 rounded-md p-3 font-bold text-2xl focus:ring-blue-500 text-mist-900 dark:bg-mist-900 dark:text-white"
            required
          />
          <p className="text-xs text-mist-500 mt-1">Masukkan jumlah riil uang yang Anda pegang dan akan diserahkan.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-mist-500">Catatan (Opsional)</label>
          <textarea
            {...form.register("notes")}
            className="w-full border rounded-md p-2 text-sm"
            rows={2}
            placeholder="Ada selisih uang? Tulis alasannya di sini..."
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Menyimpan..." : "Ajukan Setoran"}
        </button>
      </div>
    </form>
  );
}
