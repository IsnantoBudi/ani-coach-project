import { NextRequest, NextResponse } from "next/server";
import { callGroq, callGemini } from "@/lib/ai/router";
import { getMockResponse } from "@/lib/ai/mock";
import { createClient } from "@/lib/supabase/server";
import { getLevelFromExp, applyStatsBoost } from "@/lib/utils/game";
import type { KaitoRequest, KaitoResponse, KaitoQuestsResponse, Category, Intensity } from "@/types";

// ============================================================
// POST /api/kaito
// 3-Layer AI Fallback: Groq → Gemini → Mock
// ============================================================

export async function POST(req: NextRequest) {
  let body: KaitoRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.task_type || !body.user) {
    return NextResponse.json({ error: "Missing task_type or user" }, { status: 400 });
  }

  let result: KaitoResponse | KaitoQuestsResponse;
  let provider = "mock";

  // ----- Layer 1: Groq Primary -----
  if (process.env.GROQ_API_KEY) {
    try {
      result = await callGroq(body);
      provider = "groq";
    } catch (e) {
      console.warn("[Kaito] Groq failed, trying Gemini:", (e as Error).message);

      // ----- Layer 2: Gemini Fallback -----
      if (process.env.GEMINI_API_KEY) {
        try {
          result = await callGemini(body);
          provider = "gemini";
        } catch (e2) {
          console.warn("[Kaito] Gemini failed, using mock:", (e2 as Error).message);
          result = getMockResponse(body.task_type);
        }
      } else {
        result = getMockResponse(body.task_type);
      }
    }
  } else {
    // No Groq key configured
    if (process.env.GEMINI_API_KEY) {
      try {
        result = await callGemini(body);
        provider = "gemini";
      } catch {
        result = getMockResponse(body.task_type);
      }
    } else {
      result = getMockResponse(body.task_type);
    }
  }

  // ----- Persist to Supabase if authenticated -----
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && body.task_type === "log_activity" && "exp" in result) {
      const kaitoResult = result as KaitoResponse;

      // Fetch current profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const newExp = profile.exp + kaitoResult.exp;
        const newLevel = getLevelFromExp(newExp);
        const newStats = applyStatsBoost(
          {
            str: profile.stat_str ?? 0,
            int: profile.stat_int ?? 0,
            vit: profile.stat_vit ?? 0,
            agi: profile.stat_agi ?? 0,
            chr: profile.stat_chr ?? 0,
          },
          kaitoResult.stats_boost
        );

        // Update profile
        await supabase
          .from("profiles")
          .update({
            exp: newExp,
            level: newLevel,
            stat_str: newStats.str,
            stat_int: newStats.int,
            stat_vit: newStats.vit,
            stat_agi: newStats.agi,
            stat_chr: newStats.chr,
            last_login: new Date().toISOString().split("T")[0],
          })
          .eq("id", user.id);

        // Insert activity log
        if (body.input) {
          await supabase.from("activities").insert({
            user_id: user.id,
            title: body.input,
            description: null, // Explicitly provide null for required field
            category: (body.context as Category) || "olahraga",
            duration: parseInt((body.metadata?.duration as string) || "30"),
            intensity: (body.metadata?.intensity as Intensity) || "sedang",
            exp_gained: kaitoResult.exp,
            boost_str: kaitoResult.stats_boost.str,
            boost_int: kaitoResult.stats_boost.int,
            boost_vit: kaitoResult.stats_boost.vit,
            boost_agi: kaitoResult.stats_boost.agi,
            boost_chr: kaitoResult.stats_boost.chr,
            kaito_dialog: kaitoResult.dialog,
            kaito_expression: kaitoResult.expression,
          });
        }
      }
    }

    // Persist quests if generated
    if (user && body.task_type === "generate_quests" && "quests" in result) {
      const questsResult = result as KaitoQuestsResponse;
      const today = new Date().toISOString().split("T")[0];

      // Delete old active quests for today
      await supabase
        .from("quests")
        .delete()
        .eq("user_id", user.id)
        .eq("generated_at", today)
        .eq("status", "active");

      // Insert new quests
      await supabase.from("quests").insert(
        questsResult.quests.map((q) => ({
          user_id: user.id,
          title: q.title,
          description: q.description,
          category: q.category,
          difficulty: q.difficulty,
          exp_reward: q.exp_reward,
          boost_str: q.stats_boost?.str || 0,
          boost_int: q.stats_boost?.int || 0,
          boost_vit: q.stats_boost?.vit || 0,
          boost_agi: q.stats_boost?.agi || 0,
          boost_chr: q.stats_boost?.chr || 0,
          generated_at: today,
          status: "active" as const,
          completed_at: null, // Explicitly provide null for required field
        }))
      );
    }
  } catch (dbErr) {
    // DB errors are non-fatal — AI response still returned
    console.warn("[Kaito] DB persist error (non-fatal):", (dbErr as Error).message);
  }

  return NextResponse.json({ ...result, provider });
}

// ============================================================
// GET /api/kaito — Health check
// ============================================================

export async function GET() {
  return NextResponse.json({
    status: "ok",
    providers: {
      groq: !!process.env.GROQ_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      mock: true,
    },
  });
}
