"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { packingBatchSchema, PackingBatchFormValues } from "@/lib/validations";
import { createPackingAction, getBatchItemsAction } from "@/actions/packing";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Save, ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Prisma } from "@prisma/client";

type ProductionBatchWithRelations = Prisma.ProductionBatchGetPayload<{
  include: { incomingChicken: { include: { farm: true } } }
}>;

type Props = {
  availableBatches: ProductionBatchWithRelations[];
};

type ProductionItemData = {
  id: string;
  weight: number;
  remainingWeight: number;
  totalPackedWeight: number;
  masterPart: {
    id: string;
    name: string;
  };
};

export function PackingForm({ availableBatches }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [batchItems, setBatchItems] = useState<ProductionItemData[]>([]);

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, trigger } = useForm<any>({
    resolver: zodResolver(packingBatchSchema),
    defaultValues: {
      packingDate: new Date(),
      items: [{ productionItemId: "", packageSize: 5, packageCount: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchBatchId = watch("productionBatchId");
  const watchItems = useWatch({ control, name: "items" });

  useEffect(() => {
    async function fetchItems() {
      if (!watchBatchId) {
        setBatchItems([]);
        return;
      }
      setIsLoadingItems(true);
      const res = await getBatchItemsAction(watchBatchId);
      if (res.success && res.data) {
        setBatchItems(res.data);
      } else {
        setBatchItems([]);
      }
      setIsLoadingItems(false);
    }
    fetchItems();
  }, [watchBatchId]);

  const selectedBatch = useMemo(() => {
    return availableBatches.find(b => b.id === watchBatchId) || null;
  }, [watchBatchId, availableBatches]);

  const onSubmit = async (data: PackingBatchFormValues) => {
    // Validate remaining weight manually before submit
    for (const item of data.items) {
      const prodItem = batchItems.find(b => b.id === item.productionItemId);
      if (prodItem) {
        const totalWeight = watchItems?.reduce((sum: number, item: any) => sum + ((Number(item?.quantity) || 0) * (Number(item?.packageSize) || 0)), 0) || 0;
        const netWeight = (item.packageSize + 0.2) * item.packageCount;
        if (netWeight > prodItem.remainingWeight) {
          setError(`Berat produksi ${prodItem.masterPart.name} tidak mencukupi. Sisa: ${prodItem.remainingWeight.toFixed(2)} Kg, Dibutuhkan: ${netWeight.toFixed(2)} Kg`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createPackingAction(data);

    if (result.success) {
      router.push("/admin-produksi/packing");
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-produksi/packing" className="p-2 border rounded-md hover:bg-mist-100 dark:hover:bg-mist-800">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Input Hasil Packing</h1>
            <p className="text-mist-500">Kemas bagian ayam dari hasil produksi</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save className="h-5 w-5" />
          {isSubmitting ? "Menyimpan..." : "Simpan Packing"}
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

        {/* Kolom Kiri: Pilih Batch Produksi */}
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Pilih Batch Produksi</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Packing</label>
              <input
                type="date"
                {...register("packingDate", { valueAsDate: true })}
                className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white"
              />
              {errors.packingDate && <span className="text-red-500 text-xs">{errors.packingDate.message as string}</span>}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium">Production Batch</label>
              <select {...register("productionBatchId")} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white">
                <option value="">-- Pilih Batch --</option>
                {availableBatches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchNo} - DO: {b.incomingChicken.deliveryOrder}
                  </option>
                ))}
              </select>
              {errors.productionBatchId && <span className="text-red-500 text-xs">{errors.productionBatchId.message as string}</span>}
            </div>

            {selectedBatch && (
              <div className="pt-4 border-t space-y-2 text-sm text-mist-600 dark:text-mist-400">
                <div className="flex justify-between"><span>Total Produksi:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedBatch.totalWeight} kg</span></div>
                <div className="flex justify-between"><span>Kandang:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedBatch.incomingChicken.farm.name}</span></div>
                <div className="flex justify-between"><span>Tanggal Produksi:</span> <span className="font-medium text-mist-900 dark:text-white">{selectedBatch.createdAt.toLocaleDateString('id-ID')}</span></div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Sisa Stok Produksi</h2>
            {isLoadingItems ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-orange-600" /></div>
            ) : batchItems.length === 0 ? (
              <p className="text-sm text-mist-500 italic">Pilih batch terlebih dahulu</p>
            ) : (
              <div className="space-y-3">
                {batchItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.masterPart.name}</span>
                    <span className={`font-bold ${item.remainingWeight <= 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {item.remainingWeight.toFixed(2)} kg
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Kolom Kanan: Input Item Packing */}
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-semibold text-lg">Detail Kemasan</h2>
            <button
              type="button"
              disabled={!watchBatchId || isLoadingItems}
              onClick={() => append({ productionItemId: "", packageSize: 5, packageCount: 1 })}
              className="text-sm flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Packing
            </button>
          </div>

          {!watchBatchId ? (
            <div className="text-center p-10 text-mist-500">
              Silakan pilih Production Batch terlebih dahulu.
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {fields.map((field, index) => {
                const watchPartId = watchItems?.[index]?.productionItemId;
                const prodItem = batchItems.find(b => b.id === watchPartId);
                const packageSize = Number(watchItems?.[index]?.packageSize) || 0;
                const packageCount = Number(watchItems?.[index]?.packageCount) || 0;
                const netWeight = (packageSize + 0.2) * packageCount;
                const isOverweight = prodItem ? netWeight > prodItem.remainingWeight : false;

                return (
                  <div key={field.id} className={`flex flex-col gap-4 p-4 border rounded-lg ${isOverweight ? 'bg-red-50 dark:bg-red-950/20 border-red-200' : 'bg-mist-50 dark:bg-mist-900/50'}`}>
                    <div className="flex items-start gap-4 w-full">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-medium text-mist-500 uppercase tracking-wider">Bagian Ayam</label>
                        <select {...register(`items.${index}.productionItemId`)} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white">
                          <option value="">-- Pilih --</option>
                          {batchItems.filter(i => i.remainingWeight > 0 || i.id === watchPartId).map(p => (
                            <option key={p.id} value={p.id}>{p.masterPart.name} (Sisa: {p.remainingWeight.toFixed(2)}kg)</option>
                          ))}
                        </select>
                        {(errors.items as any)?.[index]?.productionItemId && <span className="text-red-500 text-xs">{(errors.items as any)[index].productionItemId.message as string}</span>}
                      </div>

                      <div className="w-32 space-y-2">
                        <label className="text-xs font-medium text-mist-500 uppercase tracking-wider">Kemasan</label>
                        <select {...register(`items.${index}.packageSize`, { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white font-bold text-center">
                          <option value={5}>5 Kg</option>
                          <option value={10}>10 Kg</option>
                        </select>
                      </div>

                      <div className="w-32 space-y-2">
                        <label className="text-xs font-medium text-mist-500 uppercase tracking-wider">Jml Plastik</label>
                        <input type="number" min="1" {...register(`items.${index}.packageCount`, { valueAsNumber: true })} className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white text-center font-bold" />
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

                    {/* Kalkulasi */}
                    <div className="flex items-center gap-6 text-sm bg-white dark:bg-mist-950 p-3 rounded-md border">
                      <div>
                        <span className="text-mist-500">Berat Bersih: </span>
                        <span className="font-semibold">{(packageSize * packageCount).toFixed(2)} Kg</span>
                      </div>
                      <div>
                        <span className="text-mist-500">Penyusutan (0.2/plastik): </span>
                        <span className="font-semibold text-orange-600">{(0.2 * packageCount).toFixed(2)} Kg</span>
                      </div>
                      <div>
                        <span className="text-mist-500">Total Pengambilan: </span>
                        <span className={`font-bold ${isOverweight ? 'text-red-600' : 'text-mist-900 dark:text-white'}`}>{netWeight.toFixed(2)} Kg</span>
                      </div>
                      {isOverweight && (
                        <div className="text-red-600 font-bold ml-auto text-xs">
                          * Melebihi sisa stok!
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-4 border-t mt-4">
            <label className="text-sm font-medium">Catatan Tambahan (Opsional)</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border rounded-md dark:bg-mist-900 bg-white mt-2"
              placeholder="Tambahkan keterangan jika ada..."
            />
          </div>

        </div>

      </div>
    </form>
  );
}
