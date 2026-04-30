"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { translations } from "@/lib/translations";
import { isKaitoAdviceResponse } from "@/lib/utils/type-guards";
import type { Quest } from "@/types";

type MenuStage = "main" | "difficulty" | "category" | "quest_preview";

export default function KaitoCompanion() {
  const { 
    language,
    kaitoDialog, 
    kaitoExpression, 
    isKaitoThinking, 
    summonKaito, 
    setKaitoState,
    takeSuggestedQuest
  } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuStage, setMenuStage] = useState<MenuStage>("main");
  const [suggestedQuests, setSuggestedQuests] = useState<Partial<Quest>[]>([]);

  const t = translations[language].kaito;

  const [prevDialog, setPrevDialog] = useState<string | null>(null);

  if (kaitoDialog !== prevDialog) {
    setPrevDialog(kaitoDialog);
    if (kaitoDialog && !isOpen) {
      setIsOpen(true);
      setShowMenu(false);
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setShowMenu(true);
      setMenuStage("main");
      setSuggestedQuests([]);
      setKaitoState("idle", t.defaultDialog);
    } else {
      setIsOpen(false);
      setShowMenu(false);
      setKaitoState("idle", null);
    }
  };

  const handleAction = async (type: "get_advice" | "generate_custom_quest" | "motivation", options = {}) => {
    setShowMenu(false);
    setMenuStage("main");
    
    const result = await summonKaito(type, options);
    
    if (result && isKaitoAdviceResponse(result) && result.suggested_quests) {
      const mappedQuests: Partial<Quest>[] = result.suggested_quests.map(q => ({
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        expReward: q.exp_reward,
        statsBoost: q.stats_boost
      }));
      setSuggestedQuests(mappedQuests);
      setMenuStage("quest_preview");
    }
  };

  const handleTakeQuest = async (quest: Partial<Quest>) => {
    await takeSuggestedQuest(quest);
    setSuggestedQuests([]);
    setMenuStage("main");
  };

  const categories = [
    { id: "olahraga", label: "Strength (STR)", icon: "fitness_center", color: "text-red-500" },
    { id: "belajar", label: "Intelligence (INT)", icon: "school", color: "text-blue-500" },
    { id: "istirahat", label: "Vitality (VIT)", icon: "bedtime", color: "text-green-500" },
    { id: "kerja", label: "Agility (AGI)", icon: "speed", color: "text-amber-500" },
    { id: "sosial", label: "Charisma (CHR)", icon: "groups", color: "text-pink-500" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 20, scale: 0.9, filter: "blur(10px)" }}
            className="mr-6 w-[340px] bg-white/95 backdrop-blur-xl p-6 rounded-3xl rounded-br-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-primary/20 relative filigree-border max-h-[85vh] flex flex-col"
          >
            <div className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isKaitoThinking ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-xs font-heading text-primary/60 font-bold uppercase tracking-widest text-center">
                    {kaitoDialog?.includes("Menerawang") || kaitoDialog?.includes("Seeing") ? t.thinkingQuest : t.thinking}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-on-background font-medium leading-relaxed italic mb-4">
                    &quot;{kaitoDialog || t.defaultDialog}&quot;
                  </p>

                  {showMenu && (
                    <div className="space-y-3 mt-4">
                      {menuStage === "main" && (
                        <>
                          <button
                            onClick={() => setMenuStage("difficulty")}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-all text-left border border-amber-200/50"
                          >
                            <span className="material-symbols-outlined text-amber-600">lightbulb</span>
                            <div className="flex-1">
                              <p className="text-xs font-heading font-bold text-amber-700">{t.menu.advice}</p>
                              <p className="text-[10px] text-amber-600/70 italic">Cari misi berdasarkan kesulitan</p>
                            </div>
                          </button>
                          <button
                            onClick={() => setMenuStage("category")}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-left border border-primary/20"
                          >
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            <div className="flex-1">
                              <p className="text-xs font-heading font-bold text-primary">{t.menu.customQuest}</p>
                              <p className="text-[10px] text-primary/70 italic">Misi spesifik untuk meningkatkan stat</p>
                            </div>
                          </button>
                          <button
                            onClick={() => handleAction("motivation")}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-all text-left border border-red-200/50"
                          >
                            <span className="material-symbols-outlined text-red-500">favorite</span>
                            <p className="text-xs font-heading font-bold text-red-600">{t.menu.motivation}</p>
                          </button>
                        </>
                      )}

                      {menuStage === "difficulty" && (
                        <div className="space-y-2">
                          <button onClick={() => setMenuStage("main")} className="text-[10px] text-primary flex items-center gap-1 mb-2 font-bold uppercase">
                            <span className="material-symbols-outlined text-xs">arrow_back</span> Kembali
                          </button>
                          {["Easy", "Normal", "Challenging"].map(diff => (
                            <button
                              key={diff}
                              onClick={() => handleAction("get_advice", { difficulty: diff })}
                              className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left flex justify-between items-center border border-gray-200"
                            >
                              <span className="text-xs font-heading font-bold text-gray-700">{diff}</span>
                              <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {menuStage === "category" && (
                        <div className="space-y-2">
                          <button onClick={() => setMenuStage("main")} className="text-[10px] text-primary flex items-center gap-1 mb-2 font-bold uppercase">
                            <span className="material-symbols-outlined text-xs">arrow_back</span> Kembali
                          </button>
                          {categories.map(cat => (
                            <button
                              key={cat.id}
                              onClick={() => handleAction("generate_custom_quest", { category: cat.id })}
                              className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left flex items-center gap-3 border border-gray-200"
                            >
                              <span className={`material-symbols-outlined ${cat.color}`}>{cat.icon}</span>
                              <span className="text-xs font-heading font-bold text-gray-700">{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {menuStage === "quest_preview" && suggestedQuests.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Pilih Misimu:</p>
                          {suggestedQuests.map((quest, idx) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx}
                              className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-all"
                            >
                              <h4 className="text-xs font-bold text-primary mb-1">{quest.title}</h4>
                              <p className="text-[10px] text-on-surface-variant mb-3">{quest.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-secondary">{quest.expReward} EXP</span>
                                <button
                                  onClick={() => handleTakeQuest(quest)}
                                  className="px-3 py-1.5 bg-primary text-white text-[9px] font-bold rounded-lg hover:scale-105 active:scale-95 transition-all"
                                >
                                  Terima Misi
                                </button>
                              </div>
                            </motion.div>
                          ))}
                          <button 
                            onClick={() => setMenuStage("main")}
                            className="w-full text-center text-[10px] font-bold text-on-surface-variant/60 uppercase mt-2"
                          >
                            Mungkin Nanti
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {!showMenu && kaitoDialog && (
                    <button 
                      onClick={() => {
                        setShowMenu(true);
                        setMenuStage("main");
                        setSuggestedQuests([]);
                      }}
                      className="mt-6 text-[10px] font-heading font-bold text-primary uppercase tracking-tighter flex items-center gap-1 hover:gap-2 transition-all w-full justify-center py-2 border-t border-primary/10"
                    >
                      {t.backToMenu} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="absolute bottom-6 -right-2 w-4 h-4 bg-white border-r border-t border-primary/20 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-32 h-32 flex items-end justify-center overflow-visible">
        <motion.button
          onClick={handleToggle}
          animate={{ 
            scale: isOpen ? 1.4 : 1,
            backgroundColor: isOpen ? "rgba(81, 97, 97, 0.15)" : "rgba(255, 255, 255, 0.4)",
            width: isOpen ? 100 : 80,
            height: isOpen ? 100 : 80,
          }}
          className="absolute bottom-0 rounded-full border-2 border-primary/30 shadow-2xl backdrop-blur-md z-0 overflow-hidden flex items-center justify-center"
        >
          <div className={`absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        </motion.button>

        <motion.div
          animate={{ 
            y: isOpen ? -20 : -10, 
            scale: isOpen ? 1.6 : 0.4,
            filter: isOpen ? "drop-shadow(0 20px 30px rgba(0,0,0,0.4))" : "drop-shadow(0 5px 10px rgba(0,0,0,0.1))",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="relative z-10 w-32 h-56 pointer-events-none flex items-end justify-center"
          style={{ transformOrigin: "bottom center" }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full flex items-end justify-center"
          >
            <Image
              src="/avatar.png"
              alt="Kaito"
              width={200}
              height={400}
              priority
              className={`object-contain object-bottom transition-all duration-500 ${isOpen ? '' : 'grayscale-[5%]'}`}
            />
          </motion.div>
        </motion.div>

        <button 
          onClick={handleToggle}
          className="absolute bottom-0 w-24 h-24 z-20 rounded-full cursor-pointer"
        />

        {isOpen && kaitoExpression && kaitoExpression !== "idle" && (
          <motion.div 
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -170, opacity: 1 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-40"
          >
             <span className="px-3 py-1 bg-primary text-white rounded-full shadow-lg text-[10px] font-heading font-bold border border-white/20 whitespace-nowrap uppercase tracking-widest">
               {t.expressions[kaitoExpression as keyof typeof t.expressions] || kaitoExpression.toUpperCase()} ✨
             </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
