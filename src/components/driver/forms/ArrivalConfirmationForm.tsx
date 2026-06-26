"use client";

import { confirmArrivalAction } from "@/actions/driver";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export function ArrivalConfirmationForm({ sj, driverId }: { sj: any, driverId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (!confirm("Apakah Anda yakin telah sampai di tujuan dan barang sudah diturunkan?")) return;

    setLoading(true);
    const res = await confirmArrivalAction(sj.id, driverId);
    setLoading(false);

    if (res.success) {
      alert("Status berhasil diupdate! Menunggu Outlet memverifikasi barang.");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border-l-4 border-l-blue-500 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Dalam Pengiriman
          </span>
          <span className="text-mist-500 text-sm">{new Date(sj.date).toLocaleDateString("id-ID")}</span>
        </div>
        <h3 className="text-xl font-bold text-mist-900 dark:text-white">{sj.sjNumber}</h3>
        <div className="flex items-center text-mist-600 mt-2">
          <MapPin className="w-4 h-4 mr-1 text-mist-400" />
          <span className="font-semibold text-lg">{sj.destination}</span>
        </div>
        <p className="text-sm text-mist-500 mt-1">Muatan: {sj.totalItems} Pack ({sj.totalWeight.toFixed(2)} Kg)</p>
      </div>

      <div className="w-full md:w-auto">
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md hover:shadow-lg"
        >
          {loading ? "Memproses..." : "Barang Telah Sampai"}
        </button>
      </div>
    </div>
  );
}
