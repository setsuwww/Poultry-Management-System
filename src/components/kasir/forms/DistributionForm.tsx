"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { distributionOrderSchema, type DistributionOrderFormValues } from "@/lib/validations";
import { createDistributionAction } from "@/actions/kasir";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export function DistributionForm({ packingItems, drivers, vehicles }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(distributionOrderSchema),
    defaultValues: {
      date: new Date(),
      destination: "",
      type: "OUTLET",
      driverId: "",
      vehicleId: "",
      items: [{ packingItemId: "", quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: DistributionOrderFormValues) {
    setLoading(true);
    const res = await createDistributionAction(data);
    setLoading(false);
    if (res.success) {
      alert("Surat Jalan berhasil dibuat!");
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
          <label className="block text-sm font-medium mb-1">Tujuan</label>
          <input type="text" {...form.register("destination")} className="w-full border rounded-md p-2 dark:bg-mist-900" placeholder="Nama Outlet/Reseller" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Jenis Tujuan</label>
          <select {...form.register("type")} className="w-full border rounded-md p-2 dark:bg-mist-900">
            <option value="OUTLET">Outlet</option>
            <option value="RESELLER">Reseller</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sopir</label>
          <select {...form.register("driverId")} className="w-full border rounded-md p-2 dark:bg-mist-900">
            <option value="">Pilih Sopir...</option>
            {drivers.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kendaraan</label>
          <select {...form.register("vehicleId")} className="w-full border rounded-md p-2 dark:bg-mist-900">
            <option value="">Pilih Kendaraan...</option>
            {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.plateNo}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Daftar Barang</h3>
          <button type="button" onClick={() => append({ packingItemId: "", quantity: 1 })} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md flex items-center gap-1">
            <Plus className="w-4 h-4" /> Tambah Barang
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Barang (Plastik Packing)</label>
                <select {...form.register(`items.${index}.packingItemId` as const)} className="w-full border rounded-md p-2 text-sm dark:bg-mist-900">
                  <option value="">Pilih Barang...</option>
                  {packingItems.map((pi: any) => (
                    <option key={pi.id} value={pi.id}>
                      {pi.productionItem.masterPart.name} - {pi.packageSize}Kg (Sisa: {pi.availableQuantity} Pack)
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium mb-1">Jumlah (Pack)</label>
                <input type="number" {...form.register(`items.${index}.quantity` as const)} className="w-full border rounded-md p-2 text-sm dark:bg-mist-900" />
              </div>
              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md mb-[2px]">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Memproses..." : "Simpan & Buat Surat Jalan"}
      </button>
    </form>
  );
}
