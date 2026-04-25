import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface GlassCardProps extends PropsWithChildren {
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const GlassCard = ({
  children,
  className,
  hover = true,
  delay = 0,
}: GlassCardProps) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
    whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
    className={cn(
      "relative overflow-hidden rounded-[28px] border border-white/60 bg-white/65 p-6 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/5",
      className,
    )}
  >
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-white/0 to-white/5 dark:from-white/5 dark:to-white/0" />
    <div className="relative z-10">{children}</div>
  </motion.section>
);
