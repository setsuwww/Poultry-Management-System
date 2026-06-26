"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomingChickenSchema, IncomingChickenFormValues } from "@/lib/validations";
import { createIncomingChickenAction } from "@/actions/incoming-chicken";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  farms: { id: string; name: string }[];
  drivers: { id: string; name: string }[];
  vehicles: { id: string; plateNo: string }[];
};

export function IncomingForm({ farms, drivers, vehicles }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, control } = useForm<any>({
    resolver: zodResolver(incomingChickenSchema),
    defaultValues: {
      date: new Date(),
    }
  });

  const totalWeight = useWatch({ control, name: "totalWeight" }) || 0;
  const totalCount = useWatch({ control, name: "totalCount" }) || 0;
  const basketCount = useWatch({ control, name: "basketCount" }) || 0;

  const avgPerChicken = totalCount > 0 ? (totalWeight / totalCount).toFixed(2) : "0.00";
  const avgPerBasket = basketCount > 0 ? (totalWeight / basketCount).toFixed(2) : "0.00";
  const countPerBasket = basketCount > 0 ? (totalCount / basketCount).toFixed(2) : "0.00";

  const onSubmit = async (data: IncomingChickenFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("date", data.date.toISOString());
    formData.append("deliveryOrder", data.deliveryOrder);
    formData.append("farmId", data.farmId);
    formData.append("driverId", data.driverId);
    formData.append("vehicleId", data.vehicleId);
    formData.append("totalWeight", data.totalWeight.toString());
    formData.append("totalCount", data.totalCount.toString());
    formData.append("basketCount", data.basketCount.toString());

    const result = await createIncomingChickenAction(formData);

    if (result.success) {
      router.push("/admin-produksi/incoming");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-produksi/incoming" className="p-2 border rounded-md hover:bg-mist-100 dark:hover:bg-mist-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Input Timbangan Ayam Hidup</h1>
            <p className="text-mist-500">Masukkan data DO dari kandang</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save className="h-5 w-5" />
          {isSubmitting ? "Menyimpan..." : "Simpan Data"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Data Pengiriman</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <input type="date" {...register("date", { valueAsDate: true })} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900" />
              {errors.date && <span className="text-red-500 text-xs">{errors.date.message as string}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Order (DO)</label>
              <input type="text" {...register("deliveryOrder")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900" placeholder="DO-12345" />
              {errors.deliveryOrder && <span className="text-red-500 text-xs">{errors.deliveryOrder.message as string}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Kandang (Farm)</label>
            <select {...register("farmId")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900">
              <option value="">-- Pilih Kandang --</option>
              {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            {errors.farmId && <span className="text-red-500 text-xs">{errors.farmId.message as string}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Supir</label>
              <select {...register("driverId")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900">
                <option value="">-- Pilih Supir --</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.driverId && <span className="text-red-500 text-xs">{errors.driverId.message as string}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">No Polisi</label>
              <select {...register("vehicleId")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900">
                <option value="">-- Pilih Kendaraan --</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.plateNo}</option>)}
              </select>
              {errors.vehicleId && <span className="text-red-500 text-xs">{errors.vehicleId.message as string}</span>}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Data Timbangan</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Berat (kg)</label>
              <input type="number" step="0.01" {...register("totalWeight")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 text-right font-bold text-orange-600" />
              {errors.totalWeight && <span className="text-red-500 text-xs">{errors.totalWeight.message as string}</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Ekor</label>
              <input type="number" {...register("totalCount")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 text-right font-bold" />
              {errors.totalCount && <span className="text-red-500 text-xs">{errors.totalCount.message as string}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Jumlah Keranjang</label>
            <input type="number" {...register("basketCount")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 text-right font-bold" />
            {errors.basketCount && <span className="text-red-500 text-xs">{errors.basketCount.message as string}</span>}
          </div>

          <div className="mt-6 bg-mist-50 dark:bg-mist-900 p-4 rounded-lg border border-mist-100 dark:border-mist-800 space-y-3">
            <h3 className="text-sm font-semibold text-mist-500 uppercase tracking-wider mb-2">Kalkulasi Otomatis</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-mist-600 dark:text-mist-400">Rata-rata per Ekor:</span>
              <span className="font-mono font-medium">{avgPerChicken} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-mist-600 dark:text-mist-400">Rata-rata per Keranjang:</span>
              <span className="font-mono font-medium">{avgPerBasket} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-mist-600 dark:text-mist-400">Ekor per Keranjang:</span>
              <span className="font-mono font-medium">{countPerBasket} ekor</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
