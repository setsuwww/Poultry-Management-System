import { OutletRepository } from "@/server/repositories/outlet.repository";
import { TransferRepository } from "@/server/repositories/transfer.repository";
import { OutletClosingForm } from "@/components/outlet/forms/OutletClosingForm";

export default async function OutletClosingPage() {
  const outlets = await TransferRepository.getOutlets();
  const defaultOutletId = outlets.find(o => o.name === 'Outlet Sasak Pusat')?.id;

  if (!defaultOutletId) {
    return <div className="p-8 text-center text-red-500">Error: Outlet Sasak Pusat belum ada di database. Harap jalankan seed.</div>;
  }

  // Get current inventory
  // using dynamic import or directly prisma to get inventory specific to outlet
  const { prisma } = await import("@/lib/prisma");
  const inventories = await prisma.outletInventory.findMany({
    where: { outletId: defaultOutletId },
    include: { masterPart: true },
    orderBy: { masterPart: { name: 'asc' } }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Closing Harian (Stock Opname)</h1>
        <p className="text-mist-500 mt-2">
          Lakukan validasi akhir stok nyata (Sisa Fisik) di gudang sebelum toko ditutup.
        </p>
      </div>

      {inventories.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed">
          <p className="text-mist-500">Belum ada barang di outlet ini.</p>
        </div>
      ) : (
        <OutletClosingForm outletId={defaultOutletId} inventories={inventories} />
      )}
    </div>
  );
}
