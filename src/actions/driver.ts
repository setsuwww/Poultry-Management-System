"use server";

import { driverVerificationSchema, type DriverVerificationFormValues } from "@/lib/validations";
import { DriverService } from "@/server/services/driver.service";
import { revalidatePath } from "next/cache";

export async function verifyDepartureAction(data: DriverVerificationFormValues) {
  try {
    const validatedData = driverVerificationSchema.parse(data);
    await DriverService.verifyDeparture(validatedData);
    revalidatePath("/driver", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function confirmArrivalAction(distributionOrderId: string, driverId: string) {
  try {
    await DriverService.confirmArrival(distributionOrderId, driverId);
    revalidatePath("/driver", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
