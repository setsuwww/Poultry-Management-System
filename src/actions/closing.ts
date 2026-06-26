"use server";

import { outletClosingSchema, type OutletClosingFormValues } from "@/lib/outlet-validations";
import { ClosingService } from "@/server/services/closing.service";
import { revalidatePath } from "next/cache";

export async function submitClosingAction(data: OutletClosingFormValues) {
  try {
    const validated = outletClosingSchema.parse(data);
    await ClosingService.submitClosing(validated);
    revalidatePath("/outlet", "layout");
    revalidatePath("/admin-so", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
