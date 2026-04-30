"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";
import { translations } from "@/lib/translations";
import { motion } from "framer-motion";

export default function LeaderboardPage() {
  const { profile, leaderboard, fetchLeaderboard, language } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const t = translations[language].leaderboard;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (!mounted) return null;

  const topThree = leaderboard.slice(0, 3);
  const runnersUp = leaderboard.slice(3).map(entry => ({
    ...entry,
    isCurrentUser: entry.userId === profile?.id
  }));

  // Helper to get title based on level
  const getTitle = (level: number) => {
    if (level >= 40) return "Legendary Traveler";
    if (level >= 30) return "Elite Champion";
    if (level >= 20) return "Proven Warrior";
    return "Rising Adventurer";
  };

  return (
    <AppShell>
      <div className="space-y-10 pb-12">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-heading uppercase tracking-widest text-secondary mb-1 block">— {t.archive} —</span>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-primary">{t.title}</h1>
          </div>

          <div className="flex rounded-full p-1 border" style={{ background: "rgba(219,241,254,0.5)", borderColor: "rgba(114,120,120,0.2)" }}>
            <button className="px-5 py-2 rounded-full text-sm font-heading font-semibold text-on-primary"
              style={{ background: "var(--primary)" }}>
              {t.global}
            </button>
            <button className="px-5 py-2 rounded-full text-sm font-heading font-semibold text-on-surface-variant hover:text-primary transition-all">
              {t.friends}
            </button>
          </div>
        </header>

        {leaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-60">
            <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
            <p className="font-heading">Belum ada catatan legenda...</p>
          </div>
        ) : (
          <>
            {/* Podium Top 3 */}
            <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 pt-16 pb-4">

              {/* Rank 2 */}
              {topThree[1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center order-2 md:order-1 group relative w-full max-w-[180px] mx-auto md:mx-0"
                >
                  <span className="material-symbols-outlined absolute -top-10 text-3xl" style={{ color: "var(--outline)", fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg mb-3 flex items-center justify-center font-heading font-bold text-2xl text-primary overflow-hidden"
                    style={{ background: "var(--surface-container)" }}>
                    {topThree[1].username.charAt(0)}
                  </div>
                  <div className="w-full h-28 rounded-t-xl flex flex-col items-center pt-3 transition-all group-hover:shadow-inner"
                    style={{ background: "rgba(199,221,233,0.5)", border: "1px solid rgba(199,221,233,0.7)", borderBottom: "none" }}>
                    <span className="font-heading text-xl font-semibold text-on-surface-variant">2nd</span>
                    <span className="text-xs font-heading text-on-surface text-center px-2 truncate w-full mt-1">{topThree[1].username}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{topThree[1].expWeek.toLocaleString()} XP</span>
                  </div>
                </motion.div>
              )}

              {/* Rank 1 */}
              {topThree[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center order-1 md:order-2 group relative w-full max-w-[220px] mx-auto md:mx-0"
                >
                  <span className="material-symbols-outlined absolute -top-14 text-5xl drop-shadow-md"
                    style={{ color: "#ebc23e", fontVariationSettings: "'FILL' 1", filter: "drop-shadow(0 0 8px rgba(235,194,62,0.5))" }}>
                    emoji_events
                  </span>
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-xl mb-3 flex items-center justify-center font-heading font-bold text-3xl text-primary overflow-hidden"
                    style={{ background: "var(--primary-container)", boxShadow: "0 0 20px rgba(235,194,62,0.3)" }}>
                    {topThree[0].username.charAt(0)}
                  </div>
                  <div className="w-full h-40 rounded-t-xl flex flex-col items-center pt-4 transition-all"
                    style={{ background: "linear-gradient(180deg, rgba(253,211,77,0.2) 0%, rgba(224,242,241,0.4) 100%)", border: "1px solid rgba(235,194,62,0.4)", borderBottom: "none" }}>
                    <span className="font-heading text-3xl font-bold text-primary">1st</span>
                    <span className="text-sm font-heading font-semibold text-on-surface text-center px-2 truncate w-full mt-1">{topThree[0].username}</span>
                    <span className="text-xs font-heading text-secondary uppercase tracking-widest mt-1">{topThree[0].expWeek.toLocaleString()} XP</span>
                  </div>
                </motion.div>
              )}

              {/* Rank 3 */}
              {topThree[2] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center order-3 group relative w-full max-w-[180px] mx-auto md:mx-0"
                >
                  <span className="material-symbols-outlined absolute -top-10 text-3xl" style={{ color: "#cd7f32", fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                  <div className="w-16 h-16 rounded-full border-2 border-amber-800/30 shadow-lg mb-3 flex items-center justify-center font-heading font-bold text-2xl overflow-hidden"
                    style={{ background: "rgba(254,243,199,0.7)", color: "var(--secondary)" }}>
                    {topThree[2].username.charAt(0)}
                  </div>
                  <div className="w-full h-24 rounded-t-xl flex flex-col items-center pt-3 transition-all"
                    style={{ background: "rgba(254,240,195,0.35)", border: "1px solid rgba(205,127,50,0.25)", borderBottom: "none" }}>
                    <span className="font-heading text-xl font-semibold" style={{ color: "#b45309" }}>3rd</span>
                    <span className="text-xs font-heading text-on-surface text-center px-2 truncate w-full mt-1">{topThree[2].username}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{topThree[2].expWeek.toLocaleString()} XP</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Runners Up */}
            <div className="max-w-3xl mx-auto space-y-2 mt-8">
              {runnersUp.map((user, idx) => (
                <motion.div 
                  key={user.userId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`flex items-center p-4 rounded-xl border transition-all ${user.isCurrentUser ? "filigree-border shadow-md" : "hover:shadow-sm"}`}
                    style={{
                      background: user.isCurrentUser
                        ? "rgba(224,242,241,0.65)"
                        : "rgba(255,255,255,0.35)",
                      backdropFilter: "blur(12px)",
                      borderColor: user.isCurrentUser ? "rgba(81,97,97,0.4)" : "rgba(255,255,255,0.4)",
                    }}>
                    <div className="w-10 text-center font-heading text-lg font-semibold text-on-surface-variant">
                      {user.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white mx-4 flex items-center justify-center font-heading font-bold text-sm shadow-sm overflow-hidden"
                      style={{ background: "var(--primary-container)", color: "var(--primary)" }}>
                      {user.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-semibold text-sm truncate max-w-[120px] md:max-w-none" 
                          style={{ color: user.isCurrentUser ? "var(--primary)" : "var(--on-surface)" }}>
                          {user.username}
                        </h4>
                        {user.isCurrentUser && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-heading font-bold uppercase tracking-wider whitespace-nowrap"
                            style={{ background: "var(--primary)" , color: "white" }}>
                            {t.you}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wide opacity-70">
                        {getTitle(user.level)}
                      </p>
                    </div>
                    <div className="text-right pl-2">
                      <div className="font-heading font-semibold text-sm text-on-surface">Lv. {user.level}</div>
                      <div className="text-[10px] md:text-xs text-on-surface-variant font-medium">{user.expWeek.toLocaleString()} XP</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
