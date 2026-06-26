"use server";

import { soVerificationSchema, type SOVerificationFormValues } from "@/lib/outlet-validations";
import { ClosingService } from "@/server/services/closing.service";
import { revalidatePath } from "next/cache";

export async function submitSOVerificationAction(data: SOVerificationFormValues) {
  try {
    const validated = soVerificationSchema.parse(data);
    await ClosingService.verifyClosing(validated);
    revalidatePath("/admin-so", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
