"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, AlertOctagon, ClipboardList, PackageSearch } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { cn } from "@/components/layout/AppLayout";

const navItems = [
  { name: "Verifikasi Closing", href: "/admin-so/so", icon: ClipboardList },
  { name: "Buku Besar (Ledger)", href: "/admin-so/so/ledger", icon: PackageSearch },
  { name: "Tanggungan Karyawan", href: "/admin-so/so/liabilities", icon: AlertOctagon },
  { name: "Riwayat Audit", href: "/admin-so/so/history", icon: CheckCircle },
];

export function AdminSOLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-mist-50 dark:bg-mist-900">
      <aside className="w-64 bg-white dark:bg-mist-950 border-r border-mist-200 dark:border-mist-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-mist-200 dark:border-mist-800">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <PackageSearch className="w-6 h-6" />
            <span>Admin SO</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500"
                    : "text-mist-600 hover:bg-mist-100 hover:text-mist-900 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-mist-50"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-mist-600 hover:text-mist-900 dark:text-mist-400 dark:hover:text-mist-50")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <TopHeader user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
