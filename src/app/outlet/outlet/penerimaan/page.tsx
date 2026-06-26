import { OutletRepository } from "@/server/repositories/outlet.repository";
import { OutletReceiptForm } from "@/components/outlet/forms/OutletReceiptForm";

export default async function OutletPenerimaanPage() {
  const pendingDeliveries = await OutletRepository.getPendingDeliveries();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Verifikasi Penerimaan Barang</h1>
        <p className="text-mist-500 mt-2">
          Cek kelengkapan barang fisik yang dibawa Driver. Konfirmasi Anda di sini akan menambah Stok Outlet Anda.
        </p>
      </div>

      {pendingDeliveries.length === 0 ? (
        <div className="bg-white dark:bg-mist-950 p-12 text-center rounded-xl border border-dashed">
          <p className="text-mist-500 text-lg">Saat ini tidak ada kendaraan yang menunggu bongkar muat.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingDeliveries.map((sj) => (
            <OutletReceiptForm key={sj.id} sj={sj} />
          ))}
        </div>
      )}
    </div>
  );
}
