import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Brain,
  CalendarDays,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { aiSuggestions, apiIntegrations, greetingName, moodTrendData } from "@/data/mockData";
import { useAppStore } from "@/store/useAppStore";
import { GlassCard } from "@/components/GlassCard";
import { KpiCard } from "@/components/KpiCard";
import { MoodSlider } from "@/components/MoodSlider";
import { SectionHeader } from "@/components/SectionHeader";

const chartStyle = {
  contentStyle: {
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: "0 20px 50px -22px rgba(49,63,153,0.35)",
  },
  labelStyle: { color: "#5c6784" },
};

export const DashboardPage = () => {
  const { moodScore, setMoodScore, setActivePage } = useAppStore((state) => ({
    moodScore: state.moodScore,
    setMoodScore: state.setMoodScore,
    setActivePage: state.setActivePage,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        <GlassCard className="overflow-hidden p-0">
          <div className="relative px-7 py-8 sm:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/20 via-white/10 to-sky/20 dark:from-lavender/15 dark:via-white/0 dark:to-sky/10" />
            <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.85fr]">
              <div>
                <div className="chip">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Proactive support is active
                </div>
                <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                  Welcome back, {greetingName}. Your emotional safety net is already working.
                </h1>
                <p className="mt-4 max-w-2xl text-base text-muted">
                  MindBridge is detecting a mild exam-related strain pattern today, but your recovery signals remain promising. We can lower pressure before it spikes.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setActivePage("chat")} className="btn-primary">
                    <MessageCircle className="h-4 w-4" />
                    Start Chat
                  </button>
                  <button onClick={() => setActivePage("journal")} className="btn-secondary">
                    <Sparkles className="h-4 w-4" />
                    Log Journal
                  </button>
                  <button onClick={() => setActivePage("booking")} className="btn-secondary">
                    <CalendarDays className="h-4 w-4" />
                    Book Session
                  </button>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {apiIntegrations.slice(0, 7).map((integration) => (
                    <span key={integration} className="chip">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm text-muted">Today&apos;s Mental State</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-4xl font-semibold text-ink">{moodScore}%</p>
                      <p className="mt-2 text-sm text-muted">
                        Emotional steadiness with some academic tension
                      </p>
                    </div>
                    <div className="rounded-3xl bg-gradient-to-br from-lavender/20 to-sky/20 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">Risk</p>
                      <p className="text-xl font-semibold text-ink">Medium-Low</p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm text-muted">AI recommendation</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      Front-load one difficult task and protect a recovery walk tonight.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-coral/20 to-pink/20 p-5 shadow-soft backdrop-blur-xl dark:border-white/10">
                    <p className="text-sm text-muted">Safety note</p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      SOS escalation is armed, but no crisis behavior is detected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <MoodSlider value={moodScore} onChange={setMoodScore} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={HeartPulse}
          label="Distress confidence"
          value="28%"
          trend="-9% today"
          accent="bg-gradient-to-br from-coral/25 to-pink/25"
        />
        <KpiCard
          icon={Brain}
          label="Cognitive load"
          value="74"
          trend="+6 focus pts"
          accent="bg-gradient-to-br from-lavender/20 to-indigo/20"
        />
        <KpiCard
          icon={Waves}
          label="Recovery score"
          value="81"
          trend="+12 stable"
          accent="bg-gradient-to-br from-sky/20 to-teal/20"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Safety readiness"
          value="99%"
          trend="all systems"
          accent="bg-gradient-to-br from-emerald-200/70 to-teal/20"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <GlassCard>
          <SectionHeader
            eyebrow="Mood Trends"
            title="Emotional rhythm across the week"
            description="Mood, stress, and focus signals from journals, behavior patterns, and academic context."
          />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodTrendData}>
                <defs>
                  <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b7bff" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8b7bff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#54b8ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#54b8ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,168,0.16)" />
                <XAxis dataKey="day" stroke="#7c8aa5" />
                <YAxis stroke="#7c8aa5" />
                <Tooltip {...chartStyle} />
                <Area
                  type="monotone"
                  dataKey="mood"
                  stroke="#7a6cf6"
                  strokeWidth={3}
                  fill="url(#moodFill)"
                />
                <Area
                  type="monotone"
                  dataKey="focus"
                  stroke="#54b8ff"
                  strokeWidth={2.5}
                  fill="url(#focusFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="AI Suggestions"
            title="What could help right now"
            description="Supportive, context-aware nudges generated from your current signal pattern."
          />
          <div className="space-y-4">
            {aiSuggestions.map((item) => (
              <div
                key={item.id}
                className={`rounded-[24px] border border-white/60 bg-gradient-to-br ${item.accent} p-5 shadow-soft dark:border-white/10`}
              >
                <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <GlassCard>
          <SectionHeader
            eyebrow="Quick Actions"
            title="Keep support one tap away"
            description="Fast pathways for care, reflection, and escalation."
          />
          <div className="grid gap-4">
            {[
              {
                title: "Start guided chat",
                body: "Open GPT-4o support with anonymous mode, live coping prompts, and voice transcription.",
                action: "chat" as const,
              },
              {
                title: "Reflect with voice journal",
                body: "Capture emotions, tag themes, and receive HuggingFace sentiment insights.",
                action: "journal" as const,
              },
              {
                title: "Book a human session",
                body: "Connect to Cal.com style scheduling and preview your video care room.",
                action: "booking" as const,
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => setActivePage(item.action)}
                className="rounded-[24px] border border-white/60 bg-white/70 p-5 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/5"
              >
                <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Stress Signals"
            title="Academic pressure vs. recovery capacity"
            description="Signals balancing toward manageable strain, with one likely spike before the next deadline cluster."
          />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,168,0.16)" />
                <XAxis dataKey="day" stroke="#7c8aa5" />
                <YAxis stroke="#7c8aa5" />
                <Tooltip {...chartStyle} />
                <Bar dataKey="stress" radius={[12, 12, 4, 4]} fill="#ff8f85" />
                <Bar dataKey="focus" radius={[12, 12, 4, 4]} fill="#54b8ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
