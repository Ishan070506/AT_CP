import { Suspense, lazy, useEffect, type LazyExoticComponent } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useAppStore } from "@/store/useAppStore";
import type { PageId } from "@/types";

const DashboardPage = lazy(async () => ({
  default: (await import("@/pages/DashboardPage")).DashboardPage,
}));
const ChatPage = lazy(async () => ({
  default: (await import("@/pages/ChatPage")).ChatPage,
}));
const JournalPage = lazy(async () => ({
  default: (await import("@/pages/JournalPage")).JournalPage,
}));
const InsightsPage = lazy(async () => ({
  default: (await import("@/pages/InsightsPage")).InsightsPage,
}));
const ForumPage = lazy(async () => ({
  default: (await import("@/pages/ForumPage")).ForumPage,
}));
const BookingPage = lazy(async () => ({
  default: (await import("@/pages/BookingPage")).BookingPage,
}));
const SessionPage = lazy(async () => ({
  default: (await import("@/pages/SessionPage")).SessionPage,
}));
const ResourcesPage = lazy(async () => ({
  default: (await import("@/pages/ResourcesPage")).ResourcesPage,
}));
const NotificationsPage = lazy(async () => ({
  default: (await import("@/pages/NotificationsPage")).NotificationsPage,
}));
const SettingsPage = lazy(async () => ({
  default: (await import("@/pages/SettingsPage")).SettingsPage,
}));

const pageComponents: Record<PageId, LazyExoticComponent<() => JSX.Element>> = {
  dashboard: DashboardPage,
  chat: ChatPage,
  journal: JournalPage,
  insights: InsightsPage,
  forum: ForumPage,
  booking: BookingPage,
  session: SessionPage,
  resources: ResourcesPage,
  notifications: NotificationsPage,
  settings: SettingsPage,
};

const PageFallback = () => (
  <div className="space-y-6">
    <div className="h-52 rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="h-80 rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
      <div className="h-80 rounded-[32px] bg-[length:200%_100%] bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 animate-shimmer dark:from-white/5 dark:via-white/10 dark:to-white/5" />
    </div>
  </div>
);

export default function App() {
  const {
    activePage,
    dismissInitialLoading,
    initialLoading,
    setActivePage,
    setLivePresence,
    theme,
  } = useAppStore((state) => ({
    activePage: state.activePage,
    dismissInitialLoading: state.dismissInitialLoading,
    initialLoading: state.initialLoading,
    setActivePage: state.setActivePage,
    setLivePresence: state.setLivePresence,
    theme: state.theme,
  }));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dismissInitialLoading();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [dismissInitialLoading]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLivePresence(190 + Math.floor(Math.random() * 40));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [setLivePresence]);

  if (initialLoading) {
    return <LoadingSkeleton />;
  }

  const CurrentPage = pageComponents[activePage];

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.65,
      }}
    >
      <AppShell activePage={activePage} onNavigate={setActivePage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
          >
            <Suspense fallback={<PageFallback />}>
              <CurrentPage />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </MotionConfig>
  );
}
