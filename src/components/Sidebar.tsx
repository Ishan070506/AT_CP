import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { navigationItems } from "@/data/pageMeta";
import { cn } from "@/lib/cn";
import type { PageId } from "@/types";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => (
  <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] lg:block">
    <div className="flex h-full flex-col rounded-[32px] border border-white/60 bg-white/60 p-6 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      <div className="rounded-[28px] border border-white/60 bg-gradient-to-br from-lavender/15 via-white/70 to-sky/10 p-5 shadow-soft dark:border-white/10 dark:from-lavender/10 dark:via-white/5 dark:to-sky/10">
        <div className="inline-flex rounded-2xl bg-gradient-to-br from-lavender via-indigo to-sky p-3 text-white shadow-glow">
          <HeartPulse className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          MindBridge
        </h1>
        <p className="mt-2 text-sm text-muted">
          Digital Psychological Intervention System
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                isActive
                  ? "bg-gradient-to-r from-lavender/20 via-indigo/15 to-sky/20 text-ink shadow-soft"
                  : "text-muted hover:bg-white/60 hover:text-ink dark:hover:bg-white/5",
              )}
            >
              <div
                className={cn(
                  "rounded-2xl border p-2.5",
                  isActive
                    ? "border-white/60 bg-white/70 dark:border-white/10 dark:bg-white/10"
                    : "border-transparent bg-transparent",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{item.label}</div>
                <div className="text-xs opacity-80">{item.title}</div>
              </div>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-white/60 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-glow dark:border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <span className="chip border-white/10 bg-white/10 text-white">ML engine online</span>
          <Sparkles className="h-4 w-4 text-sky" />
        </div>
        <p className="font-display text-lg font-semibold">Proactive care orchestration</p>
        <p className="mt-2 text-sm text-slate-300">
          Behavioral, academic, and emotional signals are fused into one live intervention layer.
        </p>
        <div className="mt-5 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>Prediction confidence</span>
              <span>94%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-sky to-teal" />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>Safety routing readiness</span>
              <span>99%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 w-[99%] rounded-full bg-gradient-to-r from-coral to-pink" />
            </div>
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200">
          <ShieldCheck className="h-4 w-4" />
          Privacy-preserving anonymous mode available
        </div>
      </div>
    </div>
  </aside>
);
