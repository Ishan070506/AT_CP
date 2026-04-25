import type {
  AcademicSignal,
  BehaviorSignal,
  BookingSlot,
  ChatMessage,
  CounselorProfile,
  ForumPost,
  JournalEntry,
  MoodPoint,
  NotificationItem,
  ResourceItem,
  StressForecastPoint,
  SuggestionCard,
} from "@/types";

export const greetingName = "Aarav";

export const moodTrendData: MoodPoint[] = [
  { day: "Mon", mood: 68, stress: 46, focus: 78 },
  { day: "Tue", mood: 72, stress: 44, focus: 81 },
  { day: "Wed", mood: 63, stress: 62, focus: 65 },
  { day: "Thu", mood: 74, stress: 38, focus: 84 },
  { day: "Fri", mood: 58, stress: 71, focus: 59 },
  { day: "Sat", mood: 76, stress: 34, focus: 79 },
  { day: "Sun", mood: 82, stress: 28, focus: 88 },
];

export const aiSuggestions: SuggestionCard[] = [
  {
    id: "breathe",
    title: "Two-minute reset",
    body: "Try box breathing before your next study block to steady your focus and reduce physical tension.",
    accent: "from-lavender/30 via-indigo/25 to-sky/20",
  },
  {
    id: "schedule",
    title: "Gentle workload rebalance",
    body: "Your pattern shows heavier stress before deadlines. Shift one deep-work task earlier this evening.",
    accent: "from-sky/25 via-teal/20 to-lavender/25",
  },
  {
    id: "reach-out",
    title: "Warm support prompt",
    body: "You tend to recover faster after peer connection. Consider messaging a trusted friend or mentor tonight.",
    accent: "from-coral/25 via-pink/25 to-lavender/20",
  },
];

export const stressForecast: StressForecastPoint[] = [
  { week: "Week 1", score: 32, workload: 45, recovery: 76 },
  { week: "Week 2", score: 41, workload: 54, recovery: 69 },
  { week: "Week 3", score: 56, workload: 70, recovery: 58 },
  { week: "Week 4", score: 67, workload: 78, recovery: 52 },
  { week: "Week 5", score: 49, workload: 60, recovery: 73 },
];

export const academicSignals: AcademicSignal[] = [
  { label: "Assignment load", value: 78, trend: "+18% this week" },
  { label: "Attendance strain", value: 52, trend: "-4% from baseline" },
  { label: "Sleep disruption", value: 64, trend: "+11% late nights" },
  { label: "Focus volatility", value: 58, trend: "+9% lab sessions" },
];

export const behaviorSignals: BehaviorSignal[] = [
  { subject: "Sleep", value: 58 },
  { subject: "Social energy", value: 72 },
  { subject: "Academic load", value: 84 },
  { subject: "Mood stability", value: 61 },
  { subject: "Help-seeking", value: 49 },
  { subject: "Routine", value: 67 },
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    text: "Hi, I am MindBridge AI. I noticed your stress indicators are slightly elevated today. Want to talk through what feels heaviest right now?",
    timestamp: "09:24",
  },
  {
    id: "user-1",
    role: "user",
    text: "I am worried about deadlines stacking up and I have not been sleeping well.",
    timestamp: "09:26",
  },
  {
    id: "assistant-2",
    role: "assistant",
    text: "That sounds exhausting. We can break the pressure into one academic step and one recovery step so it feels more manageable.",
    timestamp: "09:26",
  },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: "journal-1",
    title: "Presentation nerves",
    body: "I felt my chest tighten before class, but it eased once I practiced out loud with a friend.",
    sentiment: 61,
    summary: "Mild anxiety eased through rehearsal and social reassurance.",
    timestamp: "Today, 8:10 AM",
    tags: ["anxiety", "presentation", "support"],
  },
  {
    id: "journal-2",
    title: "Late-night study spiral",
    body: "Stayed up too late finishing a lab report. I got it done, but I felt foggy and irritable afterward.",
    sentiment: 43,
    summary: "Productive outcome with recovery cost from poor sleep hygiene.",
    timestamp: "Yesterday, 11:48 PM",
    tags: ["sleep", "academics", "stress"],
  },
  {
    id: "journal-3",
    title: "Small win after a hard week",
    body: "I took a walk after lunch and noticed my thoughts slow down. It helped more than I expected.",
    sentiment: 78,
    summary: "Mood lifted after light movement and a quieter routine break.",
    timestamp: "Sunday, 2:04 PM",
    tags: ["movement", "recovery", "mindfulness"],
  },
];

export const initialForumPosts: ForumPost[] = [
  {
    id: "forum-1",
    author: "Anon Echo",
    title: "Anyone else feel guilty when they take a break?",
    body: "I know rest is supposed to help, but every time I step away from work it feels like I am falling behind.",
    mood: "Overwhelmed",
    toxicity: "Safe",
    replies: 18,
    reactions: { support: 62, relate: 88, hug: 29 },
    timestamp: "7 min ago",
  },
  {
    id: "forum-2",
    author: "Quiet Lantern",
    title: "Trying voice journaling for the first time",
    body: "Typing felt too heavy tonight, so I used the voice journal and it actually made it easier to say what I was avoiding.",
    mood: "Reflective",
    toxicity: "Safe",
    replies: 11,
    reactions: { support: 53, relate: 41, hug: 34 },
    timestamp: "22 min ago",
  },
  {
    id: "forum-3",
    author: "Blue Orbit",
    title: "Exam week is making my sleep weird",
    body: "I keep waking up early thinking about what I forgot. Has anything helped you quiet that cycle?",
    mood: "Anxious",
    toxicity: "Safe",
    replies: 25,
    reactions: { support: 75, relate: 93, hug: 44 },
    timestamp: "48 min ago",
  },
];

export const counselorProfiles: CounselorProfile[] = [
  {
    id: "c1",
    name: "Dr. Maya Rao",
    specialty: "Academic burnout and anxiety",
    availability: "Next available today",
    rating: 4.9,
  },
  {
    id: "c2",
    name: "Aman Verma",
    specialty: "Student resilience coaching",
    availability: "Available tomorrow",
    rating: 4.8,
  },
  {
    id: "c3",
    name: "Dr. Tara Nair",
    specialty: "Trauma-informed support",
    availability: "2 slots left this week",
    rating: 5,
  },
];

export const bookingDays = ["Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18"];

export const bookingSlots: Record<string, BookingSlot[]> = {
  "Tue 14": [
    { time: "09:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "02:15 PM", available: true },
    { time: "05:45 PM", available: true },
  ],
  "Wed 15": [
    { time: "10:00 AM", available: true },
    { time: "12:30 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "06:00 PM", available: false },
  ],
  "Thu 16": [
    { time: "09:00 AM", available: false },
    { time: "01:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "07:00 PM", available: true },
  ],
  "Fri 17": [
    { time: "08:30 AM", available: true },
    { time: "11:30 AM", available: true },
    { time: "02:45 PM", available: true },
    { time: "04:30 PM", available: false },
  ],
  "Sat 18": [
    { time: "09:45 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "03:15 PM", available: false },
    { time: "05:00 PM", available: true },
  ],
};

export const resourceLibrary: ResourceItem[] = [
  {
    id: "res-1",
    title: "Reset after an overwhelming day",
    category: "Anxiety",
    format: "Audio Guide",
    duration: "8 min",
    language: "Bilingual",
    description: "A gentle grounding session with calming prompts and breath pacing.",
  },
  {
    id: "res-2",
    title: "Study stress recovery toolkit",
    category: "Exams",
    format: "Video",
    duration: "12 min",
    language: "English",
    description: "A therapist-led plan for exam weeks, recovery windows, and realistic study pacing.",
  },
  {
    id: "res-3",
    title: "Understanding emotional numbness",
    category: "Depression",
    format: "Article",
    duration: "6 min read",
    language: "English",
    description: "A concise explainer on low-energy states, early signs, and support steps.",
  },
  {
    id: "res-4",
    title: "Sleep repair between deadlines",
    category: "Sleep",
    format: "Article",
    duration: "5 min read",
    language: "Hindi",
    description: "Practical habits to reduce late-night cognitive overload and improve sleep consistency.",
  },
  {
    id: "res-5",
    title: "Mindfulness for racing thoughts",
    category: "Mindfulness",
    format: "Video",
    duration: "9 min",
    language: "Bilingual",
    description: "A short guided practice designed for students who feel mentally overstimulated.",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "note-1",
    title: "Crisis pattern check-in triggered",
    body: "Twilio SMS and WhatsApp standby are armed because your stress score crossed the support threshold.",
    channel: "SMS",
    severity: "Crisis",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "note-2",
    title: "Journal insight ready",
    body: "HuggingFace sentiment analysis found a higher anxiety tone in last night's reflection.",
    channel: "Push",
    severity: "Priority",
    timestamp: "14 min ago",
    read: false,
  },
  {
    id: "note-3",
    title: "Counsellor slot reminder",
    body: "Your session with Dr. Maya Rao starts tomorrow at 12:30 PM. Calendar and video room are ready.",
    channel: "Email",
    severity: "Info",
    timestamp: "40 min ago",
    read: true,
  },
];

export const copingPrompts = [
  "Give me a 3-minute calm-down plan.",
  "Help me untangle my deadline stress.",
  "Suggest a kind message I can send to a friend.",
  "Create a recovery plan for poor sleep.",
];

export const emotionTags = [
  "anxious",
  "hopeful",
  "numb",
  "overwhelmed",
  "steady",
  "tired",
  "grateful",
];

export const apiIntegrations = [
  "OpenAI GPT-4o",
  "HuggingFace",
  "Whisper API",
  "Perspective API",
  "Twilio",
  "Firebase Cloud Messaging",
  "Cal.com",
  "Whereby / Jitsi",
  "Cloudinary",
  "YouTube API",
  "Google Translate",
  "Google TTS",
  "Mixpanel / PostHog",
  "Superset / Metabase",
  "Razorpay / Stripe",
  "Keycloak / Auth0",
];

export const generateAiReply = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes("sleep")) {
    return "Sleep disruption can make everything feel louder. Try a 15-minute wind-down buffer tonight: dim screens, choose one calming activity, and stop academic work before bed.";
  }

  if (lower.includes("deadline") || lower.includes("exam") || lower.includes("workload")) {
    return "Let us shrink the pressure. Pick the single task that would reduce the most anxiety today, work on it for 25 minutes, then take a protected recovery break.";
  }

  if (lower.includes("lonely") || lower.includes("alone")) {
    return "Feeling alone during stress can intensify everything. If it feels safe, reach out to one person with a simple message like: 'I do not need a solution, just a little company today.'";
  }

  return "I am here with you. Based on your patterns, a mix of gentle structure and emotional decompression may help most right now. Want a short coping plan or space to vent first?";
};

export const describeMood = (score: number) => {
  if (score >= 80) return "Grounded and open";
  if (score >= 65) return "Mostly steady";
  if (score >= 50) return "A little stretched";
  if (score >= 35) return "Emotionally taxed";
  return "Needs care and rest";
};
