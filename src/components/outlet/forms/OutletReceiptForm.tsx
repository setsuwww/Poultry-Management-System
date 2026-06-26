"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outletVerificationSchema, type OutletVerificationFormValues } from "@/lib/validations";
import { verifyIncomingDeliveryAction } from "@/actions/outlet";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export function OutletReceiptForm({ sj }: { sj: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(outletVerificationSchema),
    defaultValues: {
      distributionOrderId: sj.id,
      items: sj.items.map((item: any) => ({
        distributionItemId: item.id,
        receivedQuantity: item.quantity, // default matches sent
        notes: ""
      }))
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "items"
  });

  async function onSubmit(data: OutletVerificationFormValues) {
    if (!confirm("Apakah Anda yakin jumlah yang diinput sudah benar? Stok Outlet akan bertambah sesuai dengan jumlah yang Anda input ini.")) return;

    setLoading(true);
    const res = await verifyIncomingDeliveryAction(data);
    setLoading(false);
    if (res.success) {
      alert("Penerimaan barang berhasil disimpan! Stok Outlet telah bertambah.");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white dark:bg-mist-950 p-6 rounded-xl border-2 border-emerald-500 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-emerald-600">{sj.sjNumber}</h3>
          <p className="text-sm text-mist-500 mt-1">
            Driver: <span className="font-semibold text-mist-900">{sj.driver?.name}</span> | Kendaraan: <span className="font-semibold text-mist-900">{sj.vehicle?.plateNo}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Tiba di Outlet
          </span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-mist-500 uppercase tracking-wider mb-2 px-2">
          <div className="col-span-4">Barang</div>
          <div className="col-span-2 text-center">Dikirim</div>
          <div className="col-span-3 text-center">Diterima Riil</div>
          <div className="col-span-3">Catatan (Jika Kurang)</div>
        </div>
        {fields.map((field, index) => {
          const dbItem = sj.items.find((i: any) => i.id === (field as any).distributionItemId);
          const sentQty = dbItem?.quantity || 0;
          const watchedQty = form.watch(`items.${index}.receivedQuantity`);
          const isMissing = watchedQty < sentQty;

          return (
            <div key={field.id} className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border ${isMissing ? 'bg-red-50 border-red-200' : 'bg-mist-50 dark:bg-mist-900 border-transparent'}`}>
              <div className="col-span-4 font-semibold text-sm">
                {dbItem?.packingItem.productionItem.masterPart.name} <span className="text-mist-500 text-xs font-normal">({dbItem?.packingItem.packageSize} Kg)</span>
              </div>
              <div className="col-span-2 text-center font-bold text-mist-500 text-lg">
                {sentQty}
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  {...form.register(`items.${index}.receivedQuantity` as const, { valueAsNumber: true })}
                  className={`w-full border rounded-md p-2 text-center font-bold text-lg dark:bg-mist-950 focus:ring-emerald-500 focus:border-emerald-500 ${isMissing ? 'text-red-600 border-red-300' : 'text-emerald-600'}`}
                  max={sentQty}
                  min={0}
                />
              </div>
              <div className="col-span-3">
                {isMissing ? (
                  <input
                    type="text"
                    placeholder="Wajib isi alasan..."
                    {...form.register(`items.${index}.notes` as const)}
                    className="w-full border-red-300 rounded-md p-2 text-sm focus:ring-red-500 focus:border-red-500"
                    required
                  />
                ) : (
                  <span className="text-xs text-mist-400 italic">Sesuai Surat Jalan</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm mb-6 border border-yellow-200 flex gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p><strong>Penting:</strong> Jumlah yang Anda masukkan pada kolom "Diterima Riil" akan langsung ditambahkan ke Stok Outlet. Apabila terdapat selisih kurang, sistem akan mencatatnya sebagai Minus Driver yang dapat memotong tagihan kompensasi uang kelebihan setoran Kasir.</p>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-lg shadow-md">
        {loading ? "Memproses..." : "Sahkan Penerimaan Barang"}
      </button>
    </form>
  );
}
