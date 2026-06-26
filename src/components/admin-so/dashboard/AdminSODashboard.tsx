"use client";

import { AlertOctagon, CheckCircle, PackageMinus, Scissors } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AdminSODashboard({
  totalSusut,
  totalHilang,
  chartData
}: {
  totalSusut: number,
  totalHilang: number,
  chartData: any[]
}) {
  return (
    <div className="space-y-6 mb-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex flex-col gap-2 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 text-mist-500 font-semibold text-sm uppercase tracking-wide">
            <CheckCircle className="w-4 h-4 text-blue-500" /> Audit Menunggu
          </div>
          <div className="text-3xl font-black text-mist-900 dark:text-white">...</div>
        </div>

        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex flex-col gap-2 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-2 text-mist-500 font-semibold text-sm uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4 text-rose-500" /> Total Ditolak
          </div>
          <div className="text-3xl font-black text-mist-900 dark:text-white">...</div>
        </div>

        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex flex-col gap-2 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 text-mist-500 font-semibold text-sm uppercase tracking-wide">
            <Scissors className="w-4 h-4 text-orange-500" /> Total Susut
          </div>
          <div className="text-3xl font-black text-mist-900 dark:text-white">{totalSusut} Pack</div>
          <div className="text-xs text-mist-400">Kerugian Perusahaan</div>
        </div>

        <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm flex flex-col gap-2 border-l-4 border-l-red-600">
          <div className="flex items-center gap-2 text-mist-500 font-semibold text-sm uppercase tracking-wide">
            <PackageMinus className="w-4 h-4 text-red-600" /> Total Hilang
          </div>
          <div className="text-3xl font-black text-red-600">{totalHilang} Pack</div>
          <div className="text-xs text-mist-400">Tanggungan Karyawan</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm h-80 flex flex-col">
        <h3 className="font-bold text-mist-700 mb-4">Tren Selisih Barang: Susut vs Hilang</h3>
        <div className="flex-1 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-mist-500">Belum ada data selisih barang</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSusut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHilang" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="susut" name="Barang Susut" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorSusut)" />
                <Area type="monotone" dataKey="hilang" name="Barang Hilang" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorHilang)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
