"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan Password wajib diisi" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return { error: "Email atau Password salah" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Email atau Password salah" };
    }

    // Set Session (24 hours)
    await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    });

    return { success: true, role: user.role.name };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan internal server" };
  }
}

export async function logoutAction() {
  const { destroySession } = await import("@/lib/auth");
  await destroySession();
  return { success: true };
}
