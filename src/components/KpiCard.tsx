import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend: string;
  accent: string;
  className?: string;
}

export const KpiCard = ({
  icon: Icon,
  label,
  value,
  trend,
  accent,
  className,
}: KpiCardProps) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={cn(
      "rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5",
      className,
    )}
  >
    <div
      className={cn(
        "mb-4 inline-flex rounded-2xl border border-white/50 p-3 shadow-glow",
        accent,
      )}
    >
      <Icon className="h-5 w-5 text-slate-900 dark:text-white" />
    </div>
    <p className="text-sm text-muted">{label}</p>
    <div className="mt-2 flex items-end justify-between gap-3">
      <p className="text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
        {trend}
      </span>
    </div>
  </motion.div>
);
