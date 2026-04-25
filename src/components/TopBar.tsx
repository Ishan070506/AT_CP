import { MoonStar, Search, ShieldCheck, SunMedium } from "lucide-react";
import { pageMeta } from "@/data/pageMeta";
import { useAppStore } from "@/store/useAppStore";
import type { PageId } from "@/types";

interface TopBarProps {
  activePage: PageId;
}

export const TopBar = ({ activePage }: TopBarProps) => {
  const current = pageMeta[activePage];
  const { anonymousMode, theme, toggleTheme } = useAppStore((state) => ({
    anonymousMode: state.anonymousMode,
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

  const Icon = current.icon;
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="rounded-[32px] border border-white/60 bg-white/60 p-5 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`rounded-[24px] border border-white/60 bg-gradient-to-br ${current.accent} p-3 shadow-soft dark:border-white/10`}
          >
            <Icon className="h-6 w-6 text-ink" />
          </div>
          <div>
            <p className="text-sm text-muted">{today}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {current.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">{current.description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="glass-input flex min-w-[220px] items-center gap-3 px-4 py-0">
            <Search className="h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search support resources"
              className="w-full bg-transparent py-3 text-sm placeholder:text-muted/80"
            />
          </label>

          <div className="chip">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            {anonymousMode ? "Anonymous mode on" : "Named support mode"}
          </div>

          <button
            onClick={toggleTheme}
            className="btn-secondary min-w-[56px] px-4"
            aria-label="Toggle light and dark mode"
          >
            {theme === "light" ? (
              <MoonStar className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
