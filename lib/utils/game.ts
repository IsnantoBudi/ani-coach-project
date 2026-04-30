import type { Stats } from "@/types";

// ============================================================
// EXP & Level System Utilities
// ============================================================

/** Calculate level from total EXP (1000 EXP per level) */
export function getLevelFromExp(exp: number): number {
  return Math.max(1, Math.floor(exp / 1000) + 1);
}

/** EXP needed to reach next level */
export function getExpToNextLevel(currentExp: number): number {
  const currentLevel = getLevelFromExp(currentExp);
  return currentLevel * 1000 - currentExp;
}

/** Progress percentage within current level (0-100) */
export function getLevelProgress(currentExp: number): number {
  const level = getLevelFromExp(currentExp);
  const levelStartExp = (level - 1) * 1000;
  const levelEndExp = level * 1000;
  return Math.round(((currentExp - levelStartExp) / (levelEndExp - levelStartExp)) * 100);
}

// ============================================================
// Tier / Title System
// ============================================================

export interface Tier {
  name: string;
  title: string;
  color: string;
  minLevel: number;
}

export const TIERS: Tier[] = [
  { name: "Bronze",   title: "Awakened Soul",    color: "#cd7f32", minLevel: 1  },
  { name: "Silver",   title: "Rising Adventurer", color: "#a0a0a0", minLevel: 6  },
  { name: "Gold",     title: "Proven Warrior",    color: "#ebc23e", minLevel: 11 },
  { name: "Platinum", title: "Elite Champion",    color: "#4ecdc4", minLevel: 21 },
  { name: "Diamond",  title: "Legendary",         color: "#b19cd9", minLevel: 36 },
];

export function getTier(level: number): Tier {
  return [...TIERS].reverse().find((t) => level >= t.minLevel) ?? TIERS[0];
}

// ============================================================
// Stats Utilities
// ============================================================

/** Clamp stats between 0 and 100 */
export function clampStats(stats: Stats): Stats {
  return {
    str: Math.min(100, Math.max(0, stats.str)),
    int: Math.min(100, Math.max(0, stats.int)),
    vit: Math.min(100, Math.max(0, stats.vit)),
    agi: Math.min(100, Math.max(0, stats.agi)),
    chr: Math.min(100, Math.max(0, stats.chr)),
  };
}

/** Merge stat boost into existing stats */
export function applyStatsBoost(current: Stats, boost: Stats): Stats {
  return clampStats({
    str: current.str + boost.str,
    int: current.int + boost.int,
    vit: current.vit + boost.vit,
    agi: current.agi + boost.agi,
    chr: current.chr + boost.chr,
  });
}

/** Overall affinity grade based on average stat */
export function getAffinityGrade(stats: Stats): string {
  const avg = (stats.str + stats.int + stats.vit + stats.agi + stats.chr) / 5;
  if (avg >= 80) return "S";
  if (avg >= 65) return "A";
  if (avg >= 50) return "B";
  if (avg >= 35) return "C";
  return "D";
}

/** Weakest stat key */
export function getWeakestStat(stats: Stats): keyof Stats {
  return (Object.entries(stats) as [keyof Stats, number][])
    .sort(([, a], [, b]) => a - b)[0][0];
}

// ============================================================
// Achievement Keys
// ============================================================

export const ACHIEVEMENTS = {
  FIRST_ACTIVITY: {
    key: "first_activity",
    name: "Langkah Pertama",
    icon: "directions_run",
  },
  STREAK_3: {
    key: "streak_3",
    name: "3 Hari Berturut-turut",
    icon: "local_fire_department",
  },
  STREAK_7: {
    key: "streak_7",
    name: "Konstelasi Seminggu",
    icon: "stars",
  },
  LEVEL_5: {
    key: "level_5",
    name: "Petualang Sejati",
    icon: "military_tech",
  },
  LEVEL_10: {
    key: "level_10",
    name: "Pejuang Elite",
    icon: "emoji_events",
  },
  FIRST_QUEST: {
    key: "first_quest",
    name: "Misi Pertama",
    icon: "menu_book",
  },
  ALL_QUESTS_DAILY: {
    key: "all_quests_daily",
    name: "Hari Sempurna",
    icon: "done_all",
  },
} as const;

// ============================================================
// Streak Utilities
// ============================================================

export function calculateStreak(lastLogin: Date | null): number {
  if (!lastLogin) return 0;
  const now = new Date();
  const diffMs = now.getTime() - lastLogin.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= 1 ? 1 : 0; // reset if more than 1 day gap
}
