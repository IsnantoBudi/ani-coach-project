import { create } from "zustand";
import type { UserProfile, Activity, Quest, KaitoExpression, KaitoResponse, KaitoQuestsResponse, KaitoAdviceResponse, LeaderboardEntry } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface GameState {
  // User Data
  profile: UserProfile | null;
  activities: Activity[];
  quests: Quest[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  
  // Kaito State
  kaitoExpression: KaitoExpression;
  kaitoDialog: string | null;
  isKaitoThinking: boolean;
  language: "ID" | "EN";
  isSidebarCollapsed: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  fetchActivities: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  
  // AI Interactions
  logActivity: (title: string, category: string, duration?: string, intensity?: string, notes?: string) => Promise<void>;
  generateDailyQuests: () => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  abandonQuest: (questId: string) => Promise<void>;
  summonKaito: (actionType?: "get_advice" | "generate_custom_quest" | "motivation", options?: { difficulty?: string, category?: string }, metadata?: Record<string, string | undefined>) => Promise<KaitoResponse | KaitoQuestsResponse | KaitoAdviceResponse | undefined>;
  takeSuggestedQuest: (quest: Partial<Quest>) => Promise<void>;
  
  // Local UI Actions
  setKaitoState: (expression: KaitoExpression, dialog: string | null) => void;
  setLanguage: (lang: "ID" | "EN") => void;
  toggleSidebar: () => void;
}

const supabase = createClient();

export const useGameStore = create<GameState>((set, get) => ({
  profile: null,
  activities: [],
  quests: [],
  leaderboard: [],
  isLoading: false,
  kaitoExpression: "idle",
  kaitoDialog: null,
  isKaitoThinking: false,
  language: "ID",
  isSidebarCollapsed: false,

  setKaitoState: (expression, dialog) => {
    set({ kaitoExpression: expression, kaitoDialog: dialog });
  },

  setLanguage: (lang: "ID" | "EN") => {
    set({ language: lang });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        set({ profile: data });
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActivities: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/activities?limit=10");
      if (res.ok) {
        const data = await res.json();
        set({ activities: data.activities });
      }
    } catch (e) {
      console.error("Failed to fetch activities", e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchQuests: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/quests");
      if (res.ok) {
        const data = await res.json();
        set({ quests: data.quests });
      }
    } catch (e) {
      console.error("Failed to fetch quests", e);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchLeaderboard: async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        set({ leaderboard: data.leaderboard });
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  },

  logActivity: async (title: string, category: string, duration?: string, intensity?: string, notes?: string) => {
    const { profile } = get();
    if (!profile) return;

    set({ isKaitoThinking: true, kaitoDialog: "Menganalisis aktivitasmu..." });

    try {
      const res = await fetch("/api/kaito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: "log_activity",
          user: {
            name: profile.username,
            level: profile.level,
            streak: profile.streak,
            stats: profile.stats,
          },
          input: title,
          context: category,
          metadata: {
            duration,
            intensity,
            notes
          }
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as KaitoResponse;
        
        set((state) => ({
          isKaitoThinking: false,
          kaitoExpression: data.expression,
          kaitoDialog: data.dialog,
          profile: state.profile
            ? {
                ...state.profile,
                exp: state.profile.exp + data.exp,
                stats: {
                  str: Math.min(100, state.profile.stats.str + data.stats_boost.str),
                  int: Math.min(100, state.profile.stats.int + data.stats_boost.int),
                  vit: Math.min(100, state.profile.stats.vit + data.stats_boost.vit),
                  agi: Math.min(100, state.profile.stats.agi + data.stats_boost.agi),
                  chr: Math.min(100, state.profile.stats.chr + data.stats_boost.chr),
                },
              }
            : null,
        }));

        get().fetchActivities();
        get().fetchProfile();
      } else {
        set({ isKaitoThinking: false, kaitoExpression: "disappointed", kaitoDialog: "Sepertinya ada gangguan pada jaringanku." });
      }
    } catch {
      set({ isKaitoThinking: false, kaitoExpression: "disappointed", kaitoDialog: "Koneksi terputus. Tapi aku yakin aktivitasmu tadi hebat." });
    }
  },

  generateDailyQuests: async () => {
    const { profile } = get();
    if (!profile) return;

    set({ isKaitoThinking: true, kaitoDialog: "Mencari konstelasi quest yang tepat untukmu..." });

    try {
      const res = await fetch("/api/kaito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: "generate_quests",
          user: {
            name: profile.username,
            level: profile.level,
            streak: profile.streak,
            stats: profile.stats,
          },
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as KaitoQuestsResponse;
        
        set({
          isKaitoThinking: false,
          kaitoExpression: data.expression,
          kaitoDialog: data.greeting,
        });

        await get().fetchQuests();
      } else {
         set({ isKaitoThinking: false, kaitoExpression: "serious", kaitoDialog: "Gagal menarik quest dari arsip." });
      }
    } catch {
       set({ isKaitoThinking: false, kaitoExpression: "serious", kaitoDialog: "Sistem quest sedang offline." });
    }
  },

  completeQuest: async (questId: string) => {
    try {
      const res = await fetch("/api/quests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: questId }),
      });

      if (res.ok) {
        set((state) => ({
          quests: state.quests.map((q) =>
            q.id === questId ? { ...q, status: "completed", completedAt: new Date().toISOString() } : q
          ),
          kaitoExpression: "excited",
          kaitoDialog: "Quest selesai! Hadiah EXP sudah kutambahkan ke statusmu.",
        }));
        
        get().fetchProfile();
      }
    } catch (e) {
      console.error("Failed to complete quest", e);
    }
  },

  abandonQuest: async (questId: string) => {
    const { profile } = get();
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', questId);

      if (!error) {
        set(state => ({
          quests: state.quests.filter(q => q.id !== questId)
        }));
      }
    } catch (e) {
      console.error("Failed to abandon quest", e);
    }
  },

  takeSuggestedQuest: async (questData: Partial<Quest>) => {
    const { profile } = get();
    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      const { error } = await supabase
        .from('quests')
        .insert({
          title: questData.title || "Misi Baru",
          description: questData.description || "",
          category: questData.category || "olahraga",
          exp_reward: questData.expReward || 0,
          difficulty: questData.difficulty || "ringan",
          boost_str: questData.statsBoost?.str || 0,
          boost_int: questData.statsBoost?.int || 0,
          boost_vit: questData.statsBoost?.vit || 0,
          boost_agi: questData.statsBoost?.agi || 0,
          boost_chr: questData.statsBoost?.chr || 0,
          user_id: profile.id,
          status: 'active',
          generated_at: today
        });

      if (!error) {
        await get().fetchQuests();
        set({ kaitoDialog: "Misi telah diterima! Semoga sukses, Traveler.", kaitoExpression: "excited" });
      } else {
        console.error("Supabase error:", error);
      }
    } catch (e) {
      console.error("Failed to take suggested quest", e);
    }
  },
  
  summonKaito: async (actionType: "get_advice" | "generate_custom_quest" | "motivation" = "get_advice", options: { difficulty?: string, category?: string } = {}) => {
    const { profile, quests } = get();
    if (!profile) return;

    const taskMap = {
      get_advice: "get_advice",
      generate_custom_quest: "generate_quests",
      motivation: "get_advice",
    };

    const isQuestPreview = actionType === "get_advice" && options.difficulty;

    set({ isKaitoThinking: true, kaitoDialog: isQuestPreview ? "Menerawang misi yang cocok..." : "Menghubungi dimensi Aether..." });

    try {
      const activeQuests = quests.filter(q => q.status === "active");
      const contextHint = [
        options.difficulty ? `Difficulty Level: ${options.difficulty}. Generate 3 specific quest options in 'suggested_quests' array.` : "",
        options.category ? `Focus Category: ${options.category}` : "",
        actionType === "motivation" ? "Fokus pada kata-kata penyemangat murni." : ""
      ].filter(Boolean).join(". ");

      const res = await fetch("/api/kaito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: taskMap[actionType],
          language: get().language,
          user: {
            name: profile.username,
            level: profile.level,
            streak: profile.streak,
            stats: profile.stats,
          },
          context: `${contextHint}. Active Quests: ${activeQuests.map(q => q.title).join(", ") || "None"}. History: ${profile.level} levels achieved.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        if (actionType === "generate_custom_quest" && data.quests) {
          await get().fetchQuests();
          set({
            isKaitoThinking: false,
            kaitoExpression: "excited",
            kaitoDialog: "Aku telah menambahkan misi baru yang cocok dengan potensimu!",
          });
          return data;
        } else {
          set({
            isKaitoThinking: false,
            kaitoExpression: data.expression || "idle",
            kaitoDialog: data.dialog,
          });
          return data;
        }
      } else {
        set({ isKaitoThinking: false, kaitoExpression: "disappointed", kaitoDialog: "Kaito sedang bermeditasi. Coba lagi nanti." });
      }
    } catch {
      set({ isKaitoThinking: false, kaitoExpression: "disappointed", kaitoDialog: "Koneksi ke dimensi Kaito terputus." });
    }
  },
}));
