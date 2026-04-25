import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";
import type { ReactionType } from "@/types";

const reactionMeta: Array<{ key: ReactionType; label: string }> = [
  { key: "support", label: "Support" },
  { key: "relate", label: "Relate" },
  { key: "hug", label: "Hug" },
];

export const ForumPage = () => {
  const { forumPosts, livePresence, addForumPost, reactToPost } = useAppStore((state) => ({
    forumPosts: state.forumPosts,
    livePresence: state.livePresence,
    addForumPost: state.addForumPost,
    reactToPost: state.reactToPost,
  }));

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("Need support");

  const submitPost = () => {
    if (!title.trim() || !body.trim()) return;
    addForumPost({ title: title.trim(), body: body.trim(), mood });
    setTitle("");
    setBody("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Peer Support"
            title="A safer anonymous forum"
            description="Reddit-style threads with protective moderation signals and empathy-first interactions."
          >
            <div className="chip">
              <Users className="h-4 w-4 text-teal" />
              {livePresence} students online now
            </div>
          </SectionHeader>

          <div className="grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="glass-input"
              placeholder="Post title"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              className="glass-input min-h-[120px] resize-none"
              placeholder="Share what is on your mind. MindBridge will keep your identity hidden and route unsafe content for moderation review."
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {["Need support", "Reflective", "Overwhelmed", "Small win"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setMood(option)}
                    className={cn(
                      "chip transition",
                      mood === option &&
                        "border-lavender/30 bg-lavender/10 text-lavender dark:bg-lavender/15",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button onClick={submitPost} className="btn-primary">
                <Sparkles className="h-4 w-4" />
                Post Anonymously
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {forumPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip">{post.author}</span>
                      <span className="chip">{post.mood}</span>
                      <span className="chip">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {post.toxicity}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{post.body}</p>
                  </div>
                  <p className="text-sm text-muted">{post.timestamp}</p>
                </div>
                <div className="soft-divider mt-5 pt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    {reactionMeta.map((reaction) => (
                      <button
                        key={reaction.key}
                        onClick={() => reactToPost(post.id, reaction.key)}
                        className="chip transition hover:-translate-y-0.5"
                      >
                        <Heart className="h-3.5 w-3.5 text-lavender" />
                        {reaction.label} {post.reactions[reaction.key]}
                      </button>
                    ))}
                    <span className="ml-auto text-sm text-muted">
                      {post.replies} thread replies
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Moderation"
            title="Toxicity filtering and trust"
            description="Perspective API powered screening keeps the space supportive without revealing student identity."
          />
          <div className="space-y-3">
            {[
              "Unsafe content is screened before public visibility.",
              "Crisis language can trigger private support recommendations instead of public exposure.",
              "Community reactions are designed around empathy, not popularity scoring.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/60 bg-white/70 p-4 text-sm text-muted shadow-soft dark:border-white/10 dark:bg-white/5"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Live Threads"
            title="What students are discussing"
            description="Real-time activity stream designed to feel active, safe, and warm."
          />
          <div className="space-y-3">
            {[
              "Managing panic before viva presentations",
              "How to recover after doom-scrolling late at night",
              "Small wins that made exam week feel survivable",
            ].map((topic, index) => (
              <div
                key={topic}
                className="rounded-[22px] border border-white/60 bg-gradient-to-br from-white/70 to-sky/10 p-4 shadow-soft dark:border-white/10 dark:from-white/5 dark:to-sky/10"
              >
                <p className="font-semibold text-ink">{topic}</p>
                <p className="mt-1 text-sm text-muted">{12 + index * 7} active readers</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
