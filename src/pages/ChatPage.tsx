import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  Bot,
  Languages,
  Mic,
  SendHorizontal,
  Shield,
  Sparkles,
  Volume2,
} from "lucide-react";
import { copingPrompts, generateAiReply } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TypingBubble } from "@/components/TypingBubble";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

export const ChatPage = () => {
  const {
    anonymousMode,
    chatMessages,
    isAiTyping,
    selectedLanguage,
    sendChatMessage,
    appendAssistantMessage,
  } = useAppStore((state) => ({
    anonymousMode: state.anonymousMode,
    chatMessages: state.chatMessages,
    isAiTyping: state.isAiTyping,
    selectedLanguage: state.selectedLanguage,
    sendChatMessage: state.sendChatMessage,
    appendAssistantMessage: state.appendAssistantMessage,
  }));

  const [draft, setDraft] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const supportLabel = useMemo(
    () => (anonymousMode ? "Anonymous protection active" : "Named support mode"),
    [anonymousMode],
  );

  const handleSend = () => {
    const message = draft.trim();
    if (!message) return;

    sendChatMessage(message);
    setDraft("");
    timeoutRef.current = window.setTimeout(() => {
      appendAssistantMessage(generateAiReply(message));
    }, 1400);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
      <GlassCard className="flex min-h-[780px] flex-col">
        <SectionHeader
          eyebrow="AI Support"
          title="A calm conversation space"
          description="ChatGPT-style support flow with voice input, safety routing, and immediate coping guidance."
        >
          <div className="chip">
            <Shield className="h-4 w-4 text-emerald-500" />
            {supportLabel}
          </div>
        </SectionHeader>

        <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto pr-1">
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[88%] rounded-[26px] px-4 py-3 shadow-soft",
                  message.role === "user"
                    ? "rounded-br-md bg-gradient-to-br from-lavender via-indigo to-sky text-white"
                    : "rounded-bl-md border border-white/60 bg-white/75 text-ink backdrop-blur-xl dark:border-white/10 dark:bg-white/10",
                )}
              >
                <div className="flex items-center gap-2">
                  {message.role === "assistant" ? (
                    <div className="rounded-full bg-lavender/15 p-1.5 text-lavender dark:bg-lavender/20">
                      <Bot className="h-4 w-4" />
                    </div>
                  ) : null}
                  <p className="text-sm leading-6">{message.text}</p>
                </div>
                <p
                  className={cn(
                    "mt-3 text-[11px]",
                    message.role === "user" ? "text-white/80" : "text-muted",
                  )}
                >
                  {message.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          <AnimatePresence>{isAiTyping ? <TypingBubble /> : null}</AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="soft-divider mt-5 pt-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {copingPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setDraft(prompt)}
                className="chip transition hover:-translate-y-0.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-lavender" />
                {prompt}
              </button>
            ))}
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={3}
                placeholder="Share what feels heavy today. MindBridge will respond with emotional support, coping steps, and safe escalation when needed."
                className="min-h-[88px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-ink placeholder:text-muted/80"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled((current) => !current)}
                  className={cn(
                    "btn-secondary px-4",
                    voiceEnabled && "border-lavender/30 bg-lavender/10",
                  )}
                >
                  <Mic className="h-4 w-4" />
                  Voice
                </button>
                <button onClick={handleSend} className="btn-primary px-4">
                  <SendHorizontal className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Voice Mode"
            title="Whisper transcription ready"
            description="Capture difficult emotions by speaking naturally instead of typing."
          />
          <div className="rounded-[28px] border border-white/60 bg-gradient-to-br from-sky/20 via-white/70 to-teal/20 p-5 shadow-soft dark:border-white/10 dark:from-sky/10 dark:via-white/5 dark:to-teal/10">
            <div className="mb-4 flex items-center justify-between">
              <div className="chip">
                <AudioLines className="h-4 w-4 text-sky" />
                {voiceEnabled ? "Recording warm-up active" : "Tap voice to begin"}
              </div>
              <Volume2 className="h-5 w-5 text-lavender" />
            </div>
            <div className="flex h-28 items-end justify-center gap-2">
              {[32, 56, 40, 74, 62, 44, 68, 50, 36].map((height, index) => (
                <motion.div
                  key={`${height}-${index}`}
                  animate={{ height: voiceEnabled ? [height - 14, height, height - 6] : height - 18 }}
                  transition={{
                    repeat: voiceEnabled ? Number.POSITIVE_INFINITY : 0,
                    duration: 1.2,
                    delay: index * 0.08,
                  }}
                  className="w-3 rounded-full bg-gradient-to-t from-lavender via-indigo to-sky"
                  style={{ height }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">
              Whisper API transcription will appear here in real time, with optional translation into {selectedLanguage}.
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Support Layer"
            title="Safety-aware AI stack"
            description="Designed for emotional warmth, privacy, and intelligent escalation."
          />
          <div className="space-y-3">
            {[
              "OpenAI GPT-4o powers compassionate dialogue and coping strategies.",
              "Perspective API screens for harmful or unsafe inputs in peer-facing spaces.",
              "Twilio and WhatsApp remain on standby for crisis alerts when thresholds are crossed.",
              "Google TTS can read coping guidance aloud for lower-cognitive-load support.",
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
            eyebrow="Live Status"
            title="Real-time support telemetry"
            description="Micro-interactions and presence states that make the experience feel responsive and safe."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-muted">Typing latency</p>
              <p className="mt-2 text-2xl font-semibold text-ink">1.4s</p>
            </div>
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
              <p className="text-sm text-muted">Preferred language</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-ink">
                <Languages className="h-5 w-5 text-lavender" />
                {selectedLanguage}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
