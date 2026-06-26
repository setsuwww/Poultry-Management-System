import { DriverRepository } from "@/server/repositories/driver.repository";
import { prisma } from "@/lib/prisma";
import { ArrivalConfirmationForm } from "@/components/driver/forms/ArrivalConfirmationForm";

export default async function DriverTransitPage() {
  const driver = await prisma.driver.findFirst();
  if (!driver) return <div>Driver tidak ditemukan.</div>;

  const transitSj = await DriverRepository.getInTransitDeliveries(driver.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Pengiriman Aktif</h1>
        <p className="text-mist-500 mt-2">Daftar Surat Jalan yang sedang Anda antarkan. Konfirmasi saat tiba di tujuan.</p>
      </div>

      {transitSj.length === 0 ? (
        <div className="bg-white dark:bg-mist-950 p-12 text-center rounded-xl border border-dashed">
          <p className="text-mist-500">Tidak ada pengiriman yang sedang berjalan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transitSj.map((sj) => (
            <ArrivalConfirmationForm key={sj.id} sj={sj} driverId={driver.id} />
          ))}
        </div>
      )}
    </div>
  );
}
