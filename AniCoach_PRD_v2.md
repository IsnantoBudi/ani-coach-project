---
title: AniCoach — Product Requirements Document
version: 2.0.0
status: draft
date: April 2026
platform: Web (Vercel)
submission: Stage 2 — WealthyPeople Developer Recruitment
deadline: 2026-05-02T23:59:00+07:00
contact: caesarzach@gmail.com
tags: [gamification, anime, ai, nextjs, groq, supabase, vercel]
---

# AniCoach PRD v2.0
> **Tagline:** Gamifikasi Hidupmu. Dipandu AI. Bergaya Anime.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Mascot & AI Character — Kaito](#3-mascot--ai-character--kaito)
4. [Features & Functionality](#4-features--functionality)
5. [User Journey](#5-user-journey)
6. [AI Integration Architecture](#6-ai-integration-architecture)
7. [Tech Stack](#7-tech-stack)
8. [UI/UX Design & Branding](#8-uiux-design--branding)
9. [Project Structure](#9-project-structure)
10. [Development Milestones](#10-development-milestones)
11. [Success Metrics](#11-success-metrics)
12. [Risks & Mitigation](#12-risks--mitigation)
13. [Submission Checklist](#13-submission-checklist)

---

## 1. Executive Summary

AniCoach adalah **web application gamifikasi kehidupan nyata** yang mengubah aktivitas harian pengguna (olahraga, belajar, kerja, sosial) menjadi Experience Points (EXP) dan Stats layaknya karakter RPG — dipandu oleh maskot AI bernama **Kaito**, seorang sensei anime bergaya Genshin Impact.

Yang membedakan AniCoach dari habit tracker biasa:

- AI bukan dekorasi — AI adalah **inti dari setiap interaksi**
- Kaito bereaksi secara dinamis terhadap perilaku user, memberikan quest personal, dan narasi yang imersif
- Sistem gamifikasi penuh: EXP, level, stats (STR/INT/VIT/AGI/CHR), streak, achievement, leaderboard
- Seluruh stack **100% gratis**, tanpa kartu kredit, siap deploy ke Vercel

**AI Engine:** Groq (Llama 3.3 70B) sebagai primary — 200–500 token/detik, gratis, no credit card.
**Fallback:** Google AI Studio (Gemini 2.5 Flash-Lite) → Mock Response pre-written.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

> *"Menjadi platform gamifikasi diri terbaik di Indonesia, di mana setiap langkah nyata terasa seperti babak baru dalam petualangan epik."*

### 2.2 Product Goals

| ID  | Goal                                      | Indikator Sukses                                      |
|-----|-------------------------------------------|-------------------------------------------------------|
| G1  | AI sebagai inti — bukan dekorasi          | Setiap interaksi user melibatkan AI response          |
| G2  | Gamifikasi bermakna                        | User kembali minimal 3× per minggu                    |
| G3  | Viral & shareable                          | User share progress card ke sosmed                    |
| G4  | Visual identity kuat                       | Karakter Kaito dikenali sebagai brand AniCoach        |
| G5  | Deploy & aksesibel                         | Live di Vercel, load time < 3 detik                   |
| G6  | Zero cost infrastructure                   | Semua layer gratis tanpa kartu kredit                 |

### 2.3 Target Users

- Usia **17–28 tahun**, familiar dengan budaya anime dan gaming
- Mahasiswa / pekerja muda yang ingin membangun kebiasaan produktif
- Pengguna yang bosan dengan habit tracker konvensional
- Penggemar Genshin Impact dan game RPG serupa

---

## 3. Mascot & AI Character — Kaito

### 3.1 Character Background

**Nama:** Kaito (海斗)
**Asal:** Dunia paralel di mana manusia dinilai dari Stats kehidupan nyata, bukan kekayaan.
**Misi:** Membantu pengguna mencapai potensi terbaik melalui sistem RPG yang ia kuasai.

### 3.2 Visual Description (Genshin Impact Style)

| Atribut        | Deskripsi                                                                                  |
|----------------|--------------------------------------------------------------------------------------------|
| Usia visual    | 17–19 tahun — energetik, tampil muda                                                       |
| Tinggi         | Sedang, build atletis seperti karakter male teen Genshin                                   |
| Rambut         | Hitam dengan highlight biru elektrik di ujung, medium length, sedikit berantakan tapi stylish |
| Mata           | Biru tosca bercahaya — glowing effect saat memberikan quest atau bereaksi emosional        |
| Kulit          | Cerah natural, pipi sedikit merona saat antusias                                           |
| Outfit utama   | Jaket panjang hitam bermotif konstelasi bintang emas (mirip Wanderer/Scaramouche), inner turtleneck putih |
| Aksesori       | Floating orb biru kecil yang selalu melayang di sampingnya — representasi AI core         |
| Ekspresi default | Senyum percaya diri dengan satu alis terangkat                                           |
| Elemen Genshin | Anemo (warna hijau-biru, nuansa kebebasan dan kecepatan)                                  |

### 3.3 Personality & Tone of Voice

- **Percaya diri tapi tidak arogan** — percaya pada user lebih dari user percaya pada dirinya sendiri
- **Humoris dan sarkastik ringan** — tidak ragu menggoda user saat mereka malas
- **Antusias sejati** — benar-benar excited saat user level up atau streak panjang
- **Tegas saat perlu** — jika user tidak melakukan quest, Kaito tidak akan diam

### 3.4 Kaito Dialog Examples

| Situasi                   | Dialog Kaito                                                                                     |
|---------------------------|--------------------------------------------------------------------------------------------------|
| Login pertama kali        | "Akhirnya kamu datang. Aku sudah menunggumu — level 1 memang titik awal, tapi bukan akhir kisahmu." |
| User skip quest 2 hari    | "2 hari tanpa misi? Aku ngerti, hidup bisa keras. Tapi statistikmu tidak akan naik sendiri. Ready?" |
| User level up             | "LEVEL UP! Ha! Aku tahu dari awal kamu bukan orang biasa. Selamat, Adventurer."                |
| User selesai quest sulit  | "Bukan semua orang bisa menyelesaikan itu. Kamu tadi? Luar biasa. +200 EXP, well deserved."   |
| Streak 7 hari             | "7 hari berturut-turut. Konsistensi seperti ini yang memisahkan hero dari yang lainnya."        |

### 3.5 Expression States

| State         | Ekspresi                                      | Trigger                              |
|---------------|-----------------------------------------------|--------------------------------------|
| `idle`        | Senyum santai, orb berputar pelan             | Tidak ada aktivitas                  |
| `excited`     | Mata bersinar, gesture menunjuk ke depan      | User submit aktivitas / quest selesai|
| `disappointed`| Menopang dagu, orb meredup                    | Quest terlewat / streak putus        |
| `shocked`     | Mata melebar, orb berputar cepat              | User mencapai milestone besar        |
| `serious`     | Wajah tegas, tangan bersilang                 | Kaito memberikan Daily Quest baru    |
| `happy`       | Tertawa kecil, orb bersinar terang            | Level up / streak 7 hari+            |

---

## 4. Features & Functionality

### 4.1 Feature List

| ID  | Feature                                        | Priority     | AI Involved |
|-----|------------------------------------------------|--------------|-------------|
| F01 | Activity Logger (input aktivitas harian)       | Must Have    | ✅ Yes      |
| F02 | Stats Dashboard (STR, INT, VIT, AGI, CHR)      | Must Have    | ✅ Yes      |
| F03 | Daily Quest Generator                          | Must Have    | ✅ Yes      |
| F04 | EXP & Level-up System                          | Must Have    | Partial     |
| F05 | Kaito Reaction Panel (animasi + dialog)        | Must Have    | ✅ Yes      |
| F06 | Streak Tracker                                 | Should Have  | ❌ No       |
| F07 | Achievement & Badge System                     | Should Have  | ❌ No       |
| F08 | Progress Share Card                            | Should Have  | Partial     |
| F09 | Leaderboard Mingguan                           | Could Have   | ❌ No       |
| F10 | Onboarding Personality Quiz                    | Could Have   | ✅ Yes      |

### 4.2 F01 — Activity Logger

User menginput aktivitas harian dalam format teks bebas atau pilih dari preset kategori. AI memproses input dan menentukan Stats mana yang naik serta berapa EXP yang diberikan.

**Input flow:**
1. User ketik bebas: `"lari 30 menit"` atau pilih kategori preset
2. AI (Groq) analisis intensitas & durasi → kalkulasi EXP
3. Preview EXP + komentar Kaito sebelum user confirm
4. Submit → stats update → Kaito react

**Kategori preset:** Olahraga, Belajar, Kerja, Sosial, Istirahat, Kreatif

### 4.3 F02 — Stats Dashboard

Setiap user memiliki 5 stats utama ditampilkan sebagai **polygon radar chart** bergaya RPG.

| Stat  | Kepanjangan   | Dinaikkan Oleh                              |
|-------|---------------|---------------------------------------------|
| `STR` | Strength      | Olahraga, aktivitas fisik, gym              |
| `INT` | Intelligence  | Belajar, membaca, kursus, problem solving   |
| `VIT` | Vitality      | Tidur cukup, makan sehat, meditasi          |
| `AGI` | Agility       | Konsistensi, multitasking, deadline terpenuhi |
| `CHR` | Charisma      | Aktivitas sosial, presentasi, networking    |

### 4.4 F03 — Daily Quest Generator

Kaito (AI) men-generate **3 quest per hari** yang dipersonalisasi berdasarkan:
- Stats terlemah user
- Histori aktivitas 7 hari terakhir
- Streak saat ini
- Waktu hari (pagi/sore/malam)

Quest bukan pre-written — semuanya **di-generate AI secara dinamis**.

| Tipe Quest     | EXP Reward | Estimasi Waktu |
|----------------|------------|----------------|
| Quest Ringan   | 50 EXP     | 15–20 menit    |
| Quest Sedang   | 120 EXP    | 30–45 menit    |
| Quest Epik     | 300 EXP    | 60+ menit      |

### 4.5 F04 — EXP & Level System

- Setiap **1.000 EXP** = naik 1 level
- Setiap **5 level** = naik 1 tier dengan title baru

| Level Range | Tier     | Title              |
|-------------|----------|--------------------|
| 1–5         | Bronze   | Awakened Soul      |
| 6–10        | Silver   | Rising Adventurer  |
| 11–20       | Gold     | Proven Warrior     |
| 21–35       | Platinum | Elite Champion     |
| 36+         | Diamond  | Legendary          |

---

## 5. User Journey

### 5.1 Onboarding Flow

```
[Landing Page]
     │
     ▼ klik "Mulai Petualangan"
[Kaito Intro Animation]
     │
     ▼ Kaito menyapa
[Isi Nama + Pilih Warna Avatar]
     │
     ▼ Input diterima
[5 Pertanyaan Onboarding Singkat]
     │ AI analisis jawaban
     ▼
[Stats Awal di-generate AI]
     │
     ▼ Kaito jelaskan build user
[Dashboard + Daily Quest Pertama]
```

### 5.2 Daily Loop

```
PAGI
 └─ Buka AniCoach
 └─ Terima Daily Quest dari Kaito (AI-generated)
 └─ Rencanakan aktivitas hari ini

SIANG
 └─ Lakukan aktivitas nyata di dunia real

SORE/MALAM
 └─ Log aktivitas → AI kalkulasi EXP
 └─ Kaito bereaksi dengan dialog + ekspresi dinamis
 └─ Stats update + progress cek

AKHIR MALAM
 └─ Cek streak
 └─ Lihat leaderboard (opsional)
 └─ Share progress card ke sosmed (opsional)
```

### 5.3 Key Interaction Points

| Trigger                    | Kaito Action                                           | Expression State |
|----------------------------|--------------------------------------------------------|------------------|
| User buka app (pagi)       | Generate daily quest + greeting kontekstual            | `serious`        |
| User submit aktivitas      | Kalkulasi EXP + komentar aktivitas spesifik            | `excited`        |
| User level up              | Animasi level up + dialog congratulation               | `happy`          |
| Streak putus               | Dialog motivasi + quest recovery ringan                | `disappointed`   |
| Streak 7 hari              | Animasi khusus + bonus EXP                             | `shocked`        |
| User idle 2 hari           | Notifikasi reminder dari Kaito                         | `disappointed`   |
| Quest selesai semua        | Recap harian + saran besok                             | `happy`          |

---

## 6. AI Integration Architecture

### 6.1 AI Stack — 100% Gratis, Tanpa Kartu Kredit

| Layer      | Provider              | Model                    | Free Limit                     | Role                                        |
|------------|-----------------------|--------------------------|--------------------------------|---------------------------------------------|
| Primary    | Groq (GroqCloud)      | `llama-3.3-70b-versatile`| 14.400 req/hari · 30 RPM      | AI utama Kaito — 200–500 tok/detik         |
| Fallback   | Google AI Studio      | `gemini-2.5-flash-lite`  | 1.000 req/hari · 15 RPM        | Backup otomatis jika Groq rate-limited      |
| Emergency  | Mock Response         | Pre-written dialog        | Unlimited                      | Garantikan demo tidak pernah blank          |

> **Signup links:**
> - Groq: https://console.groq.com (email only, no CC)
> - Google AI Studio: https://aistudio.google.com (Google account only, no CC)

### 6.2 Groq vs GPU Providers

| Aspek                   | Groq (Llama 3.3 70B) | Provider GPU Standar |
|-------------------------|----------------------|----------------------|
| Kecepatan output        | 200–500 token/detik  | 30–80 token/detik    |
| Latensi first token     | ~100ms               | ~500–1.500ms         |
| Kartu kredit            | ❌ Tidak perlu        | ✅ Umumnya perlu      |
| Request/hari (gratis)   | 14.400               | 100–1.000            |
| Format API              | OpenAI-compatible    | Bervariasi           |
| Model quality           | Setara GPT-4o        | Bervariasi           |

### 6.3 Fallback Chain Architecture

```typescript
// /api/kaito/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  // Layer 1: Groq Primary
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: buildMessages(body),
        max_tokens: 400,
        response_format: { type: "json_object" }
      })
    });
    if (res.ok) return Response.json(await parseAIResponse(res));
  } catch (e) {}

  // Layer 2: Gemini Fallback
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: buildGeminiPrompt(body) }] }] })
      }
    );
    if (res.ok) return Response.json(await parseGeminiResponse(res));
  } catch (e) {}

  // Layer 3: Mock Emergency Fallback
  return Response.json(getMockResponse(body.task_type));
}
```

### 6.4 System Prompt Kaito

```
You are Kaito, an AI life coach from AniCoach — a life gamification app.
Personality: Confident, witty, caring. Like Zhongli meets Aether (Genshin Impact).
Always respond in Bahasa Indonesia. Keep it short, punchy, impactful.
Never break character.

User: {name} | Level: {level} | Streak: {streak} days
Stats: STR:{str} INT:{int} VIT:{vit} AGI:{agi} CHR:{chr}
Task: {task_type} | Input: {user_input}

Return ONLY valid JSON (no markdown, no extra text):
{
  "exp": <integer 0-500>,
  "stats_boost": { "str": 0, "int": 0, "vit": 0, "agi": 0, "chr": 0 },
  "dialog": "<Kaito's response, max 2 sentences>",
  "expression": "<idle|excited|serious|happy|disappointed|shocked>"
}
```

### 6.5 Task Types for AI

| `task_type`       | Trigger                                | Expected Output                           |
|-------------------|----------------------------------------|-------------------------------------------|
| `log_activity`    | User submit aktivitas                  | EXP + stats_boost + komentar aktivitas   |
| `generate_quests` | Setiap hari pagi / user request        | Array 3 quest dengan title + EXP         |
| `level_up`        | User mencapai threshold EXP            | Dialog celebrasi                          |
| `streak_broken`   | User tidak login 1+ hari              | Dialog motivasi + recovery quest          |
| `onboarding`      | Jawaban 5 pertanyaan awal              | Stats awal + penjelasan build user        |
| `weekly_recap`    | Akhir minggu                           | Narasi recap + saran minggu depan         |
| `reaction`        | Event arbitrary                        | Dialog kontekstual + expression state     |

### 6.6 Mock Response Bank (Emergency Fallback)

```typescript
const MOCK_RESPONSES: Record<string, KaitoResponse> = {
  log_activity: {
    exp: 100,
    stats_boost: { str: 1, int: 0, vit: 0, agi: 1, chr: 0 },
    dialog: "Bagus! Kamu sudah bergerak hari ini. EXP masuk, stats naik. Terus seperti ini.",
    expression: "excited"
  },
  generate_quests: { /* pre-written 3 quests */ },
  level_up: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog: "LEVEL UP! Ini bukan keberuntungan — ini hasil kerja kerasmu. Selamat, Adventurer.",
    expression: "happy"
  },
  // ... lebih banyak task types
};
```

---

## 7. Tech Stack

> **Prinsip:** Semua tools gratis tanpa kartu kredit. Tidak ada trial yang expire.

### 7.1 Full Stack Overview

| Layer              | Technology                      | Cost                   | Notes                                      |
|--------------------|---------------------------------|------------------------|--------------------------------------------|
| Frontend Framework | Next.js 14 (App Router)         | ✅ Free forever         | SSR, API routes bawaan, Vercel-native      |
| Styling            | Tailwind CSS                    | ✅ Free forever         | Dark RPG UI — utility-first               |
| Animation          | Framer Motion + CSS keyframes   | ✅ Free forever         | Ekspresi Kaito yang smooth                 |
| State Management   | Zustand                         | ✅ Free forever         | Lightweight, cocok untuk game state        |
| Charts             | Recharts                        | ✅ Free forever         | Polygon radar chart untuk Stats Dashboard  |
| AI Primary         | Groq API (Llama 3.3 70B)        | ✅ 14.400 req/hari      | No CC — paling cepat 200–500 tok/s        |
| AI Fallback        | Google AI Studio (Gemini Flash) | ✅ 1.000 req/hari       | No CC — backup otomatis                   |
| AI Emergency       | Mock Response (pre-written)     | ✅ Unlimited            | Garantikan demo tidak pernah gagal         |
| Database           | Supabase (PostgreSQL)           | ✅ 500MB free           | Stats, histori, user data                  |
| Authentication     | Supabase Auth                   | ✅ 50.000 MAU free      | Google/Email login                         |
| Storage            | Supabase Storage                | ✅ 1GB free             | Share card images                          |
| Deployment         | Vercel                          | ✅ 100GB bandwidth/bln  | Auto-deploy dari GitHub, SSL, CDN global  |
| Version Control    | GitHub                          | ✅ Free                 | Required by submission                     |

### 7.2 Environment Variables

```bash
# .env.local — JANGAN di-commit ke GitHub

# AI Primary — daftar gratis di console.groq.com
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AI Fallback — daftar gratis di aistudio.google.com
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx

# Database — daftar gratis di supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7.3 Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "recharts": "^2.12.0",
    "@supabase/supabase-js": "^2.43.0",
    "groq-sdk": "^0.5.0"
  }
}
```

---

## 8. UI/UX Design & Branding

### 8.1 Visual Identity

| Elemen          | Spesifikasi                                                        |
|-----------------|--------------------------------------------------------------------|
| Nama Produk     | **AniCoach**                                                       |
| Tagline         | *Gamifikasi Hidupmu. Dipandu AI. Bergaya Anime.*                   |
| Design Language | Dark RPG UI dengan elemen anime — terinspirasi Genshin Impact HUD |
| Color Primary   | `#1A1A2E` — Dark Navy (latar RPG malam)                           |
| Color Accent    | `#C9A84C` — Gold (EXP, level, achievement)                        |
| Color Secondary | `#0F3460` — Deep Blue (panel stats)                               |
| Color Highlight | `#E94560` — Merah aksen (alert, HP bar style)                     |
| Color Text      | `#EAEAEA` — Off-white (body text)                                  |
| Font Heading    | `Cinzel Decorative` — RPG fantasy feel                             |
| Font Body       | `Inter` / `DM Sans` — clean, readable                             |

### 8.2 Color Tokens

```css
:root {
  --color-bg-primary: #1A1A2E;
  --color-bg-secondary: #0F3460;
  --color-bg-card: #16213E;
  --color-accent-gold: #C9A84C;
  --color-accent-red: #E94560;
  --color-accent-blue: #4ECDC4;
  --color-text-primary: #EAEAEA;
  --color-text-secondary: #A0A0B0;
  --color-exp-bar: #C9A84C;
  --color-stat-str: #E94560;  /* merah */
  --color-stat-int: #4A90D9;  /* biru */
  --color-stat-vit: #5CB85C;  /* hijau */
  --color-stat-agi: #F0AD4E;  /* oranye */
  --color-stat-chr: #9B59B6;  /* ungu */
}
```

### 8.3 Pages & Routes

| Route           | Halaman          | Konten Utama                                                          |
|-----------------|------------------|-----------------------------------------------------------------------|
| `/`             | Landing Page     | Hero section dengan Kaito animated, tagline, CTA "Mulai Petualangan" |
| `/dashboard`    | Dashboard        | Stats radar chart, EXP bar, Kaito reaction panel, Daily Quest cards  |
| `/log`          | Activity Logger  | Form input aktivitas + AI preview EXP sebelum submit                 |
| `/profile`      | Profile          | Level, tier, streak, badges, share card generator                    |
| `/leaderboard`  | Leaderboard      | Top 10 user minggu ini (Could Have)                                   |
| `/api/kaito`    | AI Route         | Next.js API Route — Groq → Gemini → Mock fallback chain              |

### 8.4 Kaito Panel Layout

Panel Kaito hadir sebagai **komponen persisten** di sisi kanan dashboard dengan 3 zona:

```
┌─────────────────────────────┐
│   [Ilustrasi Kaito]         │  ← Zona Atas: Ekspresi dinamis
│   (ekspresi berubah)        │
├─────────────────────────────┤
│   "Dialog Kaito muncul      │  ← Zona Tengah: Visual novel dialog box
│    di sini..."              │
│                    [Next ▶] │
├─────────────────────────────┤
│  [Log] [Quest] [Tanya]      │  ← Zona Bawah: Quick action buttons
└─────────────────────────────┘
```

---

## 9. Project Structure

```
anicoach/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/
│   │   └── page.tsx                # Main dashboard
│   ├── log/
│   │   └── page.tsx                # Activity logger
│   ├── profile/
│   │   └── page.tsx                # User profile + share card
│   ├── leaderboard/
│   │   └── page.tsx                # Weekly leaderboard
│   ├── api/
│   │   └── kaito/
│   │       └── route.ts            # AI router (Groq → Gemini → Mock)
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles + CSS variables
│
├── components/
│   ├── kaito/
│   │   ├── KaitoPanel.tsx          # Main Kaito widget
│   │   ├── KaitoAvatar.tsx         # Animated character display
│   │   ├── KaitoDialog.tsx         # Visual novel dialog box
│   │   └── KaitoExpressions.ts     # Expression state definitions
│   ├── dashboard/
│   │   ├── StatsRadarChart.tsx     # Polygon stats chart (Recharts)
│   │   ├── ExpBar.tsx              # EXP progress bar
│   │   ├── QuestCard.tsx           # Daily quest card component
│   │   └── StreakTracker.tsx       # Streak display
│   ├── activity/
│   │   └── ActivityForm.tsx        # Activity input + AI preview
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   └── share/
│       └── ShareCard.tsx           # Progress share card generator
│
├── lib/
│   ├── ai/
│   │   ├── groq.ts                 # Groq API client
│   │   ├── gemini.ts               # Gemini API client
│   │   ├── mock.ts                 # Mock response bank
│   │   └── router.ts               # Fallback chain logic
│   ├── supabase/
│   │   ├── client.ts               # Supabase browser client
│   │   ├── server.ts               # Supabase server client
│   │   └── schema.sql              # Database schema
│   └── utils/
│       ├── exp.ts                  # EXP calculation helpers
│       ├── stats.ts                # Stats calculation helpers
│       └── level.ts                # Level/tier helpers
│
├── store/
│   └── gameStore.ts                # Zustand game state store
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
├── public/
│   ├── kaito/                      # Kaito illustration assets
│   └── icons/                      # App icons
│
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Template env vars
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 10. Development Milestones

| Hari   | Target                 | Deliverable                                                                   |
|--------|------------------------|-------------------------------------------------------------------------------|
| Hari 1 | Setup & Foundation     | Next.js init, Tailwind config, Supabase setup, Vercel deploy kosong, env vars |
| Hari 2 | Core UI + Kaito Static | Landing page, dashboard layout, Kaito panel (static), branding + color system |
| Hari 3 | AI Integration         | Groq API connected, fallback chain berfungsi, Activity Logger live dengan AI  |
| Hari 4 | Quest & Stats          | Daily Quest generator live, Stats Radar Chart, Level system, EXP kalkulasi   |
| Hari 5 | Polish + Animation     | Kaito expressions, animasi transisi, Streak tracker, Share card generator     |
| Hari 6 | Testing & Buffer       | Bug fixing, mobile responsive (375px), final deploy, record demo video 2–3 min|

---

## 11. Success Metrics

### 11.1 Submission Evaluation Criteria

| Kriteria                          | Target                                              | Bobot  |
|-----------------------------------|-----------------------------------------------------|--------|
| AI benar-benar inti produk        | Semua fitur utama involve AI response               | Tinggi |
| Karakter maskot hadir & bermakna  | Kaito tampil di seluruh halaman, ekspresi dinamis   | Tinggi |
| Web aksesibel & berfungsi         | Live di Vercel, no broken features saat demo        | Tinggi |
| Konsep orisinal                   | Belum ada AniCoach di pasar Indonesia               | Sedang |
| Branding konsisten                | Logo, warna, font seragam di semua halaman          | Sedang |
| Demo video meyakinkan             | Walkthrough 2–3 menit yang menunjukkan semua fitur  | Sedang |
| Tech stack free                   | Semua layer gratis tanpa CC (bonus credibility)     | Sedang |

### 11.2 Demo Script Suggestion

```
0:00–0:20  → Landing page hero + perkenalan AniCoach + Kaito
0:20–0:50  → Onboarding: isi nama, jawab 5 pertanyaan, lihat stats awal
0:50–1:20  → Dashboard: Kaito generate Daily Quest, stats radar chart
1:20–1:50  → Activity Logger: input "olahraga 30 menit", AI kalkulasi EXP, Kaito bereaksi
1:50–2:10  → Level up animation (demo dengan EXP cheat/debug mode)
2:10–2:30  → Share card generator + tunjukkan streak tracker
2:30–3:00  → Tutup dengan Kaito dialog + CTA
```

---

## 12. Risks & Mitigation

| Risiko                                       | Dampak                              | Mitigasi                                                          |
|----------------------------------------------|-------------------------------------|-------------------------------------------------------------------|
| Groq rate limit (30 RPM) tercapai saat demo  | Respons Kaito lambat / timeout      | Auto-fallback ke Gemini — user tidak sadar pindah provider        |
| Gemini rate limit (15 RPM) juga habis        | Fitur AI mati total                 | Mock response bank — 20+ dialog pre-written per task type         |
| Groq downtime / maintenance                  | Primary AI tidak bisa diakses       | Fallback chain otomatis ke Gemini, lalu mock                      |
| System prompt terlalu panjang                | Token cepat habis, kena rate limit  | Kompres system prompt < 200 token, inject data user minimal        |
| Animasi karakter kompleks                    | Waktu dev habis untuk visual        | CSS animation sederhana dulu — Framer Motion hanya untuk transisi |
| Scope terlalu besar                          | Fitur utama tidak selesai tepat waktu| Prioritaskan F01–F05, F06+ adalah nice-to-have bonus             |
| Mobile responsiveness buruk                  | UX rusak saat demo di HP            | Test awal dengan Tailwind responsive classes, minimum 375px       |
| Supabase 500MB free tier habis               | Data user tidak bisa disimpan       | Session storage sebagai buffer + lazy sync ke Supabase            |

---

## 13. Submission Checklist

> Submit ke: **caesarzach@gmail.com**
> Subject: **"Stage 2 Developer Recruitment"**
> Deadline: **2 Mei 2026, 23.59 WIB**

### Pre-submission Checklist

- [ ] Live URL aktif dan bisa diakses di Vercel (`https://anicoach.vercel.app`)
- [ ] GitHub repo publik dengan README.md yang lengkap
- [ ] Demo video (2–3 menit) tersedia di Google Drive (link publik)
- [ ] Ilustrasi / logo Kaito tersedia di Google Drive atau URL langsung
- [ ] Form submission diisi lengkap (nama, email, phone, LinkedIn)
- [ ] AI (Groq) terintegrasi dan berfungsi di live URL
- [ ] Fallback ke Gemini berfungsi (test dengan disable GROQ_API_KEY sementara)
- [ ] Mobile responsive — test di 375px minimum
- [ ] Tidak ada broken link atau console error saat demo
- [ ] `.env.example` tersedia di repo (tanpa nilai asli)
- [ ] Subject email benar: "Stage 2 Developer Recruitment"
- [ ] Dikirim sebelum 2 Mei 2026, 23.59 WIB

### Form Fields to Fill

```yaml
project_name: AniCoach
overview: |
  AniCoach adalah web app gamifikasi kehidupan nyata yang mengubah aktivitas
  harian pengguna menjadi EXP dan Stats layaknya karakter RPG, dipandu oleh
  maskot AI anime bernama Kaito. Setiap olahraga, sesi belajar, dan pencapaian
  dikonversi secara real-time oleh AI (Groq Llama 3.3 70B) menjadi
  pengalaman bermain yang personal dan imersif. Target pengguna adalah
  Gen Z Indonesia yang bosan dengan habit tracker konvensional.

live_url: https://anicoach.vercel.app
github_repo: https://github.com/username/anicoach
demo_video: https://drive.google.com/...
logo_character: https://drive.google.com/...

frontend_framework: Next.js 14 (React)
ai_model: Groq API — Llama 3.3 70B (primary) + Google Gemini 2.5 Flash-Lite (fallback)
ai_integration: |
  AI terintegrasi sebagai otak utama sistem — bukan chatbot. Setiap aktivitas
  yang diinput user diproses AI untuk menentukan EXP dan stat boost. AI juga
  men-generate Daily Quest yang dipersonalisasi dan menggerakkan ekspresi
  karakter Kaito secara dinamis. Menggunakan 3-layer fallback: Groq → Gemini → Mock.

unique_value: |
  AniCoach bukan habit tracker — ini adalah RPG kehidupan nyata. AI berfungsi
  sebagai game master yang menilai setiap tindakan user dan memberi feedback
  melalui karakter Kaito. Konsep ini belum ada di pasar Indonesia.
```

---

*AniCoach PRD v2.0 · Stage 2 — WealthyPeople Developer Recruitment · April 2026*
*Build something worth talking about.*
