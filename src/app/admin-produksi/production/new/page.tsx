import { IncomingChickenRepository } from "@/server/repositories/incoming-chicken.repository";
import { MasterRepository } from "@/server/repositories/master.repository";
import { ProductionForm } from "@/components/production/ProductionForm";

export default async function NewProductionBatchPage() {
  const [availableDOs, masterParts] = await Promise.all([
    IncomingChickenRepository.findAvailableForProduction(),
    MasterRepository.getMasterParts(),
  ]);

  return (
    <div className="mx-auto py-6">
      <ProductionForm availableDOs={availableDOs as any} masterParts={masterParts} />
    </div>
  );
}
