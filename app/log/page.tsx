"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";
import { getLevelProgress } from "@/lib/utils/game";
import { translations } from "@/lib/translations";

export default function ActivityLogPage() {
  const { profile, logActivity, isKaitoThinking, kaitoDialog, kaitoExpression } = useGameStore();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("olahraga");
  const [duration, setDuration] = useState("45");
  const [intensity, setIntensity] = useState("Sedang");
  const [notes, setNotes] = useState("");

  const { language } = useGameStore();
  const t = translations[language].log;

  const expProgress = profile ? getLevelProgress(profile.exp) : 0;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await logActivity(title, category, duration, intensity, notes);
    setTitle("");
    setNotes("");
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary mb-1">{t.title}</h1>
            <p className="text-on-surface-variant text-lg">{t.subtitle}</p>
          </div>

          {/* Kaito mini widget */}
          <div className="flex items-center gap-4 px-5 py-3 rounded-full border transition-all"
            style={{ 
              background: isKaitoThinking ? "rgba(235,194,62,0.2)" : "rgba(255,255,255,0.5)", 
              backdropFilter: "blur(16px)", 
              borderColor: "rgba(81,97,97,0.2)" 
            }}>
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "var(--primary-container)" }}>
              <span className="material-symbols-outlined text-primary text-2xl">
                {kaitoExpression === "excited" ? "sentiment_very_satisfied" : 
                 kaitoExpression === "serious" ? "sentiment_neutral" : 
                 kaitoExpression === "happy" ? "sentiment_satisfied" : 
                 kaitoExpression === "disappointed" ? "sentiment_dissatisfied" : 
                 kaitoExpression === "shocked" ? "sentiment_extremely_dissatisfied" : 
                 "person"}
              </span>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-xs font-bold text-secondary font-heading uppercase tracking-wider">{t.kaitoSays}</p>
              <p className="text-sm italic text-primary">
                {kaitoDialog || `"${t.defaultKaitoDialog}"`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Entry Form */}
          <div className="lg:col-span-8 rounded-xl p-6 md:p-8 shadow-xl filigree-border"
            style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(24px)", border: "1px solid rgba(235,194,62,0.3)" }}>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
                {t.activitySubject}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Lari pagi 5km"
                className="w-full rounded-lg px-4 py-3 font-heading text-primary placeholder-primary/30 focus:outline-none focus:ring-2 text-base"
                style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
                {t.category}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-lg">category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 pl-12 font-heading text-primary focus:outline-none focus:ring-2 text-base appearance-none cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
                >
                  <option value="olahraga">{t.categories.olahraga}</option>
                  <option value="belajar">{t.categories.belajar}</option>
                  <option value="kerja">{t.categories.kerja}</option>
                  <option value="sosial">{t.categories.sosial}</option>
                  <option value="istirahat">{t.categories.istirahat}</option>
                  <option value="kreatif">{t.categories.kreatif}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
                  {t.duration}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-lg">schedule</span>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 pl-12 font-heading text-primary focus:outline-none focus:ring-2 text-base"
                    style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
                  {t.intensity}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-lg">bolt</span>
                  <select
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 pl-12 font-heading text-primary focus:outline-none focus:ring-2 text-base appearance-none cursor-pointer"
                    style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
                  >
                    <option value="ringan">{t.intensities.ringan}</option>
                    <option value="sedang">{t.intensities.sedang}</option>
                    <option value="tinggi">{t.intensities.tinggi}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Estimated Rewards Display */}
            <div className="mb-8 p-5 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>rewarded_ads</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-heading font-bold text-primary uppercase tracking-wider">Potential Rewards</h4>
                    <p className="text-sm text-on-surface-variant italic">Estimated gains based on intensity & duration</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-secondary">
                    <span className="material-symbols-outlined text-sm">history_edu</span>
                    <span className="text-2xl font-heading font-bold">
                      {Math.round((parseInt(duration || "0") / 30) * 80 * (intensity === "ringan" ? 1.0 : intensity === "sedang" ? 1.5 : 2.2))}
                    </span>
                    <span className="text-xs font-bold font-heading self-end pb-1 ml-1">EXP</span>
                  </div>
                </div>
              </div>
              
              <div className="fading-line h-px w-full opacity-30" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-primary/60">Aetheric Affinity Boost</span>
                </div>
                <div className="flex gap-2">
                  {(() => {
                    const statMap: Record<string, string> = {
                      olahraga: "STR",
                      belajar: "INT",
                      istirahat: "VIT",
                      kerja: "AGI",
                      sosial: "CHR",
                      kreatif: "INT"
                    };
                    const primaryStat = statMap[category] || "STR";
                    const boostAmount = intensity === "tinggi" ? 3 : intensity === "sedang" ? 2 : 1;
                    
                    const statColors: Record<string, string> = {
                      STR: "from-rose-400 to-rose-600",
                      INT: "from-cyan-400 to-cyan-600",
                      VIT: "from-emerald-400 to-emerald-600",
                      AGI: "from-amber-400 to-amber-600",
                      CHR: "from-purple-400 to-purple-600"
                    };

                    return (
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${statColors[primaryStat]} text-white text-[10px] font-bold font-heading shadow-sm flex items-center gap-1.5`}>
                        <span className="material-symbols-outlined text-[12px]">add_circle</span>
                        {primaryStat} +{boostAmount}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
                {t.notes}
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full rounded-lg px-4 py-3 font-body text-on-surface placeholder-primary/30 focus:outline-none focus:ring-2 text-base resize-none"
                style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
              />
            </div>

            <div className="fading-line mb-6" />

            <div className="flex justify-between items-center">
              <button 
                onClick={() => { setTitle(""); setNotes(""); }}
                className="px-6 py-3 rounded-full border font-heading text-sm text-primary hover:bg-primary/5 transition-all"
                style={{ borderColor: "rgba(81,97,97,0.3)" }}>
                {t.discardDraft}
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isKaitoThinking || !title.trim()}
                className="px-8 py-3 rounded-full font-heading font-semibold text-sm text-on-primary shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--primary)" }}>
                <span>{isKaitoThinking ? t.sealing : t.sealJourney}</span>
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  {isKaitoThinking ? "sync" : "auto_awesome"}
                </span>
              </button>
            </div>
          </div>

          {/* Rewards sidebar */}
          <div className="lg:col-span-4 space-y-5">

            {/* Profile Brief */}
            <div className="rounded-xl p-5 border shadow-inner"
              style={{ background: "rgba(224,242,241,0.4)", backdropFilter: "blur(16px)", borderColor: "var(--primary-fixed-dim)" }}>
              <h3 className="font-heading text-lg text-primary font-semibold mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined">stars</span>
                {t.currentStatus}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ background: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.6)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary font-heading">{t.level} {profile?.level || 1}</p>
                      <p className="text-xs text-on-surface-variant">Scholarly Adventurer</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ background: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.6)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary font-heading">EXP</p>
                      <p className="text-xs text-on-surface-variant">Total Experience</p>
                    </div>
                  </div>
                  <span className="font-heading text-xl font-semibold" style={{ color: "var(--primary)" }}>{profile?.exp || 0}</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-xs text-primary font-heading mb-1.5">
                  <span>{t.expProgress}</span>
                  <span>{expProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden p-px border border-white/60" style={{ background: "rgba(255,255,255,0.4)" }}>
                  <div className="h-full rounded-full shadow-sm transition-all duration-1000" style={{ width: `${expProgress}%`, background: "linear-gradient(90deg, #516161, #ebc23e)" }} />
                </div>
              </div>
            </div>

            {/* Unlocked Memories */}
            <div className="rounded-xl p-5 border"
              style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.4)" }}>
              <h3 className="text-xs uppercase tracking-widest text-primary/60 font-heading font-semibold mb-4">{t.aethericElements}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-red-100 to-rose-200 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-rose-800">STR</span>
                  <span className="text-sm">{profile?.stats?.str || 10}</span>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-blue-100 to-cyan-200 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-cyan-800">INT</span>
                  <span className="text-sm">{profile?.stats?.int || 10}</span>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-white shadow-sm bg-gradient-to-br from-green-100 to-emerald-200 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-emerald-800">VIT</span>
                  <span className="text-sm">{profile?.stats?.vit || 10}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
