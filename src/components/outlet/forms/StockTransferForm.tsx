"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockTransferSchema, type StockTransferFormValues } from "@/lib/outlet-validations";
import { createTransferAction, updateTransferStatusAction } from "@/actions/transfer";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";

export function StockTransferForm({ outlets, inventories, myOutletId }: { outlets: any[], inventories: any[], myOutletId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      fromOutletId: myOutletId,
      toOutletId: "",
      date: new Date(),
      notes: "",
      items: [{ masterPartId: "", quantity: 1, notes: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: StockTransferFormValues) {
    if (!confirm("Buat Surat Jalan Transfer antar Outlet?")) return;
    setLoading(true);
    const res = await createTransferAction(data);
    setLoading(false);
    if (res.success) {
      alert("Transfer berhasil diajukan dengan status MENUNGGU PERSETUJUAN.");
      router.refresh();
      form.reset({ ...data, toOutletId: "", items: [{ masterPartId: "", quantity: 1, notes: "" }] });
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Dari Outlet (Pengirim)</label>
          <select disabled className="w-full border rounded-md p-2 bg-mist-100 text-mist-500 font-bold">
            <option>{outlets.find(o => o.id === myOutletId)?.name}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-blue-600 mb-1">Ke Outlet (Tujuan)</label>
          <select {...form.register("toOutletId")} className="w-full border-2 border-blue-300 rounded-md p-2 focus:ring-blue-500" required>
            <option value="">-- Pilih Outlet Tujuan --</option>
            {outlets.filter(o => o.id !== myOutletId).map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Tanggal Transfer</label>
        <input
          type="date"
          {...form.register("date", { valueAsDate: true })}
          className="w-full border rounded-md p-2"
          defaultValue={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="space-y-4 mb-6">
        <h4 className="font-bold border-b pb-2">Daftar Barang</h4>
        {fields.map((field, index) => {
          const selectedPartId = form.watch(`items.${index}.masterPartId`);
          const inv = inventories.find(i => i.masterPartId === selectedPartId);
          const maxQty = inv ? inv.stock : 0;

          return (
            <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-mist-50 dark:bg-mist-900 p-3 rounded-lg border">
              <div className="col-span-12 md:col-span-5">
                <label className="block text-xs font-medium mb-1">Pilih Barang</label>
                <select {...form.register(`items.${index}.masterPartId` as const)} className="w-full border rounded-md p-2 text-sm" required>
                  <option value="">-- Pilih --</option>
                  {inventories.filter(i => i.stock > 0).map(i => (
                    <option key={i.id} value={i.masterPartId}>{i.masterPart.name} (Stok: {i.stock})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs font-medium mb-1">Jumlah</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    {...form.register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="w-full border rounded-md p-2 text-sm font-bold text-blue-600"
                    min={1}
                    max={maxQty}
                    required
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-3">
                <label className="block text-xs font-medium mb-1">Catatan</label>
                <input
                  type="text"
                  {...form.register(`items.${index}.notes` as const)}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Opsional"
                />
              </div>
              <div className="col-span-12 md:col-span-1 flex justify-center pb-2">
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <button type="button" onClick={() => append({ masterPartId: "", quantity: 1, notes: "" })} className="text-sm text-blue-600 font-semibold flex items-center gap-1">
          <Plus className="w-4 h-4" /> Tambah Barang Lain
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Catatan Transfer</label>
        <textarea {...form.register("notes")} className="w-full border rounded-md p-2" rows={2}></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg shadow-md flex justify-center items-center gap-2">
        <ArrowRightLeft className="w-5 h-5" />
        {loading ? "Menyimpan..." : "Buat Surat Jalan Transfer"}
      </button>
    </form>
  );
}
