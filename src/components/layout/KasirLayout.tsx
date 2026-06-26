"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, ShoppingCart, DollarSign, ArrowLeftRight, Tag, CheckCircle2, RefreshCcw, Tags, Wallet, User } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard Kasir", href: "/kasir-produksi/kasir", icon: LayoutDashboard },
  { name: "Input Distribusi", href: "/kasir-produksi/distribusi", icon: Truck },
  { name: "Beli Pendukung", href: "/kasir-produksi/pembelian", icon: ShoppingCart },
  { name: "Omset Harian", href: "/kasir-produksi/omset", icon: DollarSign },
  { name: "Barang Sisa (Retur)", href: "/kasir-produksi/retur", icon: RefreshCcw },
  { name: "Update Harga", href: "/kasir-produksi/harga", icon: Tags },
];

export function KasirLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mist-50/50 dark:bg-mist-900/50">
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-white dark:bg-mist-950 pb-4">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <span className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-500">Kasir Produksi</span>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/kasir" && pathname.startsWith(item.href));
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

      <div className="flex flex-col flex-1 pl-64 w-full min-h-screen">
        <TopHeader user={user} />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
