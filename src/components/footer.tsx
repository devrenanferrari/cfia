"use client";

import Link from "next/link";
import { Globe, Heart, Mail, Rss } from "lucide-react";
import { InterestForm } from "@/components/interest-form";

const socialLinks = [
  { icon: Globe, href: "https://github.com/renannferrari", label: "GitHub" },
  { icon: Mail, href: "mailto:contato@cfia.com.br", label: "Email" },
  { icon: Rss, href: "/noticias", label: "Noticias" },
  { icon: Heart, href: "/apoie", label: "Apoie" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--cds-text-primary)" }} className="mt-auto">
      <div className="mx-auto max-w-[1584px] px-4 pb-12 pt-16 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <span className="leading-none" style={{ letterSpacing: "0" }}>cfia</span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed" style={{ color: "var(--cds-border-subtle)" }}>
              Projeto de extensao universitario com cursos livres e gratuitos em programacao e inteligencia artificial.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center transition-colors hover:text-white"
                  style={{ backgroundColor: "var(--cds-layer-02)", color: "var(--cds-text-secondary)" }}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cds-text-secondary)" }}>
              Plataforma
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/trilhas", label: "Trilhas" },
                { href: "/cursos", label: "Cursos" },
                { href: "/dashboard/certificados", label: "Certificados" },
                { href: "/noticias", label: "Noticias" },
                { href: "/seja-instrutor", label: "Seja instrutor" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: "var(--cds-border-subtle)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cds-text-secondary)" }}>
              Projeto
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/sobre", label: "Sobre" },
                { href: "/apoie", label: "Apoie o projeto" },
                { href: "/ajuda", label: "Ajuda" },
                { href: "/contato", label: "Contato" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white" style={{ color: "var(--cds-border-subtle)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--cds-text-secondary)" }}>
              Receba novidades
            </h3>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--cds-border-subtle)" }}>
              Avisos sobre cursos novos, trilhas e bastidores do desenvolvimento.
            </p>
            <InterestForm source="footer" cta="Enviar" compact />
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between gap-4 pt-8 text-xs md:flex-row"
          style={{ borderTop: "1px solid var(--cds-layer-02)", color: "var(--cds-border-subtle)" }}
        >
          <p>© {new Date().getFullYear()} CFIA. Projeto em construcao.</p>
          <div className="flex items-center gap-6">
            <Link href="/termos" className="transition-colors hover:text-white">Termos</Link>
            <Link href="/privacidade" className="transition-colors hover:text-white">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
