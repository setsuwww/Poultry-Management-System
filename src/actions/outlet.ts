"use server";

import { 
  outletVerificationSchema, 
  dailyOutletRevenueSchema, 
  cashDepositSchema, 
  type OutletVerificationFormValues,
  type DailyOutletRevenueFormValues,
  type CashDepositFormValues
} from "@/lib/validations";
import { OutletService } from "@/server/services/outlet.service";
import { revalidatePath } from "next/cache";

export async function verifyIncomingDeliveryAction(data: OutletVerificationFormValues) {
  try {
    const validated = outletVerificationSchema.parse(data);
    await OutletService.verifyIncomingDelivery(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitDailyRevenueAction(data: DailyOutletRevenueFormValues) {
  try {
    const validated = dailyOutletRevenueSchema.parse(data);
    await OutletService.submitDailyRevenue(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitCashDepositAction(data: CashDepositFormValues) {
  try {
    const validated = cashDepositSchema.parse(data);
    await OutletService.submitCashDeposit(validated);
    revalidatePath("/outlet", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
