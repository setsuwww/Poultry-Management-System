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

type TrendDataProps = {
  data: {
    date: string;
    incoming: number;
    production: number;
  }[];
};

export function ProductionTrendChart({ data }: TrendDataProps) {
  return (
    <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm p-4 w-full h-full min-h-[400px] flex flex-col">
      <div className="mb-4">
        <h2 className="font-semibold text-lg text-mist-900 dark:text-white">Trend Produksi Harian</h2>
        <p className="text-sm text-mist-500">Perbandingan Ayam Hidup Masuk dan Hasil Produksi</p>
      </div>

      <div className="flex-1 w-full mt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-mist-500">
            Belum ada data produksi
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                formatter={(value: any) => [`${Number(value || 0).toFixed(2)} kg`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="incoming"
                name="Ayam Hidup Masuk"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncoming)"
              />
              <Area
                type="monotone"
                dataKey="production"
                name="Hasil Produksi"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProduction)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
