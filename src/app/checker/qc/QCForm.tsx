"use client";

import { useState } from "react";
import { submitQCAction } from "@/actions/qc";
import { Check, X, ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function QCForm({ header }: { header: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, "LAYAK_DIJUAL" | "TIDAK_LAYAK">>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleSetResult = (itemId: string, val: "LAYAK_DIJUAL" | "TIDAK_LAYAK") => {
    setResults(prev => ({ ...prev, [itemId]: val }));
  };

  const handleSetNote = (itemId: string, note: string) => {
    setNotes(prev => ({ ...prev, [itemId]: note }));
  };

  const handleSubmit = async () => {
    if (Object.keys(results).length !== header.items.length) {
      alert("Harap pilih keputusan QC untuk SEMUA barang di dalam antrean ini.");
      return;
    }

    if (!confirm("Selesaikan Verifikasi QC? Tindakan ini akan memutasi stok Pusat atau Gudang Rijek secara permanen.")) return;

    setLoading(true);

    const itemsData = header.items.map((it: any) => ({
      qcItemId: it.id,
      masterPartId: it.masterPartId,
      quantity: it.quantity,
      qcResult: results[it.id],
      notes: notes[it.id] || ""
    }));

    const res = await submitQCAction({
      qcHeaderId: header.id,
      items: itemsData,
      type: header.type
    });

    setLoading(false);

    if (res.success) {
      alert("QC Berhasil Diverifikasi!");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-6 pb-4 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 text-xs font-bold rounded ${header.type === 'RETUR' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
              BARANG {header.type}
            </span>
            <span className="text-sm font-semibold text-mist-500">{new Date(header.createdAt).toLocaleString("id-ID")}</span>
          </div>
          <h3 className="text-xl font-bold text-mist-900">Dari Outlet: {header.outlet.name}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {header.items.map((item: any) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-center bg-mist-50 p-4 rounded-lg border">
            <div className="col-span-12 md:col-span-4">
              <p className="text-sm text-mist-500">Nama Barang</p>
              <p className="font-bold text-mist-900 text-lg">{item.masterPart.name}</p>
              <p className="font-bold text-rose-600">{item.quantity} Pack</p>
              {item.notes && <p className="text-xs italic text-mist-500 mt-1">Ket: {item.notes}</p>}
            </div>

            <div className="col-span-12 md:col-span-4 flex gap-2 justify-center">
              <button
                onClick={() => handleSetResult(item.id, "LAYAK_DIJUAL")}
                className={`flex-1 py-3 rounded-lg border-2 font-bold flex flex-col items-center justify-center transition-all ${results[item.id] === "LAYAK_DIJUAL" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-mist-200 text-mist-400 hover:border-emerald-200"
                  }`}
              >
                <Check className="w-6 h-6 mb-1" />
                <span className="text-xs">LAYAK DIJUAL</span>
              </button>
              <button
                onClick={() => handleSetResult(item.id, "TIDAK_LAYAK")}
                className={`flex-1 py-3 rounded-lg border-2 font-bold flex flex-col items-center justify-center transition-all ${results[item.id] === "TIDAK_LAYAK" ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-mist-200 text-mist-400 hover:border-red-200"
                  }`}
              >
                <X className="w-6 h-6 mb-1" />
                <span className="text-xs">TIDAK LAYAK</span>
              </button>
            </div>

            <div className="col-span-12 md:col-span-4">
              <p className="text-sm text-mist-500 mb-1">Catatan QC</p>
              <input
                type="text"
                placeholder="Tambahkan catatan QC (opsional)"
                className="w-full border rounded p-2 text-sm"
                value={notes[item.id] || ""}
                onChange={(e) => handleSetNote(item.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || Object.keys(results).length !== header.items.length}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          <ClipboardCheck className="w-5 h-5" />
          {loading ? "Menyimpan..." : "Selesaikan QC dan Update Stok"}
        </button>
      </div>
    </div>
  );
}
