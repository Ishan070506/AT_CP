import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AudioLines, Brain, NotebookPen, Sparkles, Tags } from "lucide-react";
import { emotionTags } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export const JournalPage = () => {
  const { journalEntries, addJournalEntry } = useAppStore((state) => ({
    journalEntries: state.journalEntries,
    addJournalEntry: state.addJournalEntry,
  }));

  const [title, setTitle] = useState("Evening reflection");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["overwhelmed"]);

  const latestEntry = journalEntries[0];
  const historyData = useMemo(
    () =>
      journalEntries
        .slice(0, 5)
        .map((entry, index) => ({
          name: `Entry ${journalEntries.length - index}`,
          sentiment: entry.sentiment,
        }))
        .reverse(),
    [journalEntries],
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag].slice(-3),
    );
  };

  const handleSave = () => {
    if (!body.trim()) return;

    addJournalEntry({
      title: title.trim() || "Untitled reflection",
      body: body.trim(),
      tags: selectedTags,
    });
    setBody("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.9fr]">
      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Reflection"
            title="Journal with words or voice"
            description="Capture what happened, how it felt, and what your body or mind needed in that moment."
          />
          <div className="grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="glass-input"
              placeholder="Journal title"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              className="glass-input min-h-[220px] resize-none"
              placeholder="Write freely. MindBridge will summarize the reflection, estimate sentiment, and help you spot recurring emotional patterns."
            />
            <div className="flex flex-wrap gap-2">
              {emotionTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "chip transition",
                    selectedTags.includes(tag) &&
                      "border-lavender/30 bg-lavender/10 text-lavender dark:bg-lavender/15",
                  )}
                >
                  <Tags className="h-3.5 w-3.5" />
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary">
                <AudioLines className="h-4 w-4" />
                Voice Journal
              </button>
              <button onClick={handleSave} className="btn-primary">
                <NotebookPen className="h-4 w-4" />
                Save Reflection
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="History"
            title="Emotional timeline"
            description="A structured archive of reflection moments, sentiment shifts, and AI summaries."
          />
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-semibold text-ink">{entry.title}</p>
                    <p className="mt-1 text-sm text-muted">{entry.timestamp}</p>
                  </div>
                  <div className="chip">
                    Sentiment {entry.sentiment}%
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{entry.body}</p>
                <div className="mt-4 rounded-[20px] bg-gradient-to-r from-lavender/10 via-sky/10 to-teal/10 p-4 text-sm text-ink">
                  <span className="font-semibold">AI summary:</span> {entry.summary}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Sentiment"
            title="Latest emotional read"
            description="HuggingFace sentiment scoring and AI summarization for faster self-understanding."
          />
          <div className="rounded-[28px] border border-white/60 bg-gradient-to-br from-coral/20 via-white/70 to-lavender/20 p-5 shadow-soft dark:border-white/10 dark:from-coral/10 dark:via-white/5 dark:to-lavender/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted">Current tone estimate</p>
                <p className="mt-2 text-4xl font-semibold text-ink">
                  {latestEntry?.sentiment ?? 64}%
                </p>
              </div>
              <div className="rounded-full bg-white/80 px-5 py-4 text-center shadow-soft dark:bg-white/10">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">State</p>
                <p className="mt-2 text-lg font-semibold text-ink">
                  {latestEntry && latestEntry.sentiment > 65
                    ? "Hopeful"
                    : latestEntry && latestEntry.sentiment > 50
                      ? "Mixed"
                      : "Stressed"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {latestEntry?.summary ??
                "MindBridge will generate a quick summary once you save a reflection."}
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Trend"
            title="Reflection sentiment over time"
            description="Helpful for spotting buildup before burnout or understanding what restores you."
          />
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis dataKey="name" stroke="#7c8aa5" />
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
                  dataKey="sentiment"
                  stroke="#7a6cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#7a6cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="AI Summary"
            title="What MindBridge is noticing"
            description="A faster overview of emotional themes across recent entries."
          />
          <div className="space-y-3">
            {[
              "Stress tends to rise after late-night academic work.",
              "Social support and movement correlate with emotional recovery.",
              "Voice journaling may lower friction on harder days when typing feels heavy.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/60 bg-white/70 p-4 text-sm text-muted shadow-soft dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-lavender/10 p-2 text-lavender">
                    <Brain className="h-4 w-4" />
                  </div>
                  <p>{item}</p>
                </div>
              </div>
            ))}
            <div className="rounded-[22px] border border-dashed border-lavender/40 bg-lavender/5 p-4 text-sm text-muted">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-coral/10 p-2 text-coral">
                  <Sparkles className="h-4 w-4" />
                </div>
                Consider pairing late deadlines with one small wind-down ritual to protect sleep recovery.
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
