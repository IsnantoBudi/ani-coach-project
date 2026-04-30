import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================================
// GET /api/leaderboard — Get weekly top 10 leaderboard
// ============================================================

export async function GET() {
  const supabase = await createClient();

  // In a real app, this would query a cached table or view.
  // For the demo, we just get top 10 profiles by EXP.
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, username, level, exp")
    .order("exp", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format response matching LeaderboardEntry interface
  const formatted = profiles.map((p, idx) => ({
    userId: p.id,
    username: p.username,
    level: p.level,
    expWeek: p.exp, // using total exp for demo
    rank: idx + 1,
  }));

  return NextResponse.json({ leaderboard: formatted });
}
