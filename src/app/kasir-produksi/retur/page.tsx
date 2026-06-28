import { ReturnForm } from "@/components/kasir/forms/ReturnForm";
import { KasirRepository } from "@/server/repositories/kasir.repository";

export default async function KasirReturnPage() {
  const distributionItems = await KasirRepository.getAvailableDistributionItems();

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Input Barang Sisa (Retur)</h1>
        <p className="text-mist-500 mt-2">Pencatatan sisa barang yang tidak habis terjual dari distribusi untuk dikembalikan ke Gudang.</p>
      </div>

      <ReturnForm distributionItems={distributionItems} />
    </div>
  );
}
