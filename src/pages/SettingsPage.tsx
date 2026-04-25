import { useState } from "react";
import { Database, Languages, LockKeyhole, MoonStar, ShieldCheck, UserX } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionHeader } from "@/components/SectionHeader";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleRow = ({ label, description, enabled, onToggle }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-4 rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/5">
    <div>
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={cn(
        "relative h-8 w-14 rounded-full transition",
        enabled ? "bg-gradient-to-r from-lavender to-sky" : "bg-slate-300/70 dark:bg-white/15",
      )}
      aria-label={label}
    >
      <span
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full bg-white shadow-soft transition",
          enabled ? "left-7" : "left-1",
        )}
      />
    </button>
  </div>
);

export const SettingsPage = () => {
  const {
    anonymousMode,
    selectedLanguage,
    theme,
    toggleAnonymousMode,
    toggleTheme,
    setSelectedLanguage,
  } = useAppStore((state) => ({
    anonymousMode: state.anonymousMode,
    selectedLanguage: state.selectedLanguage,
    theme: state.theme,
    toggleAnonymousMode: state.toggleAnonymousMode,
    toggleTheme: state.toggleTheme,
    setSelectedLanguage: state.setSelectedLanguage,
  }));

  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crisisRouting, setCrisisRouting] = useState(true);
  const [deviceSecurity, setDeviceSecurity] = useState(true);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Privacy"
            title="Data control and anonymity"
            description="Build trust with clear settings for identity, escalation, data retention, and model use."
          />
          <div className="space-y-3">
            <ToggleRow
              label="Anonymous mode"
              description="Hide identifiable student details across chat, forum, and journaling flows."
              enabled={anonymousMode}
              onToggle={toggleAnonymousMode}
            />
            <ToggleRow
              label="Crisis routing"
              description="Allow multi-channel escalation using Twilio, WhatsApp, and push alerts when risk is high."
              enabled={crisisRouting}
              onToggle={() => setCrisisRouting((value) => !value)}
            />
            <ToggleRow
              label="Behavior analytics"
              description="Use Mixpanel or PostHog event tracking to improve support flows without storing sensitive text."
              enabled={analyticsEnabled}
              onToggle={() => setAnalyticsEnabled((value) => !value)}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Preferences"
            title="Language and appearance"
            description="Accessible controls for language selection and theme switching."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={toggleTheme}
              className="rounded-[24px] border border-white/60 bg-white/70 p-5 text-left shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
            >
              <div className="rounded-2xl bg-lavender/10 p-2 text-lavender w-fit">
                <MoonStar className="h-4 w-4" />
              </div>
              <p className="mt-4 font-semibold text-ink">Theme mode</p>
              <p className="mt-1 text-sm text-muted">
                Currently {theme === "light" ? "Light" : "Dark"}
              </p>
            </button>
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="rounded-2xl bg-sky/10 p-2 text-sky w-fit">
                <Languages className="h-4 w-4" />
              </div>
              <p className="mt-4 font-semibold text-ink">Language</p>
              <div className="mt-3 flex gap-2">
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
                    {language}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <SectionHeader
            eyebrow="Security"
            title="Identity and session protection"
            description="UI space for Auth0 or Keycloak auth, JWT session handling, and device-level safety preferences."
          />
          <div className="space-y-3">
            <ToggleRow
              label="Device security"
              description="Require biometric or device unlock confirmation before opening private records."
              enabled={deviceSecurity}
              onToggle={() => setDeviceSecurity((value) => !value)}
            />
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-400/10 p-2 text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Auth providers</p>
                  <p className="mt-1 text-sm text-muted">
                    Keycloak and Auth0 login options can be surfaced here with JWT session summaries and last active device metadata.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-coral/10 p-2 text-coral">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-ink">Security preferences</p>
                  <p className="mt-1 text-sm text-muted">
                    Session timeout, password reset, device revocation, and export history controls live in this area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Data"
            title="Retention and export controls"
            description="Clear language around what is stored, where it flows, and how students remain in control."
          />
          <div className="space-y-3">
            {[
              {
                icon: Database,
                title: "Data storage",
                body: "PostgreSQL, MongoDB, and Redis can support structured profiles, journals, and real-time intervention queues.",
              },
              {
                icon: UserX,
                title: "Delete identity link",
                body: "Remove direct identity mapping while preserving aggregate analytics for platform safety research.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-lavender/10 p-2 text-lavender">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
