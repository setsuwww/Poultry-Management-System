"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseTransactionSchema, type PurchaseTransactionFormValues } from "@/lib/validations";
import { createPurchaseAction } from "@/actions/kasir";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export function PurchaseForm({ supportItems }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(purchaseTransactionSchema),
    defaultValues: {
      date: new Date(),
      supplier: "",
      notes: "",
      items: [{ masterSupportItemId: "", quantity: 1, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: PurchaseTransactionFormValues) {
    setLoading(true);
    const res = await createPurchaseAction(data);
    setLoading(false);
    if (res.success) {
      alert("Pembelian berhasil disimpan!");
      router.push("/kasir-produksi/kasir");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal</label>
          <input type="date" {...form.register("date", { valueAsDate: true })} className="w-full border rounded-md p-2 dark:bg-mist-900" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <input type="text" {...form.register("supplier")} className="w-full border rounded-md p-2 dark:bg-mist-900" placeholder="Nama Supplier" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Catatan</label>
          <textarea {...form.register("notes")} className="w-full border rounded-md p-2 dark:bg-mist-900" rows={2} />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Daftar Barang Beli</h3>
          <button type="button" onClick={() => append({ masterSupportItemId: "", quantity: 1, price: 0 })} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md flex items-center gap-1">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Barang</label>
                <select {...form.register(`items.${index}.masterSupportItemId` as const)} className="w-full border rounded-md p-2 text-sm dark:bg-mist-900">
                  <option value="">Pilih...</option>
                  {supportItems.map((si: any) => (
                    <option key={si.id} value={si.id}>{si.name} ({si.unit})</option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium mb-1">Jumlah</label>
                <input type="number" {...form.register(`items.${index}.quantity` as const)} className="w-full border rounded-md p-2 text-sm dark:bg-mist-900" />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium mb-1">Harga Satuan</label>
                <input type="number" {...form.register(`items.${index}.price` as const)} className="w-full border rounded-md p-2 text-sm dark:bg-mist-900" />
              </div>
              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[2px]">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Menyimpan..." : "Simpan Pembelian"}
      </button>
    </form>
  );
}
