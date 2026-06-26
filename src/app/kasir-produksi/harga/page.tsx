import { PriceForm } from "@/components/kasir/forms/PriceForm";
import { prisma } from "@/lib/prisma";

export default async function KasirPricePage() {
  const parts = await prisma.masterPart.findMany({
    include: { productPrice: true }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Update Harga Barang</h1>
        <p className="text-mist-500 mt-2">Ubah harga jual dari potongan ayam.</p>
      </div>

      <PriceForm parts={parts} />
    </div>
  );
}
