"use client";

import { useEffect, useState, useRef } from "react";
import AppShell from "@/components/layout/AppShell";
import { useGameStore } from "@/store/gameStore";
import AethericRadar from "@/components/ui/AethericRadar";
import { getTier } from "@/lib/utils/game";
import { translations } from "@/lib/translations";
import Image from "next/image";

const FRAMES = [
  { id: 'none', name: 'Standard', level: 0, image: null },
  { id: 'bronze', name: 'Aetheric Bronze', level: 1, image: '/frame/bronze.png' },
  { id: 'silver', name: 'Astral Silver', level: 20, image: '/frame/silver.png' },
  { id: 'gold', name: 'Solar Gold', level: 40, image: '/frame/gold.png' },
  { id: 'platinum', name: 'Lunar Platinum', level: 70, image: '/frame/platinum.png' },
  { id: 'legend', name: 'Stellar Legend', level: 100, image: '/frame/legend.png' },
];

export default function ProfilePage() {
  const { profile, fetchProfile, language } = useGameStore();
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const t = translations[language].profile;
  const common = translations[language].common;

  const level = profile?.level || 1;
  const exp = profile?.exp || 0;
  const expNeeded = level * 1000;
  const expProgress = Math.min((exp / expNeeded) * 100, 100);
  
  const tier = profile ? getTier(level) : { title: "Awakened Soul" };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        await fetchProfile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const updateFrame = async (frameId: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_frame: frameId }),
      });
      if (res.ok) {
        await fetchProfile();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const currentFrame = FRAMES.find(f => f.id === profile?.avatarFrame) || FRAMES[0];

  if (!mounted) return null;

  return (
    <AppShell>
      <div className="space-y-10 pb-12">

        {/* Hero Card */}
        <section className="relative">
          <div className="rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10 border-2 filigree-border"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.4)" }}>

            {/* Character Portrait */}
            <div className="relative group shrink-0">
              {/* Spinning rings decoration */}
              <div className="absolute inset-[-25px] border rounded-full opacity-40"
                style={{ borderColor: "rgba(235,194,62,0.3)", animation: "spin 20s linear infinite" }} />
              <div className="absolute inset-[-15px] border-2 rounded-full opacity-20"
                style={{ borderColor: "rgba(81,97,97,0.2)", animation: "spin 15s linear infinite reverse" }} />

              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-2 flex items-center justify-center">
                {/* Profile Image */}
                <div className="w-[85%] h-[85%] rounded-full overflow-hidden border-2 border-white shadow-xl flex items-center justify-center relative bg-white/20">
                  {profile?.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt="Avatar" width={256} height={256} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary/40" style={{ fontSize: "80px" }}>person</span>
                  )}
                  
                  {/* Upload Overlay */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                  >
                    <span className="material-symbols-outlined text-3xl">upload</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Ganti Foto</span>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleUpload}
                    />
                  </div>
                  
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Avatar Frame Overlay */}
                {currentFrame.image && (
                  <Image 
                    src={currentFrame.image} 
                    alt="Frame" 
                    width={256}
                    height={256}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-110 drop-shadow-lg z-10"
                  />
                )}
                
                {/* Character name overlay */}
                <div className="absolute -bottom-2 left-0 right-0 text-center z-20">
                  <span className="bg-white/80 backdrop-blur-md text-primary px-6 py-1.5 rounded-full text-sm font-heading font-bold border border-primary/20 shadow-lg">
                    {profile?.username || "Traveler"}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full space-y-6">
              <div className="text-center md:text-left">
                <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary leading-none mb-1">{tier.title}</h1>
                <p className="text-on-surface-variant font-heading italic text-base">&quot;{t.quote}&quot;</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "workspace_premium", label: common.level, value: level, color: "var(--secondary)" },
                  { icon: "local_fire_department", label: t.streak, value: profile?.streak || 0, color: "teal" },
                  { icon: "auto_fix_high", label: t.affinity, value: "Aether", color: "var(--secondary)" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl text-center border"
                    style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.4)" }}>
                    <span className="material-symbols-outlined text-3xl mb-1 block"
                      style={{
                        color: s.color === "teal" ? "#0d9488" : s.color,
                        fontVariationSettings: "'FILL' 1"
                      }}>
                      {s.icon}
                    </span>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant font-heading">{s.label}</p>
                    <p className="font-heading font-bold text-lg" style={{ color: s.color === "teal" ? "#0f766e" : s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* EXP Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <span className="font-heading text-primary font-semibold text-sm">{t.discoveryProgress}</span>
                  <span className="text-xs text-on-surface-variant">{exp.toLocaleString()} / {expNeeded.toLocaleString()} EXP</span>
                </div>
                <div className="h-3 w-full rounded-full overflow-hidden p-px border border-white/60" style={{ background: "rgba(199,221,233,0.5)" }}>
                  <div className="h-full rounded-full shadow-sm transition-all duration-1000" style={{ width: `${expProgress}%`, background: "linear-gradient(90deg, #4db6ac, #ebc23e)", boxShadow: "0 0 8px rgba(115,92,0,0.25)" }} />
                </div>
              </div>
            </div>

            {/* Online badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl border"
              style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)", borderColor: "rgba(235,194,62,0.5)" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-teal-700 font-heading">ONLINE</span>
            </div>
          </div>
        </section>

        {/* Frames & Artifacts */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Avatar Frames Gallery */}
          <div className="rounded-3xl p-6 border flex flex-col"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.3)" }}>
            <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">verified</span>
              Aetheric Frames
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {FRAMES.map((f) => {
                const isLocked = level < f.level;
                const isSelected = profile?.avatarFrame === f.id || (f.id === 'none' && !profile?.avatarFrame);
                
                return (
                  <div 
                    key={f.id}
                    onClick={() => !isLocked && updateFrame(f.id)}
                    className={`relative aspect-square rounded-2xl border-2 transition-all duration-300 flex items-center justify-center p-2 cursor-pointer ${
                      isSelected ? "border-secondary bg-secondary/5 ring-2 ring-secondary/20" : "border-white/40 bg-white/20 hover:border-primary/20"
                    } ${isLocked ? "grayscale opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {f.image ? (
                      <Image src={f.image} alt={f.name} width={100} height={100} className="w-full h-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-primary/30">do_not_disturb_on</span>
                    )}
                    
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 rounded-2xl">
                        <span className="material-symbols-outlined text-sm text-primary">lock</span>
                        <span className="text-[8px] font-bold">LVL {f.level}</span>
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-secondary text-white w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                        <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-auto pt-4 text-[10px] text-on-surface-variant italic text-center">
              Level up to unlock more premium Aetheric frames.
            </p>
          </div>

          {/* Mastered Artifacts */}
          <div className="md:col-span-2 rounded-3xl p-6 border"
            style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.3)" }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-lg font-semibold text-primary">{t.masteredArtifacts}</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "storm", color: "text-amber-500", bg: "from-amber-50 to-amber-100", label: "Wind Wing" },
                { icon: "history_edu", color: "text-teal-500", bg: "from-teal-50 to-teal-100", label: "Time Core" },
                { icon: "psychiatry", color: "text-amber-500", bg: "from-amber-50 to-amber-100", label: "Sun Stone" },
                { icon: "ac_unit", color: "text-teal-500", bg: "from-teal-50 to-teal-100", label: "Frost Lily" },
              ].map((art) => (
                <div key={art.label}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 border-2 border-white cursor-pointer group hover:scale-105 transition-transform bg-gradient-to-br ${art.bg}`}
                  style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(8px)" }}>
                  <span className={`material-symbols-outlined text-4xl mb-1 ${art.color}`}>{art.icon}</span>
                  <span className="text-[10px] font-heading text-center text-on-surface-variant">{art.label}</span>
                </div>
              ))}
            </div>

            {/* Radar Chart */}
            <div className="mt-6 pt-5 border-t" style={{ borderColor: "rgba(114,120,120,0.15)" }}>
              <h4 className="font-heading text-sm font-semibold text-primary mb-3">{t.affinityMap}</h4>
              <div className="w-full flex justify-center">
                {profile && <AethericRadar stats={profile.stats} size={220} showLabels={true} />}
              </div>
            </div>
          </div>
        </section>

        {/* Archive Stats Row */}
        <section className="rounded-3xl p-8 border"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(224,242,241,0.3) 100%)", backdropFilter: "blur(24px)", borderColor: "rgba(255,255,255,0.3)" }}>
          <h3 className="font-heading text-lg font-semibold text-primary mb-6">{t.archiveStats}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: "explore", bg: "bg-amber-100", color: "text-secondary", label: t.worldExplored, value: "78%" },
              { icon: "history_edu", bg: "bg-teal-100", color: "text-teal-600", label: t.totalExp, value: profile?.exp?.toLocaleString() || 0 },
              { icon: "inventory_2", bg: "bg-slate-100", color: "text-slate-600", label: t.artifactsFound, value: "12/15" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} shadow-inner`}>
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-heading uppercase tracking-widest">{s.label}</p>
                  <p className="font-heading font-bold text-2xl text-primary">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
