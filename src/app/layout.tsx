import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CFIA — Cursos livres em programação e IA",
    template: "%s | CFIA",
  },
  description:
    "Cursos livres e gratuitos em programação e inteligência artificial. Projeto de extensão universitária criado por Renan Ferrari, estudante de Ciência da Computação.",
  keywords: ["cursos gratuitos", "programação", "inteligência artificial", "machine learning", "projeto de extensão", "cursos livres"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${ibmPlexSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
