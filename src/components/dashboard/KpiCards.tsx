import { Scale, FileOutput, Percent, Box, Hash } from "lucide-react";

type KpiProps = {
  data: {
    batchCount: number;
    totalIncomingWeight: number;
    totalChickenCount: number;
    totalProductionWeight: number;
    avgYield: number;
  };
};

export function KpiCards({ data }: KpiProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-mist-00 shadow-xs flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist-500">Total Batch Hari Ini</span>
          <Box className="h-5 w-5 text-orange-500" />
        </div>
        <span className="text-2xl font-bold mt-4">{data.batchCount}</span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-mist-00 shadow-xs flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist-500">Berat Masuk (Kg)</span>
          <Scale className="h-5 w-5 text-blue-500" />
        </div>
        <span className="text-2xl font-bold mt-4 text-blue-600">
          {data.totalIncomingWeight.toLocaleString()} kg
        </span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-mist-00 shadow-xs flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist-500">Ekor Ayam (Masuk)</span>
          <Hash className="h-5 w-5 text-teal-500" />
        </div>
        <span className="text-2xl font-bold mt-4 text-teal-600">
          {data.totalChickenCount.toLocaleString()} ekor
        </span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-mist-00 shadow-xs flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist-500">Berat Produksi (Kg)</span>
          <FileOutput className="h-5 w-5 text-green-500" />
        </div>
        <span className="text-2xl font-bold mt-4 text-green-600">
          {data.totalProductionWeight.toLocaleString()} kg
        </span>
      </div>

      <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border border-mist-00 shadow-xs flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-mist-500">Rata-rata Yield</span>
          <Percent className="h-5 w-5 text-orange-500" />
        </div>
        <span className="text-2xl font-bold mt-4">{data.avgYield.toFixed(2)}%</span>
      </div>
    </div>
  );
}
