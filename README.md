# AniCoach

Gamifikasi Hidupmu. Dipandu AI. Bergaya Anime.

## Deskripsi
AniCoach adalah web application gamifikasi kehidupan nyata yang mengubah aktivitas harian pengguna (olahraga, belajar, kerja, sosial) menjadi Experience Points (EXP) dan Stats layaknya karakter RPG — dipandu oleh maskot AI bernama **Kaito**.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI Engine**: Groq (Llama 3.3 70B) & Google AI Studio (Gemini 2.5 Flash-Lite)
- **Database & Auth**: Supabase
- **Charts**: Recharts

## Struktur Proyek
- `app/`: Routing and API routes
- `components/`: Reusable UI components
- `lib/`: Business logic, AI clients, and Supabase config
- `store/`: State management (Zustand)
- `types/`: TypeScript definitions

## Cara Menjalankan
1. Clone repositori ini.
2. Salin `.env.example` ke `.env.local` dan isi API Key yang diperlukan.
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.

## Penulis
- [caesarzach@gmail.com](mailto:caesarzach@gmail.com)
