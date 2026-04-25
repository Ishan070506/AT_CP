import { AlertTriangle, BellRing, Mail, MessageSquare, Smartphone } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export const NotificationsPage = () => {
  const { notifications, markNotificationRead } = useAppStore((state) => ({
    notifications: state.notifications,
    markNotificationRead: state.markNotificationRead,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Push active", value: "FCM ready", icon: Smartphone },
          { label: "SMS fallback", value: "Twilio armed", icon: MessageSquare },
          { label: "WhatsApp alerts", value: "Standby", icon: BellRing },
          { label: "Email digests", value: "SendGrid synced", icon: Mail },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <GlassCard key={item.label}>
              <div className="rounded-2xl bg-lavender/10 p-2 text-lavender w-fit">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-4 text-sm text-muted">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <GlassCard>
          <SectionHeader
            eyebrow="Crisis Alerts"
            title="Safety escalation preview"
            description="Designed for timely, multi-channel outreach when signal thresholds indicate elevated risk."
          />
          <div className="rounded-[28px] border border-red-400/20 bg-gradient-to-br from-red-500/10 via-coral/10 to-pink/10 p-5 shadow-soft">
            <div className="chip border-red-400/20 bg-red-500/10 text-red-600 dark:text-red-300">
              <AlertTriangle className="h-4 w-4" />
              Crisis response available
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-ink">
              Escalation can fan out across SMS, push, WhatsApp, and email.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Trigger conditions can include high stress prediction, harmful language, repeated distress journaling, or counselor-defined follow-up rules.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Reminders"
            title="Recent notifications"
            description="Readable, channel-aware alerts with clear severity cues and lightweight actions."
          />
          <div className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={cn(
                  "w-full rounded-[24px] border p-5 text-left shadow-soft transition hover:-translate-y-0.5",
                  notification.read
                    ? "border-white/60 bg-white/70 dark:border-white/10 dark:bg-white/5"
                    : notification.severity === "Crisis"
                      ? "border-red-400/25 bg-red-500/10"
                      : "border-lavender/20 bg-lavender/10",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip">{notification.channel}</span>
                      <span className="chip">{notification.severity}</span>
                    </div>
                    <p className="mt-4 font-display text-xl font-semibold text-ink">
                      {notification.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{notification.body}</p>
                  </div>
                  <p className="text-sm text-muted">{notification.timestamp}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
