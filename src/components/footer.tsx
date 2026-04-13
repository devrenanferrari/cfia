"use client";

import Link from "next/link";
import { Globe, Link2, Mail, Rss } from "lucide-react";

const socialLinks = [
  { icon: Globe, href: "#", label: "Site" },
  { icon: Link2, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Newsletter" },
  { icon: Rss, href: "#", label: "Blog" },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--cds-text-primary)" }} className="mt-auto">
      <div className="mx-auto max-w-[1584px] px-4 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl mb-4 text-white">
              <span className="tracking-tight leading-none" style={{ letterSpacing: "0" }}>cfia</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs transition-colors" style={{ color: "var(--cds-text-secondary)" }}>
              Centro de Formação em Inteligência Artificial. Conhecimento avançado e acessível no Brasil.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-12 w-12 flex items-center justify-center transition-colors hover:text-white"
                  style={{ backgroundColor: "var(--cds-layer-02)", color: "var(--cds-text-secondary)" }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Plataforma */}
          <div>
            <h3 className="font-semibold text-xs tracking-widest mb-5 uppercase" style={{ color: "var(--cds-text-secondary)" }}>
              Plataforma
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/cursos", label: "Todos os cursos" },
                { href: "/assinar", label: "Planos e preços" },
                { href: "/seja-instrutor", label: "Seja instrutor" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-white"
                    style={{ color: "var(--cds-border-subtle)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h3 className="font-semibold text-xs tracking-widest mb-5 uppercase" style={{ color: "var(--cds-text-secondary)" }}>
              Conta
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/entrar", label: "Entrar" },
                { href: "/cadastro", label: "Criar conta" },
                { href: "/dashboard", label: "Painel do aluno" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-white"
                    style={{ color: "var(--cds-border-subtle)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-xs tracking-widest mb-5 uppercase" style={{ color: "var(--cds-text-secondary)" }}>
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/termos", label: "Termos de uso" },
                { href: "/privacidade", label: "Privacidade" },
                { href: "/cookies", label: "Cookies" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors hover:text-white"
                    style={{ color: "var(--cds-border-subtle)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-xs transition-colors"
          style={{ borderTop: "1px solid var(--cds-layer-02)", color: "var(--cds-border-subtle)" }}
        >
          <p>© {new Date().getFullYear()} CFIA. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link href="/ajuda" className="hover:text-white transition-colors">
              Central de Ajuda
            </Link>
            <Link href="/contato" className="hover:text-white transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
