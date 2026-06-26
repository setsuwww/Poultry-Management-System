"use server";

import { QCService } from "@/server/services/qc.service";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function submitQCAction(data: any) {
  try {
    const session = await getSession();
    const checkerName = session?.name || "Checker";
    
    await QCService.submitVerification(data, checkerName);
    
    revalidatePath("/checker", "layout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
