import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  describeMood,
  initialChatMessages,
  initialForumPosts,
  initialJournalEntries,
  initialNotifications,
} from "@/data/mockData";
import type {
  ChatMessage,
  ForumPost,
  JournalEntry,
  NotificationItem,
  PageId,
  ReactionType,
  ThemeMode,
} from "@/types";

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

interface JournalDraftInput {
  title: string;
  body: string;
  tags: string[];
}

interface AppState {
  activePage: PageId;
  theme: ThemeMode;
  anonymousMode: boolean;
  selectedLanguage: "English" | "Hindi";
  moodScore: number;
  livePresence: number;
  initialLoading: boolean;
  isAiTyping: boolean;
  chatMessages: ChatMessage[];
  journalEntries: JournalEntry[];
  forumPosts: ForumPost[];
  notifications: NotificationItem[];
  bookedSlot?: string;
  setActivePage: (page: PageId) => void;
  toggleTheme: () => void;
  toggleAnonymousMode: () => void;
  setSelectedLanguage: (language: "English" | "Hindi") => void;
  setMoodScore: (value: number) => void;
  dismissInitialLoading: () => void;
  sendChatMessage: (message: string) => void;
  appendAssistantMessage: (message: string) => void;
  addJournalEntry: (input: JournalDraftInput) => void;
  addForumPost: (input: { title: string; body: string; mood: string }) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  markNotificationRead: (id: string) => void;
  setLivePresence: (count: number) => void;
  setBookedSlot: (slot: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activePage: "dashboard",
      theme: "light",
      anonymousMode: true,
      selectedLanguage: "English",
      moodScore: 68,
      livePresence: 214,
      initialLoading: true,
      isAiTyping: false,
      chatMessages: initialChatMessages,
      journalEntries: initialJournalEntries,
      forumPosts: initialForumPosts,
      notifications: initialNotifications,
      bookedSlot: "Tomorrow • 12:30 PM • Dr. Maya Rao",
      setActivePage: (page) => set({ activePage: page }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      toggleAnonymousMode: () =>
        set((state) => ({ anonymousMode: !state.anonymousMode })),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setMoodScore: (value) => set({ moodScore: value }),
      dismissInitialLoading: () => set({ initialLoading: false }),
      sendChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: makeId(),
              role: "user",
              text: message,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
          isAiTyping: true,
        })),
      appendAssistantMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              id: makeId(),
              role: "assistant",
              text: message,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
          isAiTyping: false,
        })),
      addJournalEntry: ({ title, body, tags }) =>
        set((state) => {
          const sentiment = Math.min(
            88,
            Math.max(34, Math.round(state.moodScore + body.length / 18)),
          );

          return {
            journalEntries: [
              {
                id: makeId(),
                title,
                body,
                sentiment,
                summary: `${describeMood(sentiment)}. AI detected ${tags[0] ?? "mixed"} themes with a need for recovery support.`,
                timestamp: "Just now",
                tags,
              },
              ...state.journalEntries,
            ],
          };
        }),
      addForumPost: ({ title, body, mood }) =>
        set((state) => ({
          forumPosts: [
            {
              id: makeId(),
              author: "Anon Beacon",
              title,
              body,
              mood,
              toxicity: "Safe",
              replies: 0,
              reactions: { support: 1, relate: 0, hug: 0 },
              timestamp: "Just now",
            },
            ...state.forumPosts,
          ],
        })),
      reactToPost: (postId, reaction) =>
        set((state) => ({
          forumPosts: state.forumPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  reactions: {
                    ...post.reactions,
                    [reaction]: post.reactions[reaction] + 1,
                  },
                }
              : post,
          ),
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
        })),
      setLivePresence: (count) => set({ livePresence: count }),
      setBookedSlot: (slot) => set({ bookedSlot: slot }),
    }),
    {
      name: "mindbridge-ui-state",
      partialize: (state) => ({
        theme: state.theme,
        anonymousMode: state.anonymousMode,
        selectedLanguage: state.selectedLanguage,
        moodScore: state.moodScore,
        chatMessages: state.chatMessages,
        journalEntries: state.journalEntries,
        forumPosts: state.forumPosts,
        notifications: state.notifications,
        bookedSlot: state.bookedSlot,
      }),
    },
  ),
);
