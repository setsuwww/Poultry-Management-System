"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverVerificationSchema, type DriverVerificationFormValues } from "@/lib/validations";
import { verifyDepartureAction } from "@/actions/driver";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DepartureVerificationForm({ sj, driverId }: { sj: any, driverId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(driverVerificationSchema),
    defaultValues: {
      distributionOrderId: sj.id,
      driverId: driverId,
      isApproved: true,
      notes: "",
      signatureData: "SIMULATED_SIGNATURE_BASE64" // In real app, use a canvas drawing component
    }
  });

  const isApproved = form.watch("isApproved");

  async function onSubmit(data: DriverVerificationFormValues) {
    setLoading(true);
    const res = await verifyDepartureAction(data);
    setLoading(false);
    if (res.success) {
      alert("Verifikasi berhasil disimpan!");
      router.refresh();
      setShowForm(false);
    } else {
      alert("Error: " + res.error);
    }
  }

  if (!showForm) {
    return (
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-indigo-600">{sj.sjNumber}</h3>
            <p className="text-sm text-mist-500">{new Date(sj.date).toLocaleDateString("id-ID")} - {sj.destination}</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
            Buka Pengecekan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border-2 border-indigo-500 shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4 border-b pb-4">
        <div>
          <h3 className="text-xl font-bold text-indigo-600">Pengecekan Fisik: {sj.sjNumber}</h3>
          <p className="text-sm text-mist-500 mt-1">Tujuan: <span className="font-semibold text-mist-900">{sj.destination}</span></p>
          <p className="text-sm text-mist-500">Kendaraan: <span className="font-semibold text-mist-900">{sj.vehicle?.plateNo}</span></p>
        </div>
        <button onClick={() => setShowForm(false)} className="text-mist-400 hover:text-mist-600">Batal</button>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-mist-900 mb-2">Daftar Muatan:</h4>
        <div className="space-y-2">
          {sj.items.map((item: any, idx: number) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-mist-50 dark:bg-mist-900 rounded-lg">
              <div>
                <span className="font-bold">{idx + 1}. {item.packingItem.productionItem.masterPart.name}</span>
                <p className="text-xs text-mist-500">({item.packingItem.packageSize} Kg / pack)</p>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg">{item.quantity} Pack</span>
                <span className="block text-xs text-mist-500">{item.weight.toFixed(2)} Kg</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-indigo-50 text-indigo-900 rounded-lg flex justify-between font-bold">
          <span>Total</span>
          <span>{sj.totalItems} Pack ({sj.totalWeight.toFixed(2)} Kg)</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hasil Pengecekan Fisik</label>
          <div className="flex gap-4">
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 transition-colors ${isApproved === true ? 'bg-green-50 border-green-500 text-green-700' : 'hover:bg-mist-50'}`}>
              <input type="radio" className="hidden" {...form.register("isApproved")} value="true" onChange={() => form.setValue("isApproved", true)} />
              <span className="font-bold">Barang Sudah Sesuai</span>
            </label>
            <label className={`flex-1 border rounded-lg p-3 cursor-pointer flex items-center justify-center gap-2 transition-colors ${isApproved === false ? 'bg-red-50 border-red-500 text-red-700' : 'hover:bg-mist-50'}`}>
              <input type="radio" className="hidden" {...form.register("isApproved")} value="false" onChange={() => form.setValue("isApproved", false)} />
              <span className="font-bold">Barang Tidak Sesuai</span>
            </label>
          </div>
        </div>

        {!isApproved && (
          <div>
            <label className="block text-sm font-medium mb-1 text-red-600">Alasan Penolakan (Wajib)</label>
            <textarea {...form.register("notes")} className="w-full border-red-300 rounded-md p-2 dark:bg-mist-900 focus:ring-red-500 focus:border-red-500" rows={3} placeholder="Contoh: Jumlah kurang 2 pack, Kemasan rusak..." required={!isApproved} />
          </div>
        )}

        {isApproved && (
          <div className="border border-dashed p-4 rounded-lg bg-mist-50 text-center text-sm text-mist-500">
            [ Area Tanda Tangan Digital Tersimulasi ]
          </div>
        )}

        <button type="submit" disabled={loading} className={`w-full text-white font-semibold p-3 rounded-lg disabled:opacity-50 ${isApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? "Menyimpan..." : isApproved ? "Tanda Tangani & Berangkat" : "Tolak Muatan"}
        </button>
      </form>
    </div>
  );
}
