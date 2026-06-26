"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyDepositSchema, type VerifyDepositFormValues } from "@/lib/validations";
import { verifyDepositAction } from "@/actions/finance";
import { useRouter } from "next/navigation";
import { Calculator } from "lucide-react";

export function VerifyDepositForm({ deposit }: { deposit: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(verifyDepositSchema),
    defaultValues: {
      cashDepositId: deposit.id,
      actualSalesAmount: deposit.amount, // Default is exactly what they submitted
      notes: ""
    }
  });

  const watchActualSales = form.watch("actualSalesAmount") || 0;
  const difference = deposit.amount - watchActualSales;
  const isShortage = difference < 0;
  const isExcess = difference > 0;
  const isMatch = difference === 0;

  async function onSubmit(data: VerifyDepositFormValues) {
    if (!confirm(`Apakah Anda yakin data penjualan riil Kasir Pintar adalah Rp ${data.actualSalesAmount.toLocaleString()}?`)) return;

    setLoading(true);
    const res = await verifyDepositAction(data);
    setLoading(false);
    if (res.success) {
      alert("Verifikasi Setoran berhasil diproses.");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-lg mb-6 relative">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-mist-900 dark:text-white">Review Setoran Kasir</h3>
          <p className="text-sm text-mist-500 mt-1">
            Kasir: <span className="font-semibold text-rose-600">{deposit.cashierName}</span> |
            Tanggal: <span className="font-semibold">{new Date(deposit.date).toLocaleDateString("id-ID")}</span>
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
          <span className="block text-xs font-semibold text-blue-800 uppercase">Uang Disetor (Fisik)</span>
          <span className="block text-xl font-black text-blue-600">Rp {deposit.amount.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-bold text-mist-700 mb-2 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Input Data Kasir Pintar (Rp)
          </label>
          <input
            type="number"
            {...form.register("actualSalesAmount", { valueAsNumber: true })}
            className="w-full border-2 border-mist-300 rounded-lg p-3 text-lg font-bold focus:ring-rose-500 focus:border-rose-500"
            autoFocus
          />
          <p className="text-xs text-mist-500 mt-2">Lihat total transaksi di aplikasi Kasir Pintar untuk tanggal ini.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-mist-700 mb-2">Analisis Sistem</label>
          <div className={`p-4 rounded-lg border-2 ${isMatch ? 'bg-mist-50 border-mist-200' : isShortage ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className="block text-xs font-semibold uppercase mb-1 text-mist-500">Selisih Uang (Fisik - Sistem)</span>
            <span className={`block text-2xl font-black ${isMatch ? 'text-mist-900' : isShortage ? 'text-red-600' : 'text-emerald-600'}`}>
              {isShortage && '-'} {isExcess && '+'} Rp {Math.abs(difference).toLocaleString()}
            </span>

            <div className="mt-3 text-xs font-medium">
              {isMatch && <span className="text-mist-600">Setoran Sesuai. Tidak ada tindakan ekstra.</span>}
              {isShortage && <span className="text-red-700">Setoran Kurang! Kasir akan dikenakan denda tanggungan sebesar <strong>Rp {(Math.abs(difference) * 2).toLocaleString()}</strong> (2x lipat).</span>}
              {isExcess && <span className="text-emerald-700">Setoran Berlebih! Uang lebih akan digunakan sistem untuk otomatis mengkompensasi Minus Barang jika ada.</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1 text-mist-700">Catatan Verifikasi</label>
        <textarea
          {...form.register("notes")}
          className="w-full border rounded-md p-2 text-sm"
          rows={2}
          placeholder="Opsional..."
        />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 disabled:opacity-50 text-lg transition-colors">
        {loading ? "Memproses..." : "Sahkan Hasil Verifikasi"}
      </button>
    </form>
  );
}
