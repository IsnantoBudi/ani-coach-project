import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLevelFromExp, applyStatsBoost } from "@/lib/utils/game";

// ============================================================
// GET /api/quests — Get user's quests for today
// ============================================================

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: quests, error } = await supabase
    .from("quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("generated_at", today)
    .order("difficulty", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert to camelCase
  const formatted = quests.map((q) => ({
    id: q.id,
    userId: q.user_id,
    title: q.title,
    description: q.description,
    category: q.category,
    expReward: q.exp_reward,
    statsBoost: {
      str: q.boost_str,
      int: q.boost_int,
      vit: q.boost_vit,
      agi: q.boost_agi,
      chr: q.boost_chr,
    },
    difficulty: q.difficulty,
    status: q.status,
    generatedAt: q.generated_at,
    completedAt: q.completed_at,
  }));

  return NextResponse.json({ quests: formatted });
}

// ============================================================
// PATCH /api/quests — Mark quest as completed
// ============================================================

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.quest_id) {
    return NextResponse.json({ error: "Missing quest_id" }, { status: 400 });
  }

  // Fetch the quest
  const { data: quest, error: fetchError } = await supabase
    .from("quests")
    .select("*")
    .eq("id", body.quest_id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  if (quest.status === "completed") {
    return NextResponse.json({ error: "Quest already completed" }, { status: 400 });
  }

  // Update quest status
  const { data: updatedQuest, error: updateError } = await supabase
    .from("quests")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", quest.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Update user profile stats and rewards
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    
  if (profile) {
    const newExp = profile.exp + (quest.exp_reward ?? 0);
    const newLevel = getLevelFromExp(newExp);
    const newStats = applyStatsBoost(
      {
        str: profile.stat_str ?? 0,
        int: profile.stat_int ?? 0,
        vit: profile.stat_vit ?? 0,
        agi: profile.stat_agi ?? 0,
        chr: profile.stat_chr ?? 0,
      },
      {
        str: quest.boost_str || 0,
        int: quest.boost_int || 0,
        vit: quest.boost_vit || 0,
        agi: quest.boost_agi || 0,
        chr: quest.boost_chr || 0,
      }
    );
    
    await supabase
      .from("profiles")
      .update({
        exp: newExp,
        level: newLevel,
        mora: (profile.mora ?? 0) + ((quest.exp_reward ?? 0) / 2),
        stat_str: newStats.str,
        stat_int: newStats.int,
        stat_vit: newStats.vit,
        stat_agi: newStats.agi,
        stat_chr: newStats.chr,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true, quest: updatedQuest });
}
