import { useDeferredValue, useMemo, useState } from "react";
import { Globe2, PlayCircle, Search, Volume2 } from "lucide-react";
import { resourceLibrary } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

const categories = ["All", "Anxiety", "Depression", "Exams", "Sleep", "Mindfulness"] as const;

export const ResourcesPage = () => {
  const { selectedLanguage, setSelectedLanguage } = useAppStore((state) => ({
    selectedLanguage: state.selectedLanguage,
    setSelectedLanguage: state.setSelectedLanguage,
  }));

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All");
  const deferredSearch = useDeferredValue(search);

  const filteredResources = useMemo(
    () =>
      resourceLibrary.filter((resource) => {
        const matchesCategory =
          selectedCategory === "All" || resource.category === selectedCategory;
        const matchesLanguage =
          selectedLanguage === "English"
            ? resource.language !== "Hindi"
            : resource.language !== "English";
        const matchesSearch = `${resource.title} ${resource.description}`
          .toLowerCase()
          .includes(deferredSearch.toLowerCase());

        return matchesCategory && matchesLanguage && matchesSearch;
      }),
    [deferredSearch, selectedCategory, selectedLanguage],
  );

  return (
    <div className="space-y-6">
      <GlassCard>
        <SectionHeader
          eyebrow="Resource Hub"
          title="Curated support library"
          description="A multilingual space for videos, articles, and audio guides around anxiety, depression, exams, and recovery."
        >
          <div className="flex items-center gap-2">
            {(["English", "Hindi"] as const).map((language) => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
                className={cn(
                  "chip transition",
                  selectedLanguage === language &&
                    "border-lavender/30 bg-lavender/10 text-lavender dark:bg-lavender/15",
                )}
              >
                <Globe2 className="h-3.5 w-3.5" />
                {language}
              </button>
            ))}
          </div>
        </SectionHeader>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-white/60 bg-slate-950 p-6 text-white shadow-glow dark:border-white/10">
            <div className="flex h-full flex-col justify-between gap-8 rounded-[24px] bg-[radial-gradient(circle_at_top_left,rgba(84,184,255,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,143,133,0.24),transparent_24%),linear-gradient(155deg,rgba(15,23,42,1),rgba(30,41,59,0.96))] p-6">
              <div className="chip border-white/10 bg-white/10 text-white">
                Featured recovery video
              </div>
              <div>
                <h3 className="font-display text-3xl font-semibold tracking-tight">
                  Study stress recovery toolkit
                </h3>
                <p className="mt-3 max-w-xl text-sm text-slate-300">
                  YouTube API and Cloudinary-ready content cards with calming previews, language context, and lightweight playback handoff.
                </p>
              </div>
              <button className="btn-primary w-fit">
                <PlayCircle className="h-4 w-4" />
                Watch now
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="glass-input flex items-center gap-3 px-4 py-0">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent py-3 text-sm"
                placeholder="Search videos, articles, audio guides"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "chip transition",
                    selectedCategory === category &&
                      "border-lavender/30 bg-lavender/10 text-lavender dark:bg-lavender/15",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="rounded-[24px] border border-white/60 bg-gradient-to-br from-sky/15 via-white/70 to-teal/15 p-5 shadow-soft dark:border-white/10 dark:from-sky/10 dark:via-white/5 dark:to-teal/10">
              <p className="font-display text-xl font-semibold text-ink">Audio-first support</p>
              <p className="mt-2 text-sm text-muted">
                Google TTS can narrate coping guides when reading feels cognitively heavy.
              </p>
              <button className="btn-secondary mt-4">
                <Volume2 className="h-4 w-4" />
                Play sample guide
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResources.map((resource) => (
          <GlassCard key={resource.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="chip w-fit">{resource.category}</p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
                  {resource.title}
                </h3>
              </div>
              <div className="rounded-2xl bg-lavender/10 p-2 text-lavender">
                {resource.format === "Audio Guide" ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{resource.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip">{resource.format}</span>
              <span className="chip">{resource.duration}</span>
              <span className="chip">{resource.language}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
