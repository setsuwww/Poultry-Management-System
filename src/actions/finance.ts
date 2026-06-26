"use server";

import { verifyDepositSchema, type VerifyDepositFormValues } from "@/lib/validations";
import { FinanceService } from "@/server/services/finance.service";
import { revalidatePath } from "next/cache";

export async function verifyDepositAction(data: VerifyDepositFormValues) {
  try {
    const validated = verifyDepositSchema.parse(data);
    await FinanceService.verifyDeposit(validated);
    revalidatePath("/admin-omset", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
