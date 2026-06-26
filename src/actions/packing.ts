"use server";

import { packingBatchSchema, PackingBatchFormValues } from "@/lib/validations";
import { PackingRepository } from "@/server/repositories/packing.repository";
import { revalidatePath } from "next/cache";

export async function createPackingAction(data: PackingBatchFormValues) {
  try {
    const validatedData = packingBatchSchema.parse(data);

    await PackingRepository.createPackingBatch(validatedData);

    revalidatePath("/");
    revalidatePath("/admin-produksi/packing");
    
    return { success: true };
  } catch (error: any) {
    console.error("Packing Action Error:", error);
    return {
      success: false,
      error: error.message || "Gagal menyimpan data packing.",
    };
  }
}

export async function getBatchItemsAction(batchId: string) {
  try {
    const items = await PackingRepository.getProductionBatchItemsWithRemainingWeight(batchId);
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengambil data." };
  }
}
