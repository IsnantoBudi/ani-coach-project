"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";
import { getTier, getAffinityGrade, getLevelProgress, getExpToNextLevel } from "@/lib/utils/game";
import { translations } from "@/lib/translations";
import AethericRadar from "@/components/ui/AethericRadar";

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12">
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative p-8 rounded-xl bg-white/30 backdrop-blur-md border border-white/20 animate-pulse">
          <div className="flex gap-6 items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded" />
              <div className="h-4 w-96 bg-gray-200 rounded" />
              <div className="h-10 w-full bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
        <div className="p-8 rounded-xl bg-white/30 backdrop-blur-md border border-white/20 animate-pulse flex flex-col items-center">
          <div className="w-full h-6 w-32 bg-gray-200 rounded mb-6 self-start" />
          <div className="w-32 h-32 rounded-full bg-gray-200" />
          <div className="w-full h-4 bg-gray-200 rounded mt-6" />
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-white/30 rounded-3xl border border-white/20 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="md:col-span-4 space-y-6">
          <div className="h-64 bg-white/30 rounded-3xl border border-white/20 animate-pulse" />
          <div className="h-32 bg-white/30 rounded-3xl border border-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { 
    profile, 
    quests, 
    fetchProfile, 
    fetchQuests, 
    generateDailyQuests, 
    completeQuest,
    abandonQuest,
    language,
    isLoading
  } = useGameStore();

  const [completingId, setCompletingId] = useState<string | null>(null);
  const [abandoningId, setAbandoningId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
    fetchQuests();
  }, [fetchProfile, fetchQuests]);

  const t = translations[language].dashboard;
  const common = translations[language].common;

  const tier = profile ? getTier(profile.level) : { title: "Awakened Soul" };
  const affinity = profile ? getAffinityGrade(profile.stats) : "D";

  // EXP Calculations
  const expProgress = profile ? getLevelProgress(profile.exp) : 0;
  const expNeeded = profile ? getExpToNextLevel(profile.exp) : 0;

  // Sorting Logic: Active first, then by difficulty (EXP) asc
  const sortedQuests = [...quests].sort((a, b) => {
    if (a.status === "active" && b.status === "completed") return -1;
    if (a.status === "completed" && b.status === "active") return 1;
    return a.expReward - b.expReward;
  });

  const completedCount = quests.filter((q) => q.status === "completed").length;
  const isCommissionsDone = quests.length > 0 && completedCount === quests.length;

  return (
    <AppShell>
      {isLoading && !profile ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Abandon Confirmation Modal */}
        <AnimatePresence>
          {abandoningId && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAbandoningId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center filigree-border"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                  <span className="material-symbols-outlined text-3xl">delete_sweep</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">{t.abandonQuestTitle}</h3>
                <p className="text-sm text-gray-500 mb-8 italic">&quot;{t.abandonQuestDesc}&quot;</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setAbandoningId(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    {t.abandonCancel}
                  </button>
                  <button 
                    onClick={async () => {
                      await abandonQuest(abandoningId);
                      setAbandoningId(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                  >
                    {t.abandonConfirm}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Hero Header */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 relative p-6 md:p-8 rounded-xl overflow-hidden shadow-lg group filigree-border"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: "rgba(235,194,62,0.1)" }} />
                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center border shadow-inner" style={{ borderColor: "#fdd34d" }}>
                  <span className="font-heading text-[10px] text-secondary uppercase font-bold tracking-wider">Level</span>
                  <span className="font-heading text-4xl text-primary -mt-1">{profile?.level || 1}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3 text-center md:text-left">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-on-background">
                  {t.welcome} {profile?.username || "Traveler"}
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed max-w-lg italic opacity-80">
                  {t.journeyText}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                  <span className="px-4 py-1 font-heading text-xs font-semibold rounded-full tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                    {tier.title}
                  </span>
                  <span className="px-4 py-1 font-heading text-xs font-semibold rounded-full tracking-wider uppercase bg-secondary/10 text-secondary border border-secondary/20">
                    Streak: {profile?.streak || 0} Days
                  </span>
                </div>

                {/* Level Progress Section */}
                <div className="pt-4 space-y-2 max-w-md mx-auto md:mx-0">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-secondary opacity-80">Journey Progress</span>
                      <span className="text-xs font-bold text-primary">{expProgress}% to Level {(profile?.level || 1) + 1}</span>
                    </div>
                    <span className="text-[10px] font-heading font-bold text-on-surface-variant">{expNeeded} EXP LEFT</span>
                  </div>
                  <div className="relative h-2.5 w-full bg-gray-200/50 rounded-full overflow-hidden border border-white/40 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${expProgress}%` }}
                      className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-secondary shadow-[0_0_12px_rgba(235,194,62,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Harmony Stats Card */}
          <div
            className="p-6 rounded-xl shadow-lg flex flex-col items-center filigree-border justify-center relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            <h3 className="font-heading text-lg text-primary font-semibold mb-6 self-start">{t.aethericHarmony}</h3>
            {profile && <AethericRadar stats={profile.stats} size={150} showLabels={true} />}
            <div className="w-full flex justify-between text-xs mt-2 pt-3 border-t border-primary/10">
              <span className="font-heading font-semibold text-primary">{t.overallAffinity}</span>
              <span className="font-heading font-semibold text-secondary">{t.grade} {affinity}</span>
            </div>
          </div>
        </section>

        {/* Quests Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-heading text-xl text-primary font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">stars</span>
                    {t.dailyCommissions}
                  </h3>
                  {isCommissionsDone && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full border border-green-200">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> {t.allDone}
                    </span>
                  )}
                </div>
                <span className="text-sm text-on-surface-variant italic">
                  {t.completedStatus.replace("{completed}", completedCount.toString()).replace("{total}", quests.length.toString())}
                </span>
              </div>
              
              {quests.length > 0 && (
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden border border-white/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / quests.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-secondary shadow-[0_0_8px_rgba(235,194,62,0.4)]"
                  />
                </div>
              )}
            </div>

            {quests.length === 0 ? (
              <div className="bg-white/40 border border-dashed border-primary/20 rounded-3xl p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-primary/30 mb-4">explore</span>
                <p className="text-on-surface-variant italic">{t.noQuests}</p>
                <button 
                  onClick={() => generateDailyQuests()}
                  className="mt-4 px-8 py-2.5 bg-primary text-white rounded-full text-sm font-heading font-bold hover:scale-105 transition-all shadow-lg"
                >
                  {t.requestQuest}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {isCommissionsDone && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 p-5 rounded-3xl flex items-center gap-4 mb-2"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                      <span className="material-symbols-outlined">schedule</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-700">{t.allCommissionsDone}</p>
                      <p className="text-xs text-green-600/70 italic">{t.comeBackTomorrow}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedQuests.map((quest) => (
                    <motion.div 
                      layout
                      key={quest.id} 
                      className={`group relative overflow-hidden bg-white rounded-3xl p-6 border transition-all duration-300 hover:shadow-xl ${
                        quest.status === "completed" 
                          ? "border-green-100 opacity-60 grayscale-[40%]" 
                          : "border-primary/10 hover:border-primary/30"
                      }`}
                    >
                      <div className="absolute top-0 right-0 p-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-heading font-bold uppercase tracking-widest ${
                          quest.status === "completed" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-secondary/10 text-secondary"
                        }`}>
                          {quest.status === "completed" ? common.completed : quest.category}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-heading font-semibold text-base text-on-background mb-1">{quest.title}</h4>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-3 h-8">{quest.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/10 border border-secondary/20 shadow-sm">
                            <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>history_edu</span>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{quest.expReward} EXP</span>
                          </div>
                          
                          {Object.entries(quest.statsBoost).map(([stat, val]) => {
                            if (val <= 0) return null;
                            const colors: Record<string, string> = {
                              str: "text-rose-600 bg-rose-50 border-rose-100",
                              int: "text-cyan-600 bg-cyan-50 border-cyan-100",
                              vit: "text-emerald-600 bg-emerald-50 border-emerald-100",
                              agi: "text-amber-600 bg-amber-50 border-amber-100",
                              chr: "text-purple-600 bg-purple-50 border-purple-100"
                            };
                            return (
                              <div key={stat} className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${colors[stat] || "text-gray-500 bg-gray-50 border-gray-200"}`}>
                                <span className="material-symbols-outlined text-[12px]">add</span>
                                {stat} {val}
                              </div>
                            );
                          })}
                        </div>

                        <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: quest.status === "completed" ? "100%" : "0%" }}
                            className={`h-full ${quest.status === "completed" ? "bg-green-500" : "bg-amber-400"}`}
                          />
                        </div>
                      </div>

                      {quest.status === "active" && (
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              setCompletingId(quest.id);
                              await completeQuest(quest.id);
                              setCompletingId(null);
                            }}
                            disabled={!!completingId}
                            className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-heading font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                          >
                            {completingId === quest.id ? common.completing : common.complete}
                          </button>
                          <button
                            onClick={() => setAbandoningId(quest.id)}
                            className="px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all active:scale-[0.95] border border-red-100"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl filigree-border bg-white/40 backdrop-blur-xl border border-white/30 shadow-lg">
              <h3 className="font-heading text-lg text-primary font-semibold mb-4">World Status</h3>
              <div className="space-y-4">
                {[
                  { label: "Active Quests", value: quests.filter(q => q.status === 'active').length, icon: "assignment" },
                  { label: "Completed Today", value: completedCount, icon: "check_circle" },
                  { label: "World Level", value: Math.floor((profile?.level || 1) / 10) + 1, icon: "public" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-white/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-xl">{item.icon}</span>
                      <span className="text-xs font-heading text-on-surface-variant font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm font-heading font-bold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources HUD */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t.moraBalance, value: profile?.mora?.toLocaleString() || "0", color: "text-amber-600", bg: "bg-amber-50" },
                { label: t.primogems, value: profile?.primogems?.toLocaleString() || "0", color: "text-primary", bg: "bg-primary/5" },
              ].map((stat) => (
                <div key={stat.label} className={`p-4 rounded-3xl flex flex-col items-center text-center border border-white/20 ${stat.bg}`}>
                  <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-heading mb-1">{stat.label}</span>
                  <span className={`font-heading text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}
    </AppShell>
  );
}
