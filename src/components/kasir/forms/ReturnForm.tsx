"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { returnedItemSchema, type ReturnedItemFormValues } from "@/lib/validations";
import { createReturnedItemAction } from "@/actions/kasir";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReturnForm({ distributionItems }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(returnedItemSchema),
    defaultValues: {
      date: new Date(),
      distributionItemId: "",
      quantity: 1,
      weight: 0.1,
      notes: ""
    }
  });

  async function onSubmit(data: ReturnedItemFormValues) {
    setLoading(true);
    const res = await createReturnedItemAction(data);
    setLoading(false);
    if (res.success) {
      alert("Barang sisa berhasil dikembalikan (Menunggu Verifikasi)!");
      router.push("/kasir-produksi/kasir");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <input type="date" {...form.register("date", { valueAsDate: true })} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Barang Distribusi (SJ)</label>
          <select {...form.register("distributionItemId")} className="w-full border rounded-md p-2 dark:bg-mist-900">
            <option value="">Pilih Barang...</option>
            {distributionItems.map((d: any) => (
              <option key={d.id} value={d.id}>
                SJ: {d.distribution.sjNumber} - {d.packingItem.productionItem.masterPart.name} (Sisa yg bisa diretur: {d.availableToReturn} Pack)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Jumlah (Pack)</label>
          <input type="number" {...form.register("quantity")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Berat Total (Kg)</label>
          <input type="number" step="0.1" {...form.register("weight")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Keterangan / Alasan Sisa</label>
          <textarea {...form.register("notes")} className="w-full border rounded-md p-2 dark:bg-mist-900" rows={3} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Memproses..." : "Kembalikan ke Gudang"}
      </button>
    </form>
  );
}
