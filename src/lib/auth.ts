import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "ayam-kita-secret-key-2024-secure";
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });
}

// RBAC Helpers
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "Owner": ["/admin-produksi", "/kasir-produksi", "/driver", "/outlet", "/admin-so", "/admin-omset", "/checker"],
  "Admin Produksi": ["/admin-produksi"],
  "Kasir Produksi": ["/kasir-produksi"],
  "Driver": ["/driver"],
  "Kasir Outlet": ["/outlet"],
  "Admin SO": ["/admin-so"],
  "Admin Omset": ["/admin-omset"],
  "Checker Sasak": ["/checker"]
};

export function hasPermission(userRole: string, path: string): boolean {
  // Super Admin / Owner has access everywhere ideally, but let's stick to strict RBAC for now
  if (userRole === "Owner") return true; 

  const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
  
  // Periksa apakah path saat ini berawalan dari path yang diizinkan (misal /outlet/penerimaan)
  return allowedPaths.some(p => path === p || path.startsWith(`${p}/`));
}

export async function authorize(path: string) {
  const session = await getSession();
  if (!session) return { authorized: false, reason: "NO_SESSION" };
  
  if (!hasPermission(session.role, path)) {
    return { authorized: false, reason: "UNAUTHORIZED" };
  }

  return { authorized: true, session };
}
