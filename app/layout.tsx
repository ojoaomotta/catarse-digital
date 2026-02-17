import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
});

// --- AQUI ESTÁ A MUDANÇA ---
export const metadata: Metadata = {
  title: "Catarse Film",
  description: "Memórias Cinematográficas.",
  manifest: "/manifest.json", // <--- Linha adicionada
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${newsreader.variable}`}>
      {/* "suppressHydrationWarning" evita o erro causado por extensões do navegador */}
      <body className="bg-catarse-moss text-catarse-cream antialiased min-h-screen relative overflow-x-hidden" suppressHydrationWarning>

        {/* Camada de Ruído (Noise) */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-40 mix-blend-overlay bg-grain"></div>

        {children}
      </body>
    </html>
  );
}