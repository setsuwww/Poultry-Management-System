"use server";

import { revalidatePath } from "next/cache";
import { ProductionRepository } from "@/server/repositories/production.repository";
import { IncomingChickenRepository } from "@/server/repositories/incoming-chicken.repository";
import { productionBatchSchema, ProductionBatchFormValues } from "@/lib/validations";

export async function createProductionAction(data: ProductionBatchFormValues) {
  try {
    const validatedData = productionBatchSchema.parse(data);

    // Fetch incoming chicken to calculate yield
    const incoming = await IncomingChickenRepository.findById(validatedData.incomingChickenId);
    if (!incoming) {
      throw new Error("Data Ayam Hidup tidak ditemukan");
    }

    // Calculate totals
    const totalWeight = validatedData.items.reduce((sum, item) => sum + item.weight, 0);
    const weightDifference = totalWeight - incoming.totalWeight;
    const yieldPercentage = (totalWeight / incoming.totalWeight) * 100;

    // Generate batch number
    const batchCount = await ProductionRepository.findAllBatches().then(b => b.length);
    const batchNo = `BATCH-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(batchCount + 1).toString().padStart(4, '0')}`;

    await ProductionRepository.createBatch({
      batchNo,
      incomingChickenId: validatedData.incomingChickenId,
      totalWeight,
      yieldPercentage,
      weightDifference,
      items: validatedData.items,
    });

    revalidatePath("/admin-produksi/production");
    revalidatePath("/"); // Dashboard
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Failed to create production batch:", error);
    return { success: false, error: error.message || "Terjadi kesalahan" };
  }
}
