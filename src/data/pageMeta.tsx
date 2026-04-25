import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Brain,
  CalendarDays,
  House,
  MessageCircle,
  NotebookPen,
  Settings2,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import type { PageId } from "@/types";

interface PageMetaEntry {
  id: PageId;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export const pageMeta: Record<PageId, PageMetaEntry> = {
  dashboard: {
    id: "dashboard",
    label: "Dashboard",
    title: "Student Wellbeing Command Center",
    description: "A calm overview of mood, risk signals, and supportive next actions.",
    icon: House,
    accent: "from-lavender/20 to-sky/20",
  },
  chat: {
    id: "chat",
    label: "AI Chat",
    title: "Compassionate AI Support",
    description: "Private, responsive support with guided coping strategies and voice input.",
    icon: MessageCircle,
    accent: "from-sky/20 to-teal/20",
  },
  journal: {
    id: "journal",
    label: "Journal",
    title: "Reflection and Emotional Tracking",
    description: "Capture thoughts through text or voice and receive gentle AI summaries.",
    icon: NotebookPen,
    accent: "from-coral/20 to-pink/20",
  },
  insights: {
    id: "insights",
    label: "Insights",
    title: "Predictive Stress Intelligence",
    description: "See behavioral patterns, academic load, and early distress prediction signals.",
    icon: Brain,
    accent: "from-indigo/20 to-lavender/20",
  },
  forum: {
    id: "forum",
    label: "Forum",
    title: "Anonymous Peer Support",
    description: "Safer community conversations with empathy-first reactions and moderation.",
    icon: Users,
    accent: "from-teal/20 to-sky/20",
  },
  booking: {
    id: "booking",
    label: "Booking",
    title: "Counsellor Scheduling",
    description: "Book guided support sessions with available professionals and secure handoff flows.",
    icon: CalendarDays,
    accent: "from-lavender/20 to-coral/20",
  },
  session: {
    id: "session",
    label: "Session",
    title: "Therapy Session Space",
    description: "Video care room with live notes, timer, and in-session support tools.",
    icon: Video,
    accent: "from-sky/20 to-lavender/20",
  },
  resources: {
    id: "resources",
    label: "Resources",
    title: "Multilingual Resource Hub",
    description: "Video, article, and audio resources curated around emotional recovery.",
    icon: Sparkles,
    accent: "from-coral/20 to-teal/20",
  },
  notifications: {
    id: "notifications",
    label: "Alerts",
    title: "Notifications and Crisis Alerts",
    description: "Timely nudges, escalation readiness, and channel-aware support delivery.",
    icon: Bell,
    accent: "from-coral/20 to-red-400/15",
  },
  settings: {
    id: "settings",
    label: "Settings",
    title: "Privacy, Controls, and Trust",
    description: "Adjust anonymity, language, data controls, and security preferences.",
    icon: Settings2,
    accent: "from-slate-200/70 to-lavender/15 dark:from-white/5 dark:to-lavender/10",
  },
};

export const navigationItems = Object.values(pageMeta);
