"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, AlertTriangle, AlertCircle, RefreshCcw } from "lucide-react";
import { submitSOVerificationAction } from "@/actions/so";

export function VerifyClosingForm({ closing }: { closing: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  // State untuk melacak minus barang dan klasifikasi (khusus untuk UI input)
  const [differences, setDifferences] = useState<{ masterPartId: string, qty: number, classification: "SUSUT" | "HILANG" }[]>([]);

  const handleToggleDiff = (masterPartId: string, diffQty: number, classification: "SUSUT" | "HILANG") => {
    setDifferences(prev => {
      const existing = prev.find(p => p.masterPartId === masterPartId);
      if (existing) {
        if (diffQty === 0) return prev.filter(p => p.masterPartId !== masterPartId);
        return prev.map(p => p.masterPartId === masterPartId ? { ...p, qty: diffQty, classification } : p);
      } else {
        if (diffQty === 0) return prev;
        return [...prev, { masterPartId, qty: diffQty, classification }];
      }
    });
  };

  async function handleApprove() {
    if (isMatch === null) {
      alert("Pilih keputusan verifikasi terlebih dahulu.");
      return;
    }

    if (isMatch === false && differences.length === 0) {
      alert("Anda menyatakan Tidak Sesuai, tapi tidak ada barang yang di-set selisih (minus)-nya.");
      return;
    }

    if (!confirm("Approve verifikasi SO ini? Jika ada selisih, sistem akan langsung mengeksekusi penyesuaian stok dan beban denda karyawan.")) return;

    setLoading(true);

    const formattedDifferences = differences.map(d => ({
      masterPartId: d.masterPartId,
      missingQuantity: d.qty,
      classification: d.classification
    }));

    const res = await submitSOVerificationAction({
      outletClosingId: closing.id,
      isMatch,
      notes: "Audit Manual Disetujui",
      differences: formattedDifferences,
      isRejected: false
    });

    setLoading(false);
    if (res.success) {
      alert("Audit SO berhasil disetujui (Approved).");
      router.push("/admin-so/so");
    } else {
      alert("Error: " + res.error);
    }
  }

  async function handleReject() {
    const notes = prompt("Masukkan alasan penolakan agar Kasir bisa memperbaiki laporan SO-nya:");
    if (notes === null) return;

    setLoading(true);
    const res = await submitSOVerificationAction({
      outletClosingId: closing.id,
      isMatch: false,
      notes,
      differences: [],
      isRejected: true
    });

    setLoading(false);
    if (res.success) {
      alert("Audit SO ditolak (Rejected). Laporan akan dikembalikan ke Kasir.");
      router.push("/admin-so/so");
    } else {
      alert("Error: " + res.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="font-bold text-mist-700">Rincian Laporan Stok Fisik (Dari Kasir)</h3>
          <button
            onClick={handleReject}
            disabled={loading}
            className="flex items-center gap-1 text-sm bg-mist-100 hover:bg-mist-200 text-mist-700 px-3 py-1 rounded-md font-semibold transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Tolak & Kembalikan ke Kasir
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900 border-b">
              <tr>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3 text-center">Stok Sistem</th>
                <th className="px-4 py-3 text-center">Laporan Fisik Kasir</th>
                {isMatch === false && (
                  <th className="px-4 py-3 text-center bg-red-50 text-red-700">Input Selisih Qty & Klasifikasi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {closing.items.map((item: any) => {
                const existingDiff = differences.find(d => d.masterPartId === item.masterPartId);
                const diffQty = existingDiff?.qty || 0;
                const diffClass = existingDiff?.classification || "HILANG";

                return (
                  <tr key={item.id} className="border-b hover:bg-mist-50">
                    <td className="px-4 py-3 font-semibold text-mist-900">{item.masterPart.name}</td>
                    <td className="px-4 py-3 text-center text-blue-600 font-bold">{item.systemOut}</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-black text-lg">{item.finalPhysical}</td>
                    {isMatch === false && (
                      <td className="px-4 py-3 bg-red-50">
                        <div className="flex flex-col gap-2">
                          <input
                            type="number"
                            className="w-full border-red-300 rounded text-center p-1 font-bold text-red-600 focus:ring-red-500 focus:border-red-500"
                            min={0}
                            max={item.systemOut}
                            value={diffQty || ''}
                            placeholder="0"
                            onChange={(e) => handleToggleDiff(item.masterPartId, parseInt(e.target.value) || 0, diffClass)}
                          />
                          {diffQty > 0 && (
                            <select
                              className="text-xs border rounded p-1 bg-white font-semibold"
                              value={diffClass}
                              onChange={(e) => handleToggleDiff(item.masterPartId, diffQty, e.target.value as "SUSUT" | "HILANG")}
                            >
                              <option value="HILANG">HILANG (Denda Kasir)</option>
                              <option value="SUSUT">SUSUT (Rugi Perusahaan)</option>
                            </select>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold text-mist-700 mb-4">Keputusan Verifikasi Stock Opname</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => { setIsMatch(true); setDifferences([]); }}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${isMatch === true ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-mist-200 hover:border-emerald-200 text-mist-500'
              }`}
          >
            <Check className="w-10 h-10 mb-2" />
            <span className="font-bold text-lg">SESUAI</span>
            <span className="text-xs mt-1 text-center">Fisik dan Sistem cocok.</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMatch(false)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${isMatch === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-mist-200 hover:border-red-200 text-mist-500'
              }`}
          >
            <X className="w-10 h-10 mb-2" />
            <span className="font-bold text-lg">TIDAK SESUAI</span>
            <span className="text-xs mt-1 text-center">Ada selisih. Input kuantitas dan klasifikasi di tabel atas.</span>
          </button>
        </div>

        {isMatch === false && differences.length > 0 && (
          <div className="bg-orange-50 text-orange-800 p-4 rounded-lg mb-6 flex flex-col gap-2 text-sm font-semibold border border-orange-200">
            <div className="flex gap-2 items-center">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Rincian Keputusan Audit:</p>
            </div>
            <ul className="list-disc pl-8 font-medium">
              <li>Item bersatus <strong>SUSUT</strong> akan ditanggung kerugiannya oleh perusahaan.</li>
              <li>Item berstatus <strong>HILANG</strong> akan dibebankan denda secara merata kepada {closing.employees.length} petugas shift.</li>
            </ul>
          </div>
        )}

        <button
          onClick={handleApprove}
          disabled={loading || isMatch === null || (isMatch === false && differences.length === 0)}
          className="w-full bg-rose-600 text-white font-bold py-4 rounded-lg hover:bg-rose-700 disabled:opacity-50 text-lg shadow-md"
        >
          {loading ? "Menyimpan Verifikasi..." : "Approve Audit SO"}
        </button>
      </div>
    </div>
  );
}
