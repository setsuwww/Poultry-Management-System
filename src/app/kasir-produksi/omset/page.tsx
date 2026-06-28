import { RevenueForm } from "@/components/kasir/forms/RevenueForm";

export default function KasirRevenuePage() {
  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Input Omset Harian</h1>
        <p className="text-mist-500 mt-2">Pencatatan uang masuk, piutang, dan pengeluaran hari ini.</p>
      </div>

      <RevenueForm />
    </div>
  );
}
