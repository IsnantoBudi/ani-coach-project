import type { Metadata } from "next";
import { Noto_Serif, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  style: ["normal", "italic"],
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-be-vietnam",
});

export const metadata: Metadata = {
  title: "AniCoach - Gamifikasi Hidupmu",
  description: "Gamifikasi Hidupmu. Dipandu AI. Bergaya Anime.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${notoSerif.variable} ${beVietnamPro.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-be-vietnam), 'Be Vietnam Pro', sans-serif" }}
      >
        {/* Aetheric particle background overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[-1]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(81, 97, 97, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(253, 211, 77, 0.05) 0%, transparent 50%)
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
