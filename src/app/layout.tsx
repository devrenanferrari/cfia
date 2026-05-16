import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "CFIA - Cursos livres em programacao e IA",
    template: "%s | CFIA",
  },
  description:
    "Cursos livres e gratuitos em programacao e inteligencia artificial. Projeto de extensao universitaria criado por Renan Ferrari.",
  keywords: ["cursos gratuitos", "programacao", "inteligencia artificial", "machine learning", "projeto de extensao", "cursos livres"],
  openGraph: {
    title: "CFIA - Cursos livres em programacao e IA",
    description: "Projeto de extensao com cursos gratuitos de programacao e inteligencia artificial.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CFIA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CFIA - Cursos livres em programacao e IA",
    description: "Projeto de extensao com cursos gratuitos de programacao e inteligencia artificial.",
    images: ["/opengraph-image"],
  },
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
