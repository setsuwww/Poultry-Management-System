import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
  data: {
    id: string;
    sjNumber: string;
    date: Date;
    destination: string;
    type: string;
    totalItems: number;
    totalWeight: number;
    status: string;
    driver: { name: string };
  }[];
};

export function TodayDistributionTable({ data }: Props) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-mist-50/50 dark:bg-mist-900/50">
        <h2 className="font-semibold text-lg">Distribusi Hari Ini</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-4 py-3 font-medium">No. Surat Jalan</th>
              <th className="px-4 py-3 font-medium">Tujuan</th>
              <th className="px-4 py-3 font-medium">Jenis</th>
              <th className="px-4 py-3 font-medium text-center">Jml Item</th>
              <th className="px-4 py-3 font-medium text-right">Total Berat</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-mist-500">Belum ada distribusi hari ini.</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-4 py-3 font-bold text-blue-600">{row.sjNumber}</td>
                  <td className="px-4 py-3 font-medium">{row.destination}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.type === 'OUTLET' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{row.totalItems}</td>
                  <td className="px-4 py-3 text-right font-medium">{row.totalWeight.toFixed(2)} kg</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
