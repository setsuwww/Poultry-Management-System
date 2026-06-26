"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6'];

export function DashboardCharts({ topParts }: { topParts: { name: string; weight: number }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Top Parts Pie Chart */}
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Bagian Ayam Diproduksi</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topParts}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="weight"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {topParts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} kg`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Another placeholder for bar chart (e.g. daily production) */}
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Grafik Produksi Harian</h3>
        <div className="h-[300px] w-full flex items-center justify-center text-mist-400">
          <p>Membutuhkan data time-series (Opsional tahap 1)</p>
        </div>
      </div>
    </div>
  );
}
