import { FinanceRepository } from "@/server/repositories/finance.repository";
import { VerifyDepositForm } from "@/components/finance/forms/VerifyDepositForm";

export default async function FinanceVerifikasiPage() {
  const pendingDeposits = await FinanceRepository.getPendingDeposits();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Verifikasi Setoran Kas</h1>
        <p className="text-mist-500 mt-2">
          Bandingkan uang fisik yang disetor oleh Kasir Outlet dengan data penjualan yang tercatat di aplikasi Kasir Pintar.
        </p>
      </div>

      {pendingDeposits.length === 0 ? (
        <div className="bg-white dark:bg-mist-950 p-12 text-center rounded-xl border border-dashed">
          <p className="text-mist-500 text-lg">Tidak ada setoran yang menunggu verifikasi saat ini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingDeposits.map((deposit) => (
            <VerifyDepositForm key={deposit.id} deposit={deposit} />
          ))}
        </div>
      )}
    </div>
  );
}
