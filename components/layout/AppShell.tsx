"use client";

import { useState } from "react";
import { Sidebar, Topbar } from "@/components/ui/Navigation";
import { useGameStore } from "@/store/gameStore";
import KaitoCompanion from "@/components/kaito/KaitoCompanion";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSidebarCollapsed } = useGameStore();

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(circle at top right, #f3faff 0%, #e6f6ff 100%)" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />

      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} pt-24 px-6 md:px-8 pb-10 min-h-screen`} style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(81, 97, 97, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(253, 211, 77, 0.04) 0%, transparent 50%)
        `
      }}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Interactive Kaito Companion */}
      <KaitoCompanion />
    </div>
  );
}
