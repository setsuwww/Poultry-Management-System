import { User, LogOut } from "lucide-react";

interface TopHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

const roleColoringBadge: Record<string, string> = {
  "Owner": "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  "Admin Produksi": "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  "Kasir Produksi": "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  "Driver": "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400",
  "Kasir Outlet": "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400",
  "Admin SO": "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
  "Admin Omset": "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  "Checker Sasak": "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400"
};

export function TopHeader({ user }: TopHeaderProps) {
  const roleBadgeClass = user?.role ? roleColoringBadge[user.role] : "bg-mist-100 text-mist-600 dark:bg-mist-800 dark:text-mist-400";
  const avatarClass = user?.role ? roleColoringBadge[user.role] : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500";

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-mist-200 bg-white/80 px-4 shadow-sm backdrop-blur-md dark:border-mist-800 dark:bg-mist-950/80 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-mist-200 dark:lg:bg-mist-800" aria-hidden="true" />

          {/* Profile Dropdown Simulation / User Info */}
          <div className="flex items-center gap-x-4">
            <span className="sr-only">Open user menu</span>
            <span className="hidden lg:flex lg:flex-col lg:items-end lg:justify-center">
              <span className="text-sm font-semibold leading-5 text-mist-900 dark:text-mist-100" aria-hidden="true">
                {user?.name || "Unknown User"}
              </span>
              <span className="flex items-center gap-2 mt-0.5 text-xs font-medium leading-4 text-mist-500 dark:text-mist-400" aria-hidden="true">
                <span>{user?.email || "unknown@example.com"}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass}`}>
                  {user?.role || "No Role"}
                </span>
              </span>
            </span>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-current/20 ${avatarClass}`}>
              <User className="h-5 w-5" />
            </div>
            
            {/* Logout Button */}
            <form action={async () => {
              const { logoutAction } = await import("@/actions/auth");
              await logoutAction();
              window.location.href = "/";
            }}>
              <button type="submit" className="flex items-center gap-2 h-10 px-3 rounded-xl bg-mist-100 text-mist-600 hover:bg-red-100 hover:text-red-600 transition-colors dark:bg-mist-800 dark:text-mist-300 dark:hover:bg-red-500/20 dark:hover:text-red-400">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-semibold hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </header>
  );
}
