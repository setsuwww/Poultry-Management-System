"use server";

import { returnedGoodsSchema, rejectedGoodsSchema, type ReturnedGoodsFormValues, type RejectedGoodsFormValues } from "@/lib/outlet-validations";
import { ReturService } from "@/server/services/retur.service";
import { revalidatePath } from "next/cache";

export async function createReturnedGoodsAction(data: ReturnedGoodsFormValues) {
  try {
    const validated = returnedGoodsSchema.parse(data);
    await ReturService.createReturnedGoods(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createRejectedGoodsAction(data: RejectedGoodsFormValues) {
  try {
    const validated = rejectedGoodsSchema.parse(data);
    await ReturService.createRejectedGoods(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
