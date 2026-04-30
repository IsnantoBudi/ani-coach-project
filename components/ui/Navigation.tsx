"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { translations } from "@/lib/translations";

const navLinks = [
  { href: "/dashboard", labelKey: "adventures", icon: "explore" },
  { href: "/log", labelKey: "quests", icon: "menu_book" },
  { href: "/profile", labelKey: "traveler", icon: "person" },
  { href: "/leaderboard", labelKey: "leaderboard", icon: "leaderboard" },
];

const FRAMES = [
  { id: 'none', image: null },
  { id: 'bronze', image: '/frame/bronze.png' },
  { id: 'silver', image: '/frame/silver.png' },
  { id: 'gold', image: '/frame/gold.png' },
  { id: 'platinum', image: '/frame/platinum.png' },
  { id: 'legend', image: '/frame/legend.png' },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, language, isSidebarCollapsed, toggleSidebar } = useGameStore();
  const t = translations[language].nav;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const currentFrame = profile?.avatarFrame ? FRAMES.find(f => f.id === profile.avatarFrame) : null;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 80 : 256,
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -256 : 0)
        }}
        className={`
          fixed left-0 top-0 h-full z-50 flex flex-col p-4
          bg-white/10 backdrop-blur-3xl
          border-r border-amber-200/30 rounded-r-3xl shadow-2xl
          transition-colors duration-300
          ${!isOpen && "max-lg:-translate-x-full"}
        `}
      >
        {/* Toggle Collapse Button (Desktop) */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-amber-400 text-white rounded-full p-1 shadow-md z-50 hidden lg:flex hover:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined text-sm">
            {isSidebarCollapsed ? "chevron_right" : "chevron_left"}
          </span>
        </button>

        {/* Avatar section */}
        <div className={`flex flex-col items-center mb-8 pb-6 border-b border-white/20 pt-4 ${isSidebarCollapsed ? 'px-0' : 'px-2'}`}>
          <Link href="/profile" className={`relative ${isSidebarCollapsed ? 'w-12 h-12' : 'w-24 h-24'} mb-3 transition-all duration-300 group`}>
            {/* Frame Layer */}
            {currentFrame?.image && (
              <Image 
                src={currentFrame.image} 
                alt="Frame" 
                width={128}
                height={128}
                className="absolute inset-[-12%] w-[124%] h-[124%] max-w-none z-10 pointer-events-none"
              />
            )}
            
            {/* Profile Image Layer */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-900 to-slate-800 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden relative">
              {profile?.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className={`material-symbols-outlined text-amber-400 ${isSidebarCollapsed ? 'text-xl' : 'text-3xl'}`}>person</span>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs">edit</span>
              </div>
            </div>
          </Link>
          
          {!isSidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center whitespace-nowrap"
            >
              <h2 className="font-heading text-primary text-lg font-semibold truncate max-w-[180px]">
                {profile?.username || "Traveler"}
              </h2>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded bg-primary text-white">Lv. {profile?.level || 1}</span>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">{t.scholarly}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const label = t[link.labelKey as keyof typeof t];
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 relative group
                  ${isActive
                    ? "bg-amber-400/20 text-primary border-r-4 border-amber-400 font-semibold"
                    : "text-slate-500 hover:bg-amber-50/10 hover:text-primary"
                  }
                `}
              >
                <span className={`material-symbols-outlined ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-amber-400'}`}>
                  {link.icon}
                </span>
                
                {!isSidebarCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-heading text-sm whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}

                {/* Tooltip for collapsed state */}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button Removed */}

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-white/10 w-full">
          <button 
            onClick={handleLogout}
            className={`
            w-full flex items-center gap-4 px-3 py-3 text-slate-500 hover:text-red-400 transition-all text-sm font-heading
            ${isSidebarCollapsed ? 'justify-center' : ''}
          `}>
            <span className="material-symbols-outlined text-xl">logout</span>
            {!isSidebarCollapsed && <span>{t.logout}</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { language, setLanguage, isSidebarCollapsed } = useGameStore();
  const pathname = usePathname();
  const t = translations[language].nav;

  const currentPageKey = navLinks.find((l) => l.href === pathname)?.labelKey;
  const currentPage = currentPageKey ? t[currentPageKey as keyof typeof t] : t.adventures;

  return (
    <header 
      className={`
        fixed top-0 right-0 z-40 flex justify-between items-center px-6 py-3 
        bg-white/20 backdrop-blur-2xl border-b border-amber-200/40 mt-2 mx-4 rounded-xl shadow-lg
        transition-all duration-300
        ${isSidebarCollapsed ? 'left-20' : 'left-64'}
        max-lg:left-0
      `}
    >
      {/* Left: Brand + Page Nav */}
      <div className="flex items-center gap-6">
        <button
          className="p-2 -ml-2 lg:hidden text-primary"
          onClick={onMenuClick}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-xl font-bold tracking-tighter text-primary font-heading italic hidden lg:block bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
          AniCoach
        </h1>
        <div className="h-4 w-[1px] bg-amber-200/50 hidden md:block" />
        <span className="text-sm font-heading uppercase text-slate-600 font-semibold tracking-widest hidden md:block">
          {currentPage}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <div className="flex items-center bg-white/40 rounded-full p-1 border border-amber-200/30 shadow-inner">
          <button
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
              language === "ID"
                ? "bg-amber-400 text-white shadow-md"
                : "text-slate-500 hover:text-amber-600"
            }`}
            onClick={() => setLanguage("ID")}
          >
            ID
          </button>
          <button
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
              language === "EN"
                ? "bg-amber-400 text-white shadow-md"
                : "text-slate-500 hover:text-amber-600"
            }`}
            onClick={() => setLanguage("EN")}
          >
            EN
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/30">
          <span className="material-symbols-outlined text-amber-500 text-lg">auto_awesome</span>
        </div>
      </div>
    </header>
  );
}
