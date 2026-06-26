"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, CheckSquare, Clock, MapPin, AlertCircle, Menu } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { cn } from "@/components/layout/AppLayout"; // re-using cn from AppLayout

const navItems = [
  { name: "Dashboard", href: "/driver", icon: Truck },
  { name: "Verifikasi Keluar", href: "/driver/verifikasi", icon: CheckSquare },
  { name: "Pengiriman Aktif", href: "/driver/pengiriman", icon: MapPin },
  { name: "Riwayat Pengiriman", href: "/driver/riwayat", icon: Clock },
  { name: "Minus Driver", href: "/driver/minus", icon: AlertCircle },
];

export function DriverLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mist-50/50 dark:bg-mist-900/50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-indigo-950 text-white pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-indigo-900 px-6">
          <Truck className="w-6 h-6 mr-2 text-indigo-400" />
          <span className="text-lg font-bold tracking-tight">Portal Driver</span>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/driver" && pathname.startsWith(item.href));
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
