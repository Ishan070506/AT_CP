export type ThemeMode = "light" | "dark";

export type PageId =
  | "dashboard"
  | "chat"
  | "journal"
  | "insights"
  | "forum"
  | "booking"
  | "session"
  | "resources"
  | "notifications"
  | "settings";

export type ReactionType = "support" | "relate" | "hug";

export interface MoodPoint {
  day: string;
  mood: number;
  stress: number;
  focus: number;
}

export interface StressForecastPoint {
  week: string;
  score: number;
  workload: number;
  recovery: number;
}

export interface AcademicSignal {
  label: string;
  value: number;
  trend: string;
}

export interface BehaviorSignal {
  subject: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

export interface SuggestionCard {
  id: string;
  title: string;
  body: string;
  accent: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  sentiment: number;
  summary: string;
  timestamp: string;
  tags: string[];
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  body: string;
  mood: string;
  toxicity: "Safe" | "Reviewing";
  replies: number;
  reactions: Record<ReactionType, number>;
  timestamp: string;
}

export interface BookingSlot {
  time: string;
  available: boolean;
}

export interface CounselorProfile {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  rating: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: "Anxiety" | "Depression" | "Exams" | "Sleep" | "Mindfulness";
  format: "Video" | "Article" | "Audio Guide";
  duration: string;
  language: "English" | "Hindi" | "Bilingual";
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: "Push" | "SMS" | "WhatsApp" | "Email";
  severity: "Info" | "Priority" | "Crisis";
  timestamp: string;
  read: boolean;
}
