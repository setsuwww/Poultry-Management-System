"use server";

import { stockTransferSchema, type StockTransferFormValues } from "@/lib/outlet-validations";
import { TransferService } from "@/server/services/transfer.service";
import { revalidatePath } from "next/cache";

export async function createTransferAction(data: StockTransferFormValues) {
  try {
    const validated = stockTransferSchema.parse(data);
    await TransferService.createTransfer(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTransferStatusAction(transferId: string, status: string) {
  try {
    await TransferService.updateTransferStatus(transferId, status);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
