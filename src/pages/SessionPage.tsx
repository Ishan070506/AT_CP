import { useEffect, useState } from "react";
import { MessageSquare, Mic, MonitorPlay, Timer, Video } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppStore } from "@/store/useAppStore";

const pad = (value: number) => value.toString().padStart(2, "0");

export const SessionPage = () => {
  const bookedSlot = useAppStore((state) => state.bookedSlot);
  const [secondsElapsed, setSecondsElapsed] = useState(14 * 60 + 26);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/50 px-6 py-5 dark:border-white/10">
          <SectionHeader
            eyebrow="Therapy Session"
            title="Live care room"
            description="Secure video session with notes, private chat, and a calm interface."
          >
            <div className="chip">
              <Timer className="h-4 w-4 text-coral" />
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </div>
          </SectionHeader>
        </div>
        <div className="grid gap-6 p-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-[30px] border border-white/60 bg-slate-950 shadow-glow dark:border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,123,255,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(84,184,255,0.22),transparent_28%),linear-gradient(160deg,rgba(15,23,42,0.98),rgba(23,37,84,0.92))]" />
              <div className="relative flex h-full flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="chip border-white/10 bg-white/10 text-white">
                    <Video className="h-4 w-4 text-sky" />
                    Whereby / Jitsi secure room
                  </div>
                  <div className="chip border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
                    Connection stable
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-sm text-slate-300">Counsellor</p>
                    <p className="mt-2 font-display text-3xl font-semibold">Dr. Maya Rao</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Trauma-informed, student-focused support
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <p className="text-sm text-slate-300">You</p>
                    <p className="mt-2 font-display text-2xl font-semibold">Aarav</p>
                    <p className="mt-2 text-sm text-slate-300">Anonymous identity preserved</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Video", value: "720p", icon: MonitorPlay },
                { label: "Mic clarity", value: "Excellent", icon: Mic },
                { label: "Private chat", value: "Enabled", icon: MessageSquare },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="rounded-2xl bg-lavender/10 p-2 text-lavender w-fit">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-3 text-sm text-muted">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-ink">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-xl font-semibold text-ink">Session notes</p>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <div className="rounded-[20px] bg-lavender/10 p-4">
                  Primary topic: workload anxiety and sleep disruption before assessment week.
                </div>
                <div className="rounded-[20px] bg-sky/10 p-4">
                  Intervention focus: practical pacing, emotional validation, and recovery planning.
                </div>
                <div className="rounded-[20px] bg-coral/10 p-4">
                  Suggested follow-up: 10-minute wind-down ritual and one peer connection checkpoint.
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-xl font-semibold text-ink">Secure room info</p>
              <p className="mt-3 text-sm text-muted">
                Current booking: {bookedSlot ?? "Awaiting session booking"}
              </p>
              <div className="mt-4 grid gap-3">
                <button className="btn-primary w-full">Share breathing exercise</button>
                <button className="btn-secondary w-full">Open private session chat</button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
