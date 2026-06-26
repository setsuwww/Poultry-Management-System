"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outletClosingSchema, type OutletClosingFormValues } from "@/lib/outlet-validations";
import { submitClosingAction } from "@/actions/closing";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

export function OutletClosingForm({ outletId, inventories }: { outletId: string, inventories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(outletClosingSchema),
    defaultValues: {
      outletId: outletId,
      date: new Date(),
      items: inventories.map(inv => ({
        masterPartId: inv.masterPartId,
        initialStock: inv.stock,
        finalPhysical: inv.stock,
        notes: ""
      })),
      employees: [{ name: "", role: "Kasir" }]
    }
  });

  const { fields: empFields, append: appendEmp, remove: removeEmp } = useFieldArray({
    control: form.control,
    name: "employees"
  });

  const { fields: itemFields } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: OutletClosingFormValues) {
    if (!confirm("Apakah data fisik yang Anda masukkan sudah benar? Laporan tidak dapat diubah setelah di-submit.")) return;
    setLoading(true);
    const res = await submitClosingAction(data);
    setLoading(false);
    if (res.success) {
      alert("Closing harian berhasil diajukan dan menunggu validasi Admin Stock Opname.");
      router.push("/outlet/outlet/stok");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-mist-700 mb-4 border-b pb-2">Informasi Shift</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tanggal Closing</label>
          <input
            type="date"
            {...form.register("date", { valueAsDate: true })}
            className="w-full border rounded-md p-2"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Petugas Bertugas</label>
          {empFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...form.register(`employees.${index}.name` as const)}
                placeholder="Nama Petugas"
                className="flex-1 border rounded-md p-2"
                required
              />
              <select {...form.register(`employees.${index}.role` as const)} className="border rounded-md p-2">
                <option value="Kasir">Kasir</option>
                <option value="Operator">Operator</option>
              </select>
              {empFields.length > 1 && (
                <button type="button" onClick={() => removeEmp(index)} className="p-2 bg-red-100 text-red-600 rounded-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => appendEmp({ name: "", role: "Operator" })} className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
            <Plus className="w-4 h-4" /> Tambah Petugas Lain
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-mist-700 mb-4 border-b pb-2">Form Rekonsiliasi Stok Fisik</h3>

        <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-6 flex gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>
            Hitung sisa barang nyata di gudang outlet saat ini dan masukkan pada kolom <strong>Sisa Fisik</strong>.
            Sistem otomatis akan menghitung Barang Keluar berdasarkan selisih stok awal dan sisa fisik.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50">
              <tr>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3 text-center">Stok Awal (Pack)</th>
                <th className="px-4 py-3 text-center">Sisa Fisik (Pack)</th>
                <th className="px-4 py-3 text-center">Barang Keluar (Otomatis)</th>
              </tr>
            </thead>
            <tbody>
              {itemFields.map((field, index) => {
                const inv = inventories.find(i => i.masterPartId === (field as any).masterPartId);
                const initialStock = form.watch(`items.${index}.initialStock`) || 0;
                const finalPhysical = form.watch(`items.${index}.finalPhysical`);
                const systemOut = initialStock - (finalPhysical || 0);

                return (
                  <tr key={field.id} className="border-b">
                    <td className="px-4 py-3 font-semibold text-mist-900 dark:text-white">
                      {inv?.masterPart?.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-mist-500">{initialStock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        {...form.register(`items.${index}.finalPhysical` as const, { valueAsNumber: true })}
                        className="w-full border rounded-md p-2 text-center font-bold text-emerald-600 focus:ring-emerald-500 focus:border-emerald-500"
                        min={0}
                        max={initialStock}
                        required
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-black text-lg ${systemOut > 0 ? 'text-blue-600' : 'text-mist-400'}`}>
                        {systemOut}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-lg shadow-md">
        {loading ? "Memproses..." : "Ajukan Validasi Stock Opname"}
      </button>
    </form>
  );
}
