"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, Diamond, ArrowRight, 
  Stars, LayoutDashboard, History, Trophy, Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "radial-gradient(circle at top right, #f3faff 0%, #e6f6ff 100%)" }}>
      
      {/* Decorative HUD Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-64 h-64 border-l border-t border-primary/20 rounded-tl-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 border-r border-b border-primary/20 rounded-br-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#516161 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      </div>

      {/* Top navigation */}
      <header className="fixed top-0 left-0 right-0 mx-4 z-50 flex justify-between items-center px-6 py-3 bg-white/30 backdrop-blur-3xl rounded-b-2xl border-b border-white/40 mt-2 shadow-xl shadow-primary/5 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-widest text-primary font-heading italic">AniCoach</span>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#features" className="font-heading tracking-tight text-xs uppercase text-on-surface-variant hover:text-primary transition-all font-bold">Features</Link>
          <Link href="#system" className="font-heading tracking-tight text-xs uppercase text-on-surface-variant hover:text-primary transition-all font-bold">The System</Link>
          <Link href="#preview" className="font-heading tracking-tight text-xs uppercase text-on-surface-variant hover:text-primary transition-all font-bold">Interface</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-primary text-white font-heading text-sm font-bold rounded-full shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            Enter System
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen pt-24 pb-20 px-6 z-10">
        <div className="max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-heading text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Stars className="w-3 h-3" />
              The Celestial Path Awaits
            </div>
            
            <h1 className="font-heading font-bold leading-[1.1] mb-8" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: "var(--primary)" }}>
              GAMIFY YOUR<br />
              <span className="text-secondary italic font-normal">REALITY</span>
            </h1>
            
            <p className="text-on-surface-variant text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
              Transform every daily task into an epic quest. Level up your real-life attributes, collect rare artifacts, and document your journey in a high-fidelity RPG experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/login"
                className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-heading font-bold text-lg rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Launch Adventure
                <LayoutDashboard className="w-5 h-5 transition-transform group-hover:rotate-12" />
              </Link>
              <Link
                href="#preview"
                className="w-full sm:w-auto px-10 py-5 bg-white/40 backdrop-blur-md text-primary font-heading font-bold text-lg rounded-2xl border border-white/50 hover:bg-white/60 transition-all flex items-center justify-center gap-3"
              >
                View HUD System
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="relative z-10 px-6 py-32 bg-white/20 backdrop-blur-sm border-y border-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Main Feature: Aetheric Radar */}
            <motion.div 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
              className="md:col-span-8 p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl filigree-border relative overflow-hidden group"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-primary">Aetheric Harmony System</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    Visualize your growth through the 5 core attributes: Strength, Intelligence, Vitality, Agility, and Charisma. Your radar evolves as you complete real-world challenges.
                  </p>
                  <ul className="space-y-3">
                    {['Dynamic Stat Updates', 'Grade Classification', 'Evolution Tracking'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-64 h-64 relative">
                  {/* Decorative Radar Visualization Placeholder */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-secondary/20 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-md">
                       <span className="material-symbols-outlined text-primary text-6xl opacity-20">hub</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sub Feature: Quest Journal */}
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 20 }}
              viewport={{ once: true }}
              className="md:col-span-4 p-8 rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark text-white shadow-2xl shadow-primary/20 relative overflow-hidden"
            >
              <History className="absolute top-[-20px] right-[-20px] w-40 h-40 text-white/5 rotate-12" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-heading font-bold mb-4">Quest Management</h4>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    Turn your to-do list into a quest log. Earn EXP and Mora for every finished task.
                  </p>
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs flex justify-between items-center">
                      <span>Daily Commission #{i}</span>
                      <span className="text-amber-400 font-bold">+150 XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sub Feature: Artifacts */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="md:col-span-4 p-8 rounded-[2rem] bg-white/60 backdrop-blur-md border border-white/50 shadow-xl"
            >
              <Trophy className="text-secondary w-10 h-10 mb-6" />
              <h4 className="text-xl font-heading font-bold text-primary mb-3">Celestial Artifacts</h4>
              <p className="text-on-surface-variant text-sm mb-6">
                Unlock legendary badges as you reach milestones. Build a collection of your achievements.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                    <Diamond className="w-5 h-5 text-secondary" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sub Feature: Kaito */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className="md:col-span-8 p-10 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
                  <span className="material-symbols-outlined text-primary text-6xl">smart_toy</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-heading font-bold text-primary">Kaito: Your AI Companion</h4>
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    Interact with Kaito, your celestial guide. Kaito monitors your progress, provides insights, and reacts to your achievements in real-time.
                  </p>
                  <div className="p-4 bg-white/50 rounded-2xl border border-white/50 italic text-sm text-primary/70">
                    &quot;Welcome back, Traveler. Your aetheric signature has grown stronger today.&quot;
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-primary">Ready to Level Up?</h2>
          <p className="text-on-surface-variant text-xl max-w-xl mx-auto">
            Join thousands of travelers transforming their lives into an unforgettable RPG adventure.
          </p>
          <Link
            href="/login"
            className="inline-flex px-12 py-6 bg-primary text-white font-heading font-bold text-2xl rounded-3xl shadow-[0_20px_50px_rgba(81,97,97,0.3)] hover:scale-110 active:scale-95 transition-all"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/30 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest text-primary font-heading italic">AniCoach</span>
          </div>
          <p className="font-heading text-xs text-on-surface-variant italic tracking-wider opacity-60">
            © 2026 AniCoach. Documented in the 42nd Celestial Archive.
          </p>
          <div className="flex gap-6">
             <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">Dashboard</Link>
             <Link href="/profile" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">Traveler</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
