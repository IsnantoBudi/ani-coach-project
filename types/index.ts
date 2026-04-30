// ============================================================
// AniCoach TypeScript Types
// ============================================================

export type Category = "olahraga" | "belajar" | "kerja" | "sosial" | "istirahat" | "kreatif";
export type Intensity = "ringan" | "sedang" | "tinggi";
export type Difficulty = "ringan" | "sedang" | "epik";
export type QuestStatus = "active" | "completed" | "failed" | "expired";
export type KaitoExpression = "idle" | "excited" | "serious" | "happy" | "disappointed" | "shocked";
export type TaskType =
  | "log_activity"
  | "generate_quests"
  | "get_advice"
  | "level_up"
  | "streak_broken"
  | "onboarding"
  | "weekly_recap"
  | "reaction";

// ============================================================
// Game State Types
// ============================================================

export interface Stats {
  str: number;
  int: number;
  vit: number;
  agi: number;
  chr: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarColor: string;
  level: number;
  exp: number;
  streak: number;
  mora: number;
  primogems: number;
  stats: Stats;
  avatarUrl?: string;
  avatarFrame?: string;
  lastLogin?: string;
}

export interface Activity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: Category;
  duration: number;
  intensity: Intensity;
  expGained: number;
  statsBoost: Stats;
  kaitoDialog?: string;
  kaitoExpression?: KaitoExpression;
  loggedAt: string;
}

export interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: Category;
  expReward: number;
  statsBoost: Stats;
  difficulty: Difficulty;
  status: QuestStatus;
  generatedAt: string;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeKey: string;
  badgeName: string;
  badgeIcon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  expWeek: number;
  rank: number;
}

// ============================================================
// AI / Kaito Types
// ============================================================

export interface KaitoResponse {
  exp: number;
  stats_boost: Stats;
  dialog: string;
  expression: KaitoExpression;
}

export interface KaitoAdviceResponse {
  dialog: string;
  expression: KaitoExpression;
  suggested_quests?: Array<{
    title: string;
    description: string;
    category: Category;
    difficulty: Difficulty;
    exp_reward: number;
    stats_boost: Stats;
  }>;
}

export interface KaitoQuestsResponse {
  quests: Array<{
    title: string;
    description: string;
    category: Category;
    difficulty: Difficulty;
    exp_reward: number;
    stats_boost: Stats;
  }>;
  greeting: string;
  expression: KaitoExpression;
}

export interface KaitoRequest {
  task_type: TaskType;
  language?: "ID" | "EN";
  user: {
    name: string;
    level: number;
    streak: number;
    stats: Stats;
  };
  input?: string;
  context?: string;
  metadata?: Record<string, string | undefined>;
}

// ============================================================
// Database Types (matches Supabase schema)
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_color: string;
          level: number;
          exp: number;
          streak: number;
          last_login: string | null;
          mora: number;
          primogems: number;
          stat_str: number;
          stat_int: number;
          stat_vit: number;
          stat_agi: number;
          stat_chr: number;
          avatar_url: string | null;
          avatar_frame: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; username: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: Category;
          duration: number;
          intensity: Intensity;
          exp_gained: number;
          boost_str: number;
          boost_int: number;
          boost_vit: number;
          boost_agi: number;
          boost_chr: number;
          kaito_dialog: string | null;
          kaito_expression: KaitoExpression;
          logged_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["activities"]["Row"], "id" | "logged_at">;
        Update: Partial<Database["public"]["Tables"]["activities"]["Row"]>;
      };
      quests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: Category | null;
          exp_reward: number;
          boost_str: number;
          boost_int: number;
          boost_vit: number;
          boost_agi: number;
          boost_chr: number;
          difficulty: Difficulty;
          status: QuestStatus;
          generated_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["quests"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["quests"]["Row"]>;
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          badge_key: string;
          badge_name: string;
          badge_icon: string;
          unlocked_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["achievements"]["Row"], "id" | "unlocked_at">;
        Update: never;
      };
      leaderboard_weekly: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          level: number;
          exp_week: number;
          rank: number | null;
          week_start: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leaderboard_weekly"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["leaderboard_weekly"]["Row"]>;
      };
    };
  };
}
