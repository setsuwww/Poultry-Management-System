import { DriverRepository } from "@/server/repositories/driver.repository";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, Clock } from "lucide-react";

export default async function DriverHistoryPage() {
  const driver = await prisma.driver.findFirst();
  if (!driver) return <div>Driver tidak ditemukan.</div>;

  const history = await DriverRepository.getDeliveryHistory(driver.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Riwayat Pengiriman</h1>
        <p className="text-mist-500 mt-2">Daftar seluruh rekam jejak Surat Jalan yang Anda tangani.</p>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-4 py-3 font-medium">No. SJ</th>
                <th className="px-4 py-3 font-medium">Tujuan</th>
                <th className="px-4 py-3 font-medium text-center">Status Terakhir</th>
                <th className="px-4 py-3 font-medium text-center">Log Perjalanan</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-mist-500">Belum ada riwayat pengiriman.</td>
                </tr>
              ) : (
                history.map((row) => (
                  <tr key={row.id} className="border-b dark:border-mist-800">
                    <td className="px-4 py-4 font-bold text-indigo-600 align-top">{row.sjNumber}</td>
                    <td className="px-4 py-4 font-medium align-top">
                      {row.destination}
                      <span className="block text-xs text-mist-500 font-normal mt-1">{new Date(row.date).toLocaleDateString("id-ID")}</span>
                    </td>
                    <td className="px-4 py-4 text-center align-top">
                      <span className="bg-mist-100 text-mist-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {row.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div className="space-y-3">
                        {row.logs.length > 0 ? row.logs.map((log: any, idx: number) => (
                          <div key={log.id} className="flex gap-2">
                            <div className="flex flex-col items-center">
                              {idx === 0 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-mist-300" />}
                              {idx < row.logs.length - 1 && <div className="w-[2px] h-full bg-mist-200 my-1"></div>}
                            </div>
                            <div className="pb-1">
                              <span className="font-semibold block">{log.status.replace(/_/g, ' ')}</span>
                              <span className="text-mist-500">{new Date(log.createdAt).toLocaleString("id-ID")}</span>
                              {log.notes && <span className="block text-mist-600 italic mt-1">"{log.notes}"</span>}
                            </div>
                          </div>
                        )) : (
                          <span className="text-mist-400">Tidak ada log</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
