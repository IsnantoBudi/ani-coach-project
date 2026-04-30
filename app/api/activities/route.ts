import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ActivityRow } from "@/types/db";

// ============================================================
// GET /api/activities — Get user's activity history
// ============================================================

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert to camelCase
  const formatted = (activities as ActivityRow[]).map((act) => ({
    id: act.id,
    userId: act.user_id,
    title: act.title,
    description: act.description,
    category: act.category,
    duration: act.duration,
    intensity: act.intensity,
    expGained: act.exp_gained,
    statsBoost: {
      str: act.boost_str,
      int: act.boost_int,
      vit: act.boost_vit,
      agi: act.boost_agi,
      chr: act.boost_chr,
    },
    kaitoDialog: act.kaito_dialog,
    kaitoExpression: act.kaito_expression,
    loggedAt: act.logged_at,
  }));

  return NextResponse.json({ activities: formatted });
}
