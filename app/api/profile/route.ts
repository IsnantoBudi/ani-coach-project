import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";

// ============================================================
// GET /api/profile — Get authenticated user's profile
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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Use separate columns as primary source, fallback to stats JSON if it exists
  const statsJson = (profile.stats as Record<string, unknown>) ?? {};

  return NextResponse.json({
    id: profile.id,
    username: profile.username,
    level: profile.level,
    exp: profile.exp,
    streak: profile.streak,
    mora: profile.mora,
    primogems: profile.primogems,
    stats: {
      str: profile.stat_str ?? statsJson.str ?? 0,
      int: profile.stat_int ?? statsJson.int ?? 0,
      vit: profile.stat_vit ?? statsJson.vit ?? 0,
      agi: profile.stat_agi ?? statsJson.agi ?? 0,
      chr: profile.stat_chr ?? statsJson.chr ?? 0,
    },
    avatarUrl: statsJson.avatarUrl || profile.avatar_url || null,
    avatarFrame: statsJson.avatarFrame || profile.avatar_frame || null,
    lastLogin: profile.last_login,
  });
}

// ============================================================
// PATCH /api/profile — Update profile fields
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

  type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
  const body = await req.json();
  const updates: ProfileUpdate = {};

  if (body.username !== undefined) updates.username = body.username;

  // Try to update separate columns if provided
  if (body.stat_str !== undefined) updates.stat_str = body.stat_str;
  if (body.stat_int !== undefined) updates.stat_int = body.stat_int;
  if (body.stat_vit !== undefined) updates.stat_vit = body.stat_vit;
  if (body.stat_agi !== undefined) updates.stat_agi = body.stat_agi;
  if (body.stat_chr !== undefined) updates.stat_chr = body.stat_chr;

  // For avatar_url and avatar_frame, we'll try to update them but catch errors
  // since the columns might not exist yet.
  const avatarUpdates: ProfileUpdate = {};
  if (body.avatar_url !== undefined) avatarUpdates.avatar_url = body.avatar_url;
  if (body.avatar_frame !== undefined) avatarUpdates.avatar_frame = body.avatar_frame;

  try {
    // First update known safe fields
    if (Object.keys(updates).length > 0) {
      await supabase.from("profiles").update(updates).eq("id", user.id);
    }

    // Then try avatar fields (might fail if columns missing)
    if (Object.keys(avatarUpdates).length > 0) {
      const { error: avatarError } = await supabase
        .from("profiles")
        .update(avatarUpdates)
        .eq("id", user.id);
      
      if (avatarError) {
        console.warn("Avatar columns missing, update skipped:", avatarError.message);
      }
    }

    // Also try to update stats JSON if it exists
    if (body.avatar_url !== undefined || body.avatar_frame !== undefined) {
      const { data: current } = await supabase.from("profiles").select("stats").eq("id", user.id).single();
      if (current) {
        const newStats = { ...((current.stats as Record<string, unknown>) || {}) };
        if (body.avatar_url) newStats.avatarUrl = body.avatar_url;
        if (body.avatar_frame) newStats.avatarFrame = body.avatar_frame;
        
        const { error: statsError } = await supabase.from("profiles").update({ stats: newStats as Json }).eq("id", user.id);
        if (statsError) {
          console.warn("Stats column missing, update skipped:", statsError.message);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Profile PATCH error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
