import type { KaitoExpression, KaitoResponse, KaitoQuestsResponse, TaskType } from "@/types";

// ============================================================
// MOCK RESPONSE BANK — Emergency fallback (unlimited)
// Pre-written dialogs that never fail
// ============================================================

const MOCK_DIALOGS: Record<TaskType, KaitoResponse | KaitoQuestsResponse> = {
  log_activity: {
    exp: 100,
    stats_boost: { str: 1, int: 0, vit: 1, agi: 1, chr: 0 },
    dialog:
      "Bagus! Kamu sudah bergerak hari ini. EXP masuk, stats naik. Terus seperti ini.",
    expression: "excited" as KaitoExpression,
  },

  generate_quests: {
    quests: [
      {
        title: "Penjelajah Pagi",
        description: "Lakukan aktivitas fisik selama 20 menit sebelum jam 10 pagi.",
        category: "olahraga",
        difficulty: "ringan",
        exp_reward: 50,
      },
      {
        title: "Sesi Pengetahuan",
        description: "Baca atau tonton konten edukatif selama 30 menit.",
        category: "belajar",
        difficulty: "sedang",
        exp_reward: 120,
      },
      {
        title: "Misi Istirahat Berkualitas",
        description: "Tidur minimal 7 jam malam ini dan catat waktunya.",
        category: "istirahat",
        difficulty: "ringan",
        exp_reward: 50,
      },
    ],
    greeting: "Selamat pagi, Adventurer. Aku sudah menyiapkan misi hari ini — mulai dari yang mudah dulu.",
    expression: "serious" as KaitoExpression,
  } as KaitoQuestsResponse,

  level_up: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog:
      "LEVEL UP! Ini bukan keberuntungan — ini hasil kerja kerasmu. Selamat, Adventurer.",
    expression: "happy" as KaitoExpression,
  },

  streak_broken: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog:
      "Streakmu terputus. Tidak apa-apa — yang penting kamu kembali hari ini. Mulai lagi dari sini.",
    expression: "disappointed" as KaitoExpression,
  },

  get_advice: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog: "Fokuslah pada misi harianmu. Konsistensi adalah kunci untuk naik level dengan cepat.",
    expression: "serious" as KaitoExpression,
  },

  onboarding: {
    exp: 50,
    stats_boost: { str: 5, int: 5, vit: 5, agi: 5, chr: 5 },
    dialog:
      "Akhirnya kamu datang. Aku sudah menunggumu — level 1 memang titik awal, tapi bukan akhir kisahmu.",
    expression: "excited" as KaitoExpression,
  },

  weekly_recap: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog:
      "Minggu ini selesai. Kamu sudah membuktikan bahwa konsistensi lebih kuat dari bakat. Minggu depan, kita naik level lagi.",
    expression: "happy" as KaitoExpression,
  },

  reaction: {
    exp: 0,
    stats_boost: { str: 0, int: 0, vit: 0, agi: 0, chr: 0 },
    dialog: "Aku memperhatikanmu, Adventurer. Teruslah bergerak maju.",
    expression: "idle" as KaitoExpression,
  },
};

export function getMockResponse(taskType: TaskType): KaitoResponse | KaitoQuestsResponse {
  return MOCK_DIALOGS[taskType] ?? MOCK_DIALOGS.reaction;
}

// Motivational variety pool for log_activity (picked by category)
const ACTIVITY_DIALOGS: Record<string, string[]> = {
  olahraga: [
    "Kamu berkeringat, stats bergerak. Tubuh yang kuat adalah fondasi segalanya.",
    "Lari, angkat, gerak — fisik yang terlatih adalah senjata paling nyata.",
    "Bukan semua orang mau memaksakan diri seperti ini. Kamu tadi? Luar biasa.",
  ],
  belajar: [
    "Pengetahuan adalah kekuatan yang tidak bisa dicuri. Terus isi pikiranmu.",
    "Setiap sesi belajar membuka peta dunia yang lebih luas. Bagus sekali.",
    "INT naik. Orang-orang pintar bukan dilahirkan — mereka dibangun momen seperti ini.",
  ],
  kerja: [
    "Produktivitas yang konsisten adalah skill paling langka di dunia ini.",
    "Deadline terpenuhi, AGI naik. Kamu semakin efisien setiap harinya.",
    "Dunia kerja butuh orang yang bisa diandalkan. Hari ini, kamu membuktikannya.",
  ],
  sosial: [
    "Karisma bukan bakat — itu hasil dari interaksi seperti ini. CHR naik!",
    "Koneksi yang kamu bangun hari ini bisa mengubah takdirmu esok hari.",
    "Adventurer terkuat pun butuh party. Bagus kamu keluar dan berinteraksi.",
  ],
  istirahat: [
    "Istirahat yang berkualitas bukan kelemahan — ini adalah maintenance karakter.",
    "VIT naik. Regenerasi adalah bagian dari sistem. Jangan anggap remeh tidur.",
    "Bahkan pahlawan paling kuat pun butuh beristirahat. Kamu sudah benar.",
  ],
  kreatif: [
    "Kreativitas yang diasah hari ini adalah weaponmu untuk masa depan.",
    "Karya terbaik tidak datang sekali jadi. Teruslah berlatih, teruslah bereksperimen.",
    "Imajinasi adalah stat yang tidak terlihat di radar, tapi sangat powerful.",
  ],
};

export function getVariedDialog(category: string): string {
  const pool = ACTIVITY_DIALOGS[category] ?? ACTIVITY_DIALOGS.olahraga;
  return pool[Math.floor(Math.random() * pool.length)];
}
