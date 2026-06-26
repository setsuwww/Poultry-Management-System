import { MasterRepository } from "@/server/repositories/master.repository";
import { IncomingForm } from "@/components/incoming/IncomingForm";

export default async function NewIncomingChickenPage() {
  const [farms, drivers, vehicles] = await Promise.all([
    MasterRepository.getFarms(),
    MasterRepository.getDrivers(),
    MasterRepository.getVehicles(),
  ]);

  return (
    <div className="mx-auto py-6">
      <IncomingForm farms={farms} drivers={drivers} vehicles={vehicles} />
    </div>
  );
}
