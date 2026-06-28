"use server";

import { revalidatePath } from "next/cache";
import { MasterRepository } from "@/server/repositories/master.repository";

// FARMS
export async function createFarmAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    if (!name) throw new Error("Nama kandang diperlukan");
    await MasterRepository.createFarm(name);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateFarmAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    if (!id || !name) throw new Error("ID dan Nama kandang diperlukan");
    await MasterRepository.updateFarm(id, name);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFarmAction(id: string) {
  try {
    await MasterRepository.deleteFarm(id);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// DRIVERS
export async function createDriverAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    if (!name) throw new Error("Nama supir diperlukan");
    await MasterRepository.createDriver(name);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDriverAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    if (!id || !name) throw new Error("ID dan Nama supir diperlukan");
    await MasterRepository.updateDriver(id, name);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDriverAction(id: string) {
  try {
    await MasterRepository.deleteDriver(id);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// VEHICLES
export async function createVehicleAction(formData: FormData) {
  try {
    const plateNo = formData.get("plateNo") as string;
    if (!plateNo) throw new Error("No Polisi diperlukan");
    await MasterRepository.createVehicle(plateNo);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVehicleAction(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const plateNo = formData.get("plateNo") as string;
    if (!id || !plateNo) throw new Error("ID dan No Polisi diperlukan");
    await MasterRepository.updateVehicle(id, plateNo);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVehicleAction(id: string) {
  try {
    await MasterRepository.deleteVehicle(id);
    revalidatePath("/admin-produksi/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
