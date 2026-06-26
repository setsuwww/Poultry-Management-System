"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Props = {
  data: {
    date: string;
    omset: number;
  }[];
};

export function KasirTrendChart({ data }: Props) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm p-4 w-full h-full min-h-[300px] flex flex-col">
      <div className="mb-4">
        <h2 className="font-semibold text-lg text-mist-900 dark:text-white">Trend Omset Harian</h2>
        <p className="text-sm text-mist-500">Pergerakan total revenue selama 14 hari terakhir</p>
      </div>

      <div className="flex-1 w-full mt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-mist-500">
            Belum ada data keuangan
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOmset" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={(value) => `Rp${(value / 1000)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString()}`, 'Omset']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="omset" name="Omset Harian" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorOmset)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
