"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { returnedGoodsSchema, rejectedGoodsSchema, type ReturnedGoodsFormValues, type RejectedGoodsFormValues } from "@/lib/outlet-validations";
import { createReturnedGoodsAction, createRejectedGoodsAction } from "@/actions/retur";
import { useRouter } from "next/navigation";
import { CheckSquare, AlertTriangle, Plus, Trash2 } from "lucide-react";

export function ReturForm({ inventories, myOutletId, type }: { inventories: any[], myOutletId: string, type: "RETUR" | "RIJEK" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = type === "RETUR" ? returnedGoodsSchema : rejectedGoodsSchema;
  type FormValues = ReturnedGoodsFormValues | RejectedGoodsFormValues;

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outletId: myOutletId,
      date: new Date(),
      notes: "",
      items: [{ masterPartId: "", quantity: 1, reason: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items" as any
  });

  async function onSubmit(data: FormValues) {
    if (!confirm(`Konfirmasi pengajuan Barang ${type === "RETUR" ? "Retur (Kurang Laku)" : "Rijek (Rusak)"}?`)) return;
    setLoading(true);

    let res;
    if (type === "RETUR") {
      res = await createReturnedGoodsAction(data as ReturnedGoodsFormValues);
    } else {
      res = await createRejectedGoodsAction(data as RejectedGoodsFormValues);
    }

    setLoading(false);
    if (res.success) {
      alert(`Pengajuan berhasil dengan status MENUNGGU QC.`);
      router.refresh();
      form.reset({ ...data, items: [{ masterPartId: "", quantity: 1, reason: "" }] });
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Tanggal Pengajuan</label>
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
          const selectedPartId = form.watch(`items.${index}.masterPartId` as any);
          const inv = inventories.find(i => i.masterPartId === selectedPartId);
          const maxQty = inv ? inv.stock : 0;

          return (
            <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-mist-50 dark:bg-mist-900 p-3 rounded-lg border">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-xs font-medium mb-1">Pilih Barang</label>
                <select {...form.register(`items.${index}.masterPartId` as const)} className="w-full border rounded-md p-2 text-sm" required>
                  <option value="">-- Pilih --</option>
                  {inventories.filter(i => i.stock > 0).map(i => (
                    <option key={i.id} value={i.masterPartId}>{i.masterPart.name} (Stok: {i.stock})</option>
                  ))}
                </select>
              </div>
              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-medium mb-1">Jumlah</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    {...form.register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                    className="w-full border rounded-md p-2 text-sm font-bold text-red-600"
                    min={1}
                    max={maxQty}
                    required
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-5">
                <label className="block text-xs font-medium mb-1">Alasan</label>
                <input
                  type="text"
                  {...form.register(`items.${index}.reason` as const)}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder={type === "RETUR" ? "Contoh: Kurang Laku" : "Contoh: Kemasan Rusak"}
                  required
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
        <button type="button" onClick={() => append({ masterPartId: "", quantity: 1, reason: "" } as any)} className="text-sm text-blue-600 font-semibold flex items-center gap-1">
          <Plus className="w-4 h-4" /> Tambah Barang Lain
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Catatan Tambahan (Opsional)</label>
        <textarea {...form.register("notes")} className="w-full border rounded-md p-2" rows={2}></textarea>
      </div>

      <button type="submit" disabled={loading} className={`w-full text-white font-bold py-3 rounded-lg disabled:opacity-50 text-lg shadow-md flex justify-center items-center gap-2 ${type === 'RIJEK' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
        {type === "RETUR" ? <CheckSquare className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        {loading ? "Menyimpan..." : `Ajukan ${type === 'RETUR' ? 'Retur' : 'Rijek'} Barang`}
      </button>
    </form>
  );
}
