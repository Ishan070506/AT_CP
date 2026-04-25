import { startTransition, type PropsWithChildren } from "react";
import { AlertTriangle, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { navigationItems } from "@/data/pageMeta";
import { cn } from "@/lib/cn";
import type { PageId } from "@/types";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

interface AppShellProps extends PropsWithChildren {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const AppShell = ({
  activePage,
  onNavigate,
  children,
}: AppShellProps) => {
  const navigate = (page: PageId) => {
    startTransition(() => onNavigate(page));
  };

  return (
    <div className="app-shell relative overflow-hidden px-4 py-6 sm:px-6">
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -18, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 18, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-lavender/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -8, 0], y: [0, 18, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "easeInOut" }}
        className="pointer-events-none absolute right-0 top-16 h-96 w-96 rounded-full bg-sky/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 12, 0], y: [0, 12, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 22, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar activePage={activePage} onNavigate={navigate} />

        <div className="min-w-0">
          <TopBar activePage={activePage} />
          <main className="pb-28 pt-6 lg:pb-8">{children}</main>
        </div>
      </div>

      <div className="fixed bottom-24 right-4 z-20 flex flex-col items-end gap-3 sm:right-6 lg:bottom-8">
        <button
          onClick={() => navigate("chat")}
          className="btn-primary rounded-full px-5 py-3"
        >
          <Headphones className="h-4 w-4" />
          Quick Help
        </button>
        <button
          onClick={() => navigate("notifications")}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-coral to-pink px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_55px_-18px_rgba(239,68,68,0.65)] transition hover:scale-[1.02]"
        >
          <AlertTriangle className="h-4 w-4" />
          SOS
        </button>
      </div>

      <nav className="fixed inset-x-4 bottom-4 z-20 rounded-[28px] border border-white/60 bg-white/70 p-2 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 lg:hidden">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "flex min-w-[84px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-semibold transition",
                  isActive
                    ? "bg-gradient-to-br from-lavender/20 via-indigo/15 to-sky/20 text-ink"
                    : "text-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
