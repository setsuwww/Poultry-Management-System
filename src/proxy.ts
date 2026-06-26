import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, hasPermission } from "@/lib/auth";

const publicRoutes = ["/"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan asset publik dan API
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);
  const sessionCookie = request.cookies.get("session")?.value;
  let session = null;
  
  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  // Jika belum login dan mengakses route private -> redirect ke login
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika sudah login dan mengakses halaman login -> redirect ke dashboard / role root
  if (session && isPublicRoute) {
    const roleRoutes: Record<string, string> = {
      "Owner": "/admin-produksi/dashboard",
      "Admin Produksi": "/admin-produksi/dashboard",
      "Kasir Produksi": "/kasir-produksi/kasir",
      "Driver": "/driver/driver",
      "Kasir Outlet": "/outlet/penerimaan",
      "Admin SO": "/admin-so/so",
      "Admin Omset": "/admin-omset/finance",
      "Checker Sasak": "/checker/qc"
    };
    const redirectPath = roleRoutes[session.role] || "/admin-produksi/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Cek otorisasi RBAC untuk route private
  if (session && !isPublicRoute && pathname !== "/" && pathname !== "/unauthorized") {
    const isAuthorized = hasPermission(session.role, pathname);
    
    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
