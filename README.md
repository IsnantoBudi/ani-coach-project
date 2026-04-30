# AniCoach 🗡️

**Gamifikasi Hidupmu. Dipandu AI. Bergaya Anime.**

## Tentang AniCoach

Merasa sulit untuk tetap konsisten dan bersemangat dalam menjalani aktivitas sehari-hari? **AniCoach** hadir untuk mengubah rutinitas yang membosankan menjadi sebuah petualangan epik!

AniCoach adalah web application gamifikasi kehidupan nyata yang memadukan produktivitas dengan elemen RPG (Role-Playing Game). Kami percaya bahwa **membangun kebiasaan baik harusnya semenyenangkan membangun karakter di dalam game**. Dengan AniCoach, setiap tugas yang kamu selesaikan—mulai dari olahraga, belajar, bekerja, hingga bersosialisasi—akan memberikanmu Experience Points (EXP) dan meningkatkan status karaktermu.

Berhenti menunda-nunda dan mulailah perjalananmu untuk menjadi versi terbaik dari dirimu!

---

## Fitur Utama & Keunggulan 🌟

### 🧙‍♂️ Personalisasi Quest oleh AI (Kaito)
Tidak ada lagi daftar tugas yang terasa seperti beban. Maskot AI cerdas kami, **Kaito**, akan mempelajari profil, kebiasaan, dan tujuan hidupmu untuk membuat **Quest Harian yang unik dan dipersonalisasi**. Kaito bertindak sebagai companion-mu, memberikan quest yang menantang namun dapat dicapai, khusus dirancang untuk pertumbuhan status karakter (dan dirimu di dunia nyata!).

### 📈 Sistem Progression Karakter RPG
Ubah aktivitas dunia nyata menjadi atribut RPG:
- **STR (Strength)**: Untuk quest fisik dan olahraga.
- **INT (Intelligence)**: Untuk belajar dan membaca.
- **AGI (Agility)**: Untuk produktivitas dan penyelesaian tugas cepat.
- **CHA (Charisma)**: Untuk interaksi sosial dan komunikasi.
Naikkan level karaktermu, lihat atributmu berkembang di radar chart, dan rasakan kepuasan saat melihat progresmu!

### 🏆 Sistem Prestasi (Achievements) & Reward
Selesaikan rentetan quest (streak), kumpulkan *item virtual*, dan buka berbagai *achievement* ("Constellations" & "Artifacts") layaknya menyelesaikan misi di dalam game. 

### 🎨 UI/UX "Dark RPG" yang Imersif
Desain antarmuka yang terinspirasi dari game RPG bergaya anime (Dark Fantasy) akan membuatmu betah berlama-lama mengecek progresmu. Pengalaman visual *Bento-grid* dan *Aetheric HUD* yang premium dan interaktif membuat produktivitas terasa seperti bermain game.

### 📊 Dashboard Analitik Kehidupan
Pantau secara detail bagaimana kamu menghabiskan waktumu. AniCoach memberikan visualisasi data yang menarik tentang pertumbuhan statusmu, memberikan wawasan untuk membantumu fokus pada area yang perlu ditingkatkan.

---

## Tech Stack 🛠️

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **AI Engine**: Groq (Llama 3.3 70B) & Google AI Studio (Gemini 2.5 Flash-Lite)
- **Database & Auth**: Supabase
- **Charts**: Recharts

## Struktur Proyek 📂

- `app/`: Routing and API routes
- `components/`: Reusable UI components
- `lib/`: Business logic, AI clients, dan Supabase config
- `store/`: State management (Zustand)
- `types/`: TypeScript definitions

## Cara Menjalankan 🚀

1. Clone repositori ini.
2. Salin `.env.example` ke `.env.local` dan isi konfigurasi beserta API Key yang diperlukan (Supabase, Groq, Google AI Studio).
3. Jalankan `npm install`.
4. Jalankan `npm run dev`.
5. Buka `http://localhost:3000` di browser.

## Penulis ✍️


user test 
email : test@mail.com
password: password

> *"Your life is the ultimate RPG. Level up yourself."*
