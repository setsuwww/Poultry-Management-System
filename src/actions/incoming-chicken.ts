"use server";

import { revalidatePath } from "next/cache";
import { IncomingChickenRepository } from "@/server/repositories/incoming-chicken.repository";
import { incomingChickenSchema } from "@/lib/validations";

export async function createIncomingChickenAction(formData: FormData) {
  try {
    const rawData = {
      date: new Date(formData.get("date") as string),
      deliveryOrder: formData.get("deliveryOrder"),
      farmId: formData.get("farmId"),
      driverId: formData.get("driverId"),
      vehicleId: formData.get("vehicleId"),
      totalWeight: formData.get("totalWeight"),
      totalCount: formData.get("totalCount"),
      basketCount: formData.get("basketCount"),
    };

    const validatedData = incomingChickenSchema.parse(rawData);

    await IncomingChickenRepository.create({
      date: validatedData.date,
      deliveryOrder: validatedData.deliveryOrder,
      farmId: validatedData.farmId,
      driverId: validatedData.driverId,
      vehicleId: validatedData.vehicleId,
      totalWeight: validatedData.totalWeight,
      totalCount: validatedData.totalCount,
      basketCount: validatedData.basketCount,
    });

    revalidatePath("/admin-produksi/incoming");
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to create incoming chicken:", error);
    return { success: false, error: error.message || "Terjadi kesalahan" };
  }
}
