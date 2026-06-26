"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productPriceSchema } from "@/lib/validations";
import { updateProductPriceAction } from "@/actions/kasir";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PriceForm({ parts }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(productPriceSchema),
    defaultValues: {
      masterPartId: "",
      newPrice: 0,
      effectiveDate: new Date(),
      notes: ""
    }
  });

  async function onSubmit(data: any) {
    setLoading(true);
    const res = await updateProductPriceAction(data);
    setLoading(false);
    if (res.success) {
      alert("Harga berhasil diupdate!");
      router.push("/kasir-produksi/kasir");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Bagian Ayam</label>
          <select {...form.register("masterPartId")} className="w-full border rounded-md p-2 dark:bg-mist-900">
            <option value="">Pilih Bagian...</option>
            {parts.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name} (Harga Saat Ini: {p.productPrice ? `Rp ${p.productPrice.currentPrice.toLocaleString()}` : "Belum diatur"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Harga Baru (Rp)</label>
          <input type="number" {...form.register("newPrice")} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal Berlaku</label>
          <input type="date" {...form.register("effectiveDate", { valueAsDate: true })} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Keterangan / Alasan Perubahan</label>
          <textarea {...form.register("notes")} className="w-full border rounded-md p-2 dark:bg-mist-900" rows={2} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Memproses..." : "Update Harga"}
      </button>
    </form>
  );
}
