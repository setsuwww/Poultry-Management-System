"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, ShieldCheck, Trash2, ClipboardCheck } from "lucide-react";
import { cn } from "@/components/layout/AppLayout";
import { TopHeader } from "./TopHeader";

const navItems = [
  { name: "Verifikasi QC", href: "/checker/qc", icon: ClipboardCheck },
  { name: "Gudang Rijek", href: "/checker/qc/rejected", icon: Trash2 },
  { name: "Riwayat Audit", href: "/checker/qc/history", icon: CheckSquare },
];

export function CheckerLayout({ children, user }: { children: React.ReactNode; user?: any }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-mist-50/50 dark:bg-mist-900/50 font-sans">
      <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-mist-950 border-r border-mist-200 dark:border-mist-800 flex flex-col pb-4">
        <div className="h-16 flex items-center px-6 border-b border-mist-200 dark:border-mist-800">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
            <ShieldCheck className="w-6 h-6" />
            <span>Checker Sasak</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/qc" && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold border-r-4 border-orange-600 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500"
                    : "text-mist-600 hover:bg-mist-100 hover:text-mist-900 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-mist-50"
                )}
              >
                <item.icon className="w-5 h-5" />
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
