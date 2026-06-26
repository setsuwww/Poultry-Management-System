import { TransferRepository } from "@/server/repositories/transfer.repository";
import { ReturRepository } from "@/server/repositories/retur.repository";
import { ReturForm } from "@/components/outlet/forms/ReturForm";

export default async function OutletRijekPage() {
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

  const histories = await ReturRepository.getRejectedGoods(defaultOutletId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-red-600">Pelaporan Barang Rijek</h1>
        <p className="text-mist-500 mt-2">Gunakan fitur ini untuk melaporkan barang rusak atau tidak layak jual agar stok disesuaikan.</p>
      </div>

      <ReturForm inventories={inventories} myOutletId={defaultOutletId} type="RIJEK" />

      <div className="pt-6">
        <h3 className="font-bold text-mist-900 mb-4 text-xl">Riwayat Laporan Rijek</h3>

        <div className="space-y-4">
          {histories.length === 0 ? (
            <p className="text-mist-500 italic bg-white p-6 rounded-lg border text-center">Belum ada laporan rijek.</p>
          ) : (
            histories.map((t) => (
              <div key={t.id} className="bg-white dark:bg-mist-950 p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between gap-4 border-l-4 border-l-red-500">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Barang Rusak</span>
                    <span className="text-sm text-mist-500">{new Date(t.date).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="text-sm text-mist-700 mt-2">
                    <span className="font-bold">{t.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items</span> dilaporkan rijek.
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
