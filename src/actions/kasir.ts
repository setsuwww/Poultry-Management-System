"use server";

import { 
  distributionOrderSchema, 
  purchaseTransactionSchema, 
  dailyRevenueSchema, 
  returnedItemSchema, 
  productPriceSchema 
} from "@/lib/validations";
import { KasirService } from "@/server/services/kasir.service";
import { KasirRepository } from "@/server/repositories/kasir.repository";
import { revalidatePath } from "next/cache";

export async function createDistributionAction(data: any) {
  try {
    const validatedData = distributionOrderSchema.parse(data);
    await KasirService.createDistributionOrder(validatedData);
    revalidatePath("/kasir-produksi", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPurchaseAction(data: any) {
  try {
    const validatedData = purchaseTransactionSchema.parse(data);
    await KasirService.createPurchaseTransaction(validatedData);
    revalidatePath("/kasir-produksi", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDailyRevenueAction(data: any) {
  try {
    const validatedData = dailyRevenueSchema.parse(data);
    await KasirService.createDailyRevenue(validatedData);
    revalidatePath("/kasir-produksi", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createReturnedItemAction(data: any) {
  try {
    const validatedData = returnedItemSchema.parse(data);
    await KasirService.createReturnedItem(validatedData);
    revalidatePath("/kasir-produksi", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProductPriceAction(data: any) {
  try {
    const validatedData = productPriceSchema.parse(data);
    await KasirService.updateProductPrice(validatedData);
    revalidatePath("/kasir-produksi", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function getAvailablePackingItemsAction() {
  try {
    const items = await KasirRepository.getAvailablePackingItems();
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAvailableDistributionItemsAction() {
  try {
    const items = await KasirRepository.getAvailableDistributionItems();
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
