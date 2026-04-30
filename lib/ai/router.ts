import type { KaitoRequest, KaitoResponse, KaitoQuestsResponse, Stats } from "@/types";

// ============================================================
// System Prompt Builder — Kaito's Core Identity
// ============================================================

function buildSystemPrompt(req: KaitoRequest): string {
  const { user } = req;
  const statsStr = `STR:${user.stats.str} INT:${user.stats.int} VIT:${user.stats.vit} AGI:${user.stats.agi} CHR:${user.stats.chr}`;

  const langName = req.language === "EN" ? "English" : "Bahasa Indonesia";

  return `You are Kaito (海斗), the AI life coach mascot of AniCoach — a life gamification app.
Personality: Confident but caring, witty, occasionally sarcastic. Like Zhongli meets Aether (Genshin Impact).
Always respond in ${langName}. Be short, punchy, and impactful — maximum 2 sentences per dialog.
Never break character. Never say you are an AI or language model.

Context:
User: ${user.name} | Level: ${user.level} | Streak: ${user.streak} days
Stats: ${statsStr}

Return ONLY valid JSON (no markdown code blocks, no extra text outside JSON):
${getResponseSchema(req)}`;
}

function getResponseSchema(req: KaitoRequest): string {
  const { task_type: taskType, language } = req;
  const langPrompt = language === "EN" ? "English" : "Bahasa Indonesia";

  if (taskType === "generate_quests") {
    return `{
  "quests": [
    {
      "title": "<quest title>", 
      "description": "<1 sentence>", 
      "category": "<olahraga|belajar|kerja|sosial|istirahat|kreatif>", 
      "difficulty": "<ringan|sedang|epik>", 
      "exp_reward": <50|120|300>,
      "stats_boost": {"str": <0-5>, "int": <0-5>, "vit": <0-5>, "agi": <0-5>, "chr": <0-5>}
    },
    {"title": "...", "description": "...", "category": "...", "difficulty": "...", "exp_reward": ..., "stats_boost": {...}},
    {"title": "...", "description": "...", "category": "...", "difficulty": "...", "exp_reward": ..., "stats_boost": {...}}
  ],
  "greeting": "<Kaito morning greeting, 1 sentence>",
  "expression": "<idle|excited|serious|happy|disappointed|shocked>"
}`;
  }

  if (taskType === "get_advice") {
    return `{
      "expression": "KaitoExpression (excited, idle, thinking, serious, disappointed)",
      "dialog": "Motivational advice or feedback in ${langPrompt}",
      "suggested_quests": [
        {
          "title": "Quest Title",
          "description": "Short action-oriented description",
          "category": "olahraga | belajar | istirahat | kerja | sosial",
          "difficulty": "ringan | sedang | epik",
          "exp_reward": number,
          "stats_boost": {"str": number, "int": number, "vit": number, "agi": number, "chr": number}
        }
      ] (optional: only if difficulty or specific quest advice is requested)
    }`;
  }

  return `{
  "exp": <integer 0-500>,
  "stats_boost": {"str": <0-5>, "int": <0-5>, "vit": <0-5>, "agi": <0-5>, "chr": <0-5>},
  "dialog": "<Kaito's response, max 2 sentences in Bahasa Indonesia>",
  "expression": "<idle|excited|serious|happy|disappointed|shocked>"
}`;
}

function buildUserMessage(req: KaitoRequest): string {
  const { task_type, input, context } = req;

  const messages: Record<string, string> = {
    log_activity: `User baru saja menyelesaikan aktivitas: "${input || "aktivitas tidak disebutkan"}". Hitung EXP yang layak dan berikan komentar motivasi spesifik tentang aktivitas tersebut. Pertimbangkan durasi dan intensitas.`,
    generate_quests: `Generate 3 quest harian yang dipersonalisasi untuk user ini. Buat berdasarkan stats terlemah dan konteks: ${context || "tidak ada konteks khusus"}. Variasikan tingkat kesulitan.`,
    get_advice: `User meminta saran atau motivasi. Berikan saran tentang quest yang harus diprioritaskan atau berikan semangat berdasarkan stats: ${context || "tidak ada konteks"}.`,
    level_up: `User baru saja naik ke level ${req.user.level}! Berikan dialog celebrasi yang menginspirasi dan relevan dengan pencapaiannya.`,
    streak_broken: `Streak user terputus setelah ${context || "beberapa"} hari. Berikan dialog motivasi yang empatis tapi tetap mendorong untuk kembali aktif.`,
    onboarding: `User baru pertama kali bergabung. Jawaban onboarding mereka: "${input}". Sambut mereka dan jelaskan build karakter awal mereka secara singkat.`,
    weekly_recap: `Rangkum minggu user ini. Data: ${context || "tidak ada data khusus"}. Berikan narasi recap dan saran untuk minggu depan.`,
    reaction: `Event/Context: "${input || context}". Berikan respons kontekstual Kaito yang sesuai. Jika context berisi instruksi khusus (seperti motivasi atau quest khusus), ikuti instruksi tersebut.`,
  };

  let prompt = messages[task_type] ?? messages.reaction;
  if (context) prompt += `\n\nKonteks tambahan/Instruksi: ${context}`;
  
  return prompt;
}

// ============================================================
// LAYER 1: Groq Primary (Llama 3.3 70B)
// 200-500 tokens/sec, 14,400 req/day, no credit card
// ============================================================

export async function callGroq(
  req: KaitoRequest
): Promise<KaitoResponse | KaitoQuestsResponse> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: buildSystemPrompt(req) },
        { role: "user", content: buildUserMessage(req) },
      ],
      max_tokens: 500,
      temperature: 0.8,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(8000), // 8s timeout
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned empty content");

  return JSON.parse(content);
}

// ============================================================
// LAYER 2: Gemini Fallback (Gemini 2.5 Flash-Lite)
// 1,000 req/day, no credit card
// ============================================================

export async function callGemini(
  req: KaitoRequest
): Promise<KaitoResponse | KaitoQuestsResponse> {
  const prompt = `${buildSystemPrompt(req)}\n\n${buildUserMessage(req)}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(10000), // 10s timeout
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Gemini returned empty content");

  // Strip markdown code fences if present
  const cleaned = content.replace(/```json\n?|```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

// ============================================================
// EXP Calculation (deterministic fallback for log_activity)
// ============================================================

const CATEGORY_STAT_MAP: Record<string, keyof Stats> = {
  olahraga: "str",
  belajar: "int",
  istirahat: "vit",
  kerja: "agi",
  sosial: "chr",
  kreatif: "int",
};

const INTENSITY_MULTIPLIER = { ringan: 1, sedang: 1.5, tinggi: 2.2 };

export function calculateExpLocally(
  category: string,
  duration: number,
  intensity: "ringan" | "sedang" | "tinggi"
): { exp: number; stats_boost: Stats } {
  const base = Math.round((duration / 30) * 80);
  const multiplier = INTENSITY_MULTIPLIER[intensity] ?? 1;
  const exp = Math.min(Math.round(base * multiplier), 500);

  const stats_boost: Stats = { str: 0, int: 0, vit: 0, agi: 0, chr: 0 };
  const primaryStat = CATEGORY_STAT_MAP[category];
  if (primaryStat) {
    stats_boost[primaryStat] = intensity === "tinggi" ? 3 : intensity === "sedang" ? 2 : 1;
  }

  return { exp, stats_boost };
}
