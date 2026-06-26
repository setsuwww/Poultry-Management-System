import { PackingRepository } from "@/server/repositories/packing.repository";
import { PackingForm } from "@/components/packing/PackingForm";

export default async function NewPackingPage() {
  const batches = await PackingRepository.getProductionBatchesForPacking();

  return (
    <div className="mx-auto py-6">
      <PackingForm availableBatches={batches as any} />
    </div>
  );
}
