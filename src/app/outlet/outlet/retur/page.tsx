import { TransferRepository } from "@/server/repositories/transfer.repository";
import { ReturRepository } from "@/server/repositories/retur.repository";
import { ReturForm } from "@/components/outlet/forms/ReturForm";

export default async function OutletReturPage() {
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

  const histories = await ReturRepository.getReturnedGoods(defaultOutletId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Pengajuan Barang Retur</h1>
        <p className="text-mist-500 mt-2">Gunakan fitur ini untuk mengembalikan barang yang kurang diminati/laku ke Pusat.</p>
      </div>

      <ReturForm inventories={inventories} myOutletId={defaultOutletId} type="RETUR" />

      <div className="pt-6">
        <h3 className="font-bold text-mist-900 mb-4 text-xl">Riwayat Retur Saya</h3>

        <div className="space-y-4">
          {histories.length === 0 ? (
            <p className="text-mist-500 italic bg-white p-6 rounded-lg border text-center">Belum ada pengajuan retur.</p>
          ) : (
            histories.map((t) => (
              <div key={t.id} className="bg-white dark:bg-mist-950 p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">Retur</span>
                    <span className="text-sm text-mist-500">{new Date(t.date).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="text-sm text-mist-700 mt-2">
                    <span className="font-bold">{t.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items</span> diajukan.
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
