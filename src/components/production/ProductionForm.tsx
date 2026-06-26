"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productionBatchSchema, ProductionBatchFormValues } from "@/lib/validations";
import { createProductionAction } from "@/actions/production";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

type IncomingChickenWithRelations = Prisma.IncomingChickenGetPayload<{
  include: { farm: true; driver: true; vehicle: true };
}>;

type Props = {
  availableDOs: IncomingChickenWithRelations[];
  masterParts: { id: string; name: string }[];
};

export function ProductionForm({ availableDOs, masterParts }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, control, watch } = useForm<any>({
    resolver: zodResolver(productionBatchSchema),
    defaultValues: {
      items: [{ masterPartId: "", weight: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchIncomingId = watch("incomingChickenId");
  const watchItems = useWatch({ control, name: "items" });

  const selectedDO = useMemo(() => {
    return availableDOs.find(doItem => doItem.id === watchIncomingId) || null;
  }, [watchIncomingId, availableDOs]);

  const totalProductionWeight = useMemo(() => {
    return watchItems?.reduce((sum: number, item: any) => sum + (Number(item?.weight) || 0), 0) || 0;
  }, [watchItems]);

  const weightDifference = selectedDO ? totalProductionWeight - selectedDO.totalWeight : 0;
  const yieldPercentage = selectedDO && selectedDO.totalWeight > 0
    ? ((totalProductionWeight / selectedDO.totalWeight) * 100).toFixed(2)
    : "0.00";

  const onSubmit = async (data: ProductionBatchFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const result = await createProductionAction(data);

    if (result.success) {
      router.push("/admin-produksi/production");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-produksi/production" className="p-2 border rounded-md hover:bg-mist-100 dark:hover:bg-mist-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Input Hasil Produksi</h1>
            <p className="text-mist-500">Rekap hasil pemotongan per batch</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save className="h-5 w-5" />
          {isSubmitting ? "Menyimpan..." : "Simpan Batch"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {errors.items?.root && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {errors.items.root.message as string}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Kolom Kiri: Pilih DO & Kalkulasi */}
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Data Ayam Masuk (DO)</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pilih DO / Ayam Hidup</label>
              <select {...register("incomingChickenId")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900">
                <option value="">-- Pilih DO --</option>
                {availableDOs.map(d => (
                  <option key={d.id} value={d.id}>DO: {d.deliveryOrder} - {d.farm.name}</option>
                ))}
              </select>
              {errors.incomingChickenId && <span className="text-red-500 text-xs">{errors.incomingChickenId.message as string}</span>}
            </div>

            {selectedDO && (
              <div className="pt-4 border-t space-y-2 text-sm text-mist-600 dark:text-mist-400">
                <div className="flex justify-between"><span>Tanggal:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedDO.date.toLocaleDateString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Kandang:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedDO.farm.name}</span></div>
                <div className="flex justify-between"><span>Berat Total:</span> <span className="font-bold text-orange-600">{selectedDO.totalWeight} kg</span></div>
                <div className="flex justify-between"><span>Jumlah Ekor:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedDO.totalCount} ekor</span></div>
              </div>
            )}
          </div>

          <div className="bg-mist-50 dark:bg-mist-900 p-6 rounded-xl border shadow-sm space-y-4 border-l-4 border-l-orange-500">
            <h2 className="font-semibold text-lg border-b pb-2">Ringkasan Batch</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Produksi</span>
                <span className="font-bold text-lg">{totalProductionWeight.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Selisih Berat</span>
                <span className={`font-bold ${weightDifference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {weightDifference > 0 ? '+' : ''}{weightDifference.toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-bold uppercase tracking-wider">Yield</span>
                <span className="font-black text-2xl text-orange-600">{yieldPercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Input Bagian Ayam */}
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-semibold text-lg">Detail Hasil Produksi</h2>
            <button
              type="button"
              onClick={() => append({ masterPartId: "", weight: 0 })}
              className="text-sm flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Tambah Bagian
            </button>
          </div>

          <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-mist-50 dark:bg-mist-900/50">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-mist-500 uppercase tracking-wider">Pilih Bagian Ayam</label>
                  <select {...register(`items.${index}.masterPartId`)} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white">
                    <option value="">-- Pilih --</option>
                    {masterParts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {(errors.items as any)?.[index]?.masterPartId && <span className="text-red-500 text-xs">{(errors.items as any)[index].masterPartId.message as string}</span>}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-mist-500 uppercase tracking-wider">Berat (kg)</label>
                  <input type="number" step="0.01" {...register(`items.${index}.weight`)} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white text-right font-bold" />
                  {(errors.items as any)?.[index]?.weight && <span className="text-red-500 text-xs">{(errors.items as any)[index].weight.message as string}</span>}
                </div>
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </form>
  );
}
