"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError("Registrasi berhasil! Silakan login (Atau cek email jika konfirmasi diaktifkan).");
        setIsLogin(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat autentikasi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" 
      style={{ 
        background: "radial-gradient(circle at top right, #f3faff 0%, #e6f6ff 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(81, 97, 97, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(253, 211, 77, 0.04) 0%, transparent 50%)
        `
      }}>
      
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl filigree-border relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(24px)", border: "1px solid rgba(235,194,62,0.3)" }}>
        
        {/* Decorative Blur */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-50 pointer-events-none" style={{ background: "var(--primary-container)" }} />
        
        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #fdd34d 0%, #ebc23e 100%)" }}>
            <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            {isLogin ? "Welcome Back" : "Begin Journey"}
          </h1>
          <p className="text-sm text-on-surface-variant font-heading italic">
            {isLogin ? "Continue your ascent to the stars." : "Step into the celestial archives."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm text-center font-heading" 
            style={{ background: error.includes("berhasil") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: error.includes("berhasil") ? "#047857" : "#b91c1c" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-lg">mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 pl-12 font-heading text-primary focus:outline-none focus:ring-2 text-base"
                style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
                placeholder="traveler@aether.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-lg">lock</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 pl-12 font-heading text-primary focus:outline-none focus:ring-2 text-base"
                style={{ background: "rgba(0,0,0,0.04)", border: "none" }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl font-heading font-semibold text-sm text-on-primary shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            style={{ background: "var(--primary)" }}>
            <span>{loading ? "Menghubungkan..." : (isLogin ? "Sign In" : "Sign Up")}</span>
            {!loading && <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-heading font-semibold text-secondary hover:underline">
            {isLogin ? "New to the archives? Create an account." : "Already have an account? Sign in."}
          </button>
        </div>
      </div>
    </div>
  );
}
