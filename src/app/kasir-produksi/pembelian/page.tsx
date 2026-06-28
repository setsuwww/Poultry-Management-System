import { PurchaseForm } from "@/components/kasir/forms/PurchaseForm";
import { prisma } from "@/lib/prisma";

export default async function KasirPurchasePage() {
  const supportItems = await prisma.masterSupportItem.findMany();

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Pembelian Barang Pendukung</h1>
        <p className="text-mist-500 mt-2">Catat pembelian inventaris seperti Plastik, Kardus, dsb.</p>
      </div>

      <PurchaseForm supportItems={supportItems} />
    </div>
  );
}
