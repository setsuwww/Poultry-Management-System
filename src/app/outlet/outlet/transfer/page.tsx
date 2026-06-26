import { TransferRepository } from "@/server/repositories/transfer.repository";
import { StockTransferForm } from "@/components/outlet/forms/StockTransferForm";
import { ArrowRight, Box } from "lucide-react";

export default async function OutletTransferPage() {
  const outlets = await TransferRepository.getOutlets();
  const defaultOutletId = outlets.find(o => o.name === 'Outlet Sasak Pusat')?.id;

  if (!defaultOutletId) {
    return <div className="p-8 text-center text-red-500">Error: Outlet belum ada.</div>;
  }

  const { prisma } = await import("@/lib/prisma");
  const inventories = await prisma.outletInventory.findMany({
    where: { outletId: defaultOutletId },
    include: { masterPart: true },
    orderBy: { masterPart: { name: 'asc' } }
  });

  const transfers = await TransferRepository.getTransfers(defaultOutletId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Transfer Barang Antar Outlet</h1>
        <p className="text-mist-500 mt-2">Buat surat jalan untuk memindahkan stok berlebih atau membantu ketersediaan stok di outlet lain.</p>
      </div>

      <StockTransferForm outlets={outlets} inventories={inventories} myOutletId={defaultOutletId} />

      <div className="pt-6">
        <h3 className="font-bold text-mist-900 mb-4 text-xl">Riwayat Transfer Saya</h3>

        <div className="space-y-4">
          {transfers.length === 0 ? (
            <p className="text-mist-500 italic bg-white p-6 rounded-lg border text-center">Belum ada riwayat transfer.</p>
          ) : (
            transfers.map((t) => (
              <div key={t.id} className="bg-white dark:bg-mist-950 p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">{t.transferNo}</span>
                    <span className="text-sm text-mist-500">{new Date(t.date).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg font-bold mt-2">
                    <span className="text-mist-700 dark:text-mist-300">{t.fromOutlet.name}</span>
                    <ArrowRight className="w-5 h-5 text-mist-400" />
                    <span className="text-blue-600">{t.toOutlet.name}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'DITERIMA' ? 'bg-emerald-100 text-emerald-800' :
                      t.status === 'DIKIRIM' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                    }`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <div className="text-sm text-mist-500 mt-2 text-right">
                    {t.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items dipindahkan
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
