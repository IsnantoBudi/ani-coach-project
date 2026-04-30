/**
 * Local database row types for Supabase tables.
 *
 * These are used as type assertions when Supabase doesn't have
 * auto-generated types (i.e., before running `supabase gen types typescript`).
 *
 * To generate proper types later:
 *   npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts
 */

export type ProfileRow = {
  id: string;
  username: string | null;
  level: number;
  exp: number;
  streak: number | null;
  mora: number | null;
  primogems: number | null;
  stat_str: number | null;
  stat_int: number | null;
  stat_vit: number | null;
  stat_agi: number | null;
  stat_chr: number | null;
  avatar_url: string | null;
  avatar_frame: string | null;
  last_login: string | null;
  stats: Record<string, unknown> | null;
  updated_at: string | null;
};

export type ActivityRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: number | null;
  intensity: string | null;
  exp_gained: number | null;
  boost_str: number | null;
  boost_int: number | null;
  boost_vit: number | null;
  boost_agi: number | null;
  boost_chr: number | null;
  kaito_dialog: string | null;
  kaito_expression: string | null;
  logged_at: string | null;
};

export type QuestRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  exp_reward: number | null;
  boost_str: number | null;
  boost_int: number | null;
  boost_vit: number | null;
  boost_agi: number | null;
  boost_chr: number | null;
  status: "active" | "completed" | "expired";
  generated_at: string | null;
  completed_at: string | null;
};

export type LeaderboardProfileRow = {
  id: string;
  username: string | null;
  level: number;
  exp: number;
};
