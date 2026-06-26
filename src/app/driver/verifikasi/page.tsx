import { DriverRepository } from "@/server/repositories/driver.repository";
import { prisma } from "@/lib/prisma";
import { DepartureVerificationForm } from "@/components/driver/forms/DepartureVerificationForm";

export default async function DriverVerificationPage() {
  const driver = await prisma.driver.findFirst();
  if (!driver) return <div>Driver tidak ditemukan.</div>;

  const pendingSj = await DriverRepository.getPendingVerifications(driver.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Verifikasi Barang Keluar</h1>
        <p className="text-mist-500 mt-2">Periksa secara fisik kelengkapan barang sebelum kendaraan berangkat menuju Outlet.</p>
      </div>

      {pendingSj.length === 0 ? (
        <div className="bg-white dark:bg-mist-950 p-12 text-center rounded-xl border border-dashed">
          <p className="text-mist-500">Tidak ada Surat Jalan yang menunggu verifikasi Anda saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingSj.map((sj) => (
            <DepartureVerificationForm key={sj.id} sj={sj} driverId={driver.id} />
          ))}
        </div>
      )}
    </div>
  );
}
