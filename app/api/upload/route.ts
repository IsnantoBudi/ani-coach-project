import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe filename
    const fileExtension = file.name.split('.').pop();
    const filename = `${user.id}_${Date.now()}.${fileExtension}`;
    const relativePath = join("uploads", filename);
    const absolutePath = join(process.cwd(), "public", relativePath);
    
    await writeFile(absolutePath, buffer);

    const url = `/uploads/${filename}`;
    
    // Attempt database updates but catch missing column errors
    try {
      // 1. Try to update avatar_url directly
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);

      // 2. Try to update stats JSON
      const { data: current } = await supabase.from("profiles").select("stats").eq("id", user.id).single();
      if (current) {
        const stats = { ...((current.stats as Record<string, unknown>) || {}) };
        stats.avatarUrl = url;
        await supabase.from("profiles").update({ stats: stats as any }).eq("id", user.id);
      }
    } catch (dbErr) {
      console.warn("Database sync failed (columns might be missing):", dbErr);
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
