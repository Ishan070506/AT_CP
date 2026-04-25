import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { Brain, GraduationCap, ShieldAlert, Sparkles } from "lucide-react";
import {
  academicSignals,
  behaviorSignals,
  stressForecast,
} from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";

const predictionScore = 67;

export const InsightsPage = () => (
  <div className="space-y-6">
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.35fr]">
      <GlassCard>
        <SectionHeader
          eyebrow="USP Feature"
          title="Stress prediction"
          description="An interpretable view of future strain before students need to ask for help."
        />
        <div className="grid gap-6 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex items-center justify-center">
            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#ff8f85 0deg ${predictionScore * 3.6}deg, rgba(255,255,255,0.45) ${predictionScore * 3.6}deg 360deg)`,
              }}
            >
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-surface-elevated shadow-soft dark:bg-slate-950/90">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">Risk level</p>
                <p className="mt-2 text-4xl font-semibold text-ink">{predictionScore}%</p>
                <p className="mt-2 text-sm font-semibold text-coral">Medium</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-xl font-semibold text-ink">
                You may feel overwhelmed this week due to workload compression.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Academic load is rising faster than recovery behavior, especially before late-week deadlines. A small intervention now can keep the curve from escalating.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/60 bg-gradient-to-br from-lavender/20 to-indigo/15 p-4 shadow-soft dark:border-white/10">
                <p className="text-sm text-muted">Behavioral strain</p>
                <p className="mt-2 text-2xl font-semibold text-ink">High workload</p>
              </div>
              <div className="rounded-[22px] border border-white/60 bg-gradient-to-br from-sky/20 to-teal/15 p-4 shadow-soft dark:border-white/10">
                <p className="text-sm text-muted">Protective factor</p>
                <p className="mt-2 text-2xl font-semibold text-ink">Strong peer contact</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Forecast"
          title="Projected stress curve"
          description="Trend combines workload, recovery behavior, and emotional variability from ML microservices."
        />
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stressForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,168,0.16)" />
              <XAxis dataKey="week" stroke="#7c8aa5" />
              <YAxis stroke="#7c8aa5" />
              <Tooltip
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.85)",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ff8f85"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ff8f85" }}
              />
              <Line type="monotone" dataKey="workload" stroke="#7a6cf6" strokeWidth={2.5} />
              <Line type="monotone" dataKey="recovery" stroke="#54b8ff" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <GlassCard>
        <SectionHeader
          eyebrow="Academic Signals"
          title="Indicators contributing to strain"
          description="Academic stress markers surfaced from attendance, deadlines, and behavioral patterns."
        />
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={academicSignals} layout="vertical" margin={{ left: 18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,140,168,0.16)" />
              <XAxis type="number" stroke="#7c8aa5" />
              <YAxis dataKey="label" type="category" width={120} stroke="#7c8aa5" />
              <Tooltip
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.85)",
                }}
              />
              <Bar dataKey="value" radius={[0, 14, 14, 0]} fill="#7a6cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {academicSignals.map((signal) => (
            <div
              key={signal.label}
              className="rounded-[22px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <p className="text-sm text-muted">{signal.label}</p>
              <p className="mt-2 text-xl font-semibold text-ink">{signal.value}/100</p>
              <p className="mt-1 text-sm text-coral">{signal.trend}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Behavioral Patterns"
          title="How your routine is shaping resilience"
          description="Behavioral insights from sleep, social activity, and academic consistency."
        />
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={behaviorSignals}>
              <PolarGrid stroke="rgba(128,140,168,0.18)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#7c8aa5", fontSize: 12 }} />
              <Radar
                name="Signal"
                dataKey="value"
                stroke="#54b8ff"
                fill="#54b8ff"
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.85)",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.95fr]">
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="rounded-[22px] bg-lavender/10 p-3 text-lavender">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">AI-generated insight</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Strong social recovery is buffering you, but upcoming workload density may reduce that benefit unless downtime is protected.
            </p>
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="rounded-[22px] bg-coral/10 p-3 text-coral">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Risk routing</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Crisis channels remain inactive, but a rising trend would trigger Twilio, Firebase, and WhatsApp escalation safeguards automatically.
            </p>
          </div>
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="rounded-[22px] bg-sky/10 p-3 text-sky">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">Academic context</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Submission clustering is the largest predictor this cycle. Moving one assignment earlier should reduce next-week strain by 12%.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
);
