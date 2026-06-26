"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, PackageSearch, DollarSign, Wallet, AlertTriangle } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { cn } from "@/components/layout/AppLayout"; // re-using cn from AppLayout

const navItems = [
  { name: "Dashboard", href: "/outlet", icon: LayoutDashboard },
  { name: "Terima Barang", href: "/outlet/penerimaan", icon: CheckSquare },
  { name: "Stok Outlet", href: "/outlet/stok", icon: PackageSearch },
  { name: "Input Omset", href: "/outlet/omset", icon: DollarSign },
  { name: "Setor Kas", href: "/outlet/setoran", icon: Wallet },
  { name: "Closing Harian", href: "/outlet/closing", icon: PackageSearch },
  { name: "Transfer Barang", href: "/outlet/transfer", icon: LayoutDashboard },
  { name: "Barang Retur", href: "/outlet/retur", icon: CheckSquare },
  { name: "Barang Rijek", href: "/outlet/rijek", icon: AlertTriangle },
];

export function OutletLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mist-50/50 dark:bg-mist-900/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-emerald-950 text-white pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-emerald-900 px-6">
          <Wallet className="w-6 h-6 mr-2 text-emerald-400" />
          <span className="text-lg font-bold tracking-tight">Kasir Outlet</span>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/outlet" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold border-r-4 border-orange-600 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500"
                    : "text-mist-600 hover:bg-mist-100 hover:text-mist-900 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-mist-50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 pl-64 w-full min-h-screen">
        <TopHeader user={user} />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
