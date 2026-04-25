"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "./animated-number";

interface HeroSectionProps {
  categories: Array<{ name: string; slug: string }>;
}

const STATS = [
  { target: 12400, suffix: "+", label: "Alunos formados", separator: true },
  { target: 97, suffix: "%", label: "Aprovação geral" },
  { target: 4.9, suffix: "★", label: "Nota dos instrutores", decimals: 1 },
];

export function HeroSection({ categories }: HeroSectionProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/cursos?q=${encodeURIComponent(q)}` : "/cursos");
  }

  return (
    <section
      style={{
        background:
          "linear-gradient(145deg, #f0f5ff 0%, #e8f0fe 35%, #f4f8ff 65%, #f8faff 100%)",
        paddingTop: 72,
        paddingBottom: 64,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid md:grid-cols-[1fr_340px] gap-10 lg:gap-16 items-center">

          {/* ── Left: text + search ── */}
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.32em] mb-5"
              style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
            >
              CFIA — Centro de Formação em Inteligência Artificial
            </p>

            <h1
              className="font-light mb-5"
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                color: "#161616",
              }}
            >
              O que você quer{" "}
              <em style={{ fontStyle: "italic", color: "#0f62fe" }}>aprender</em>{" "}
              hoje?
            </h1>

            <p
              className="text-base sm:text-lg mb-7 max-w-xl"
              style={{ color: "#525252", lineHeight: 1.7 }}
            >
              Formações práticas em IA com certificado verificável, projetos
              reais e acompanhamento de carreira do início ao emprego.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex mb-5" style={{ maxWidth: 560 }}>
              <input
                type="text"
                placeholder="Buscar cursos, trilhas ou habilidades…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-field flex-1 h-14 px-5 text-base"
                style={{ color: "#161616", fontSize: 15 }}
              />
              <button
                type="submit"
                className="h-14 px-5 sm:px-6 flex items-center gap-2 font-semibold text-sm flex-shrink-0"
                style={{
                  backgroundColor: "#0f62fe",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0353e9")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0f62fe")
                }
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </form>

            {/* Category chips */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 7).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/cursos?categoria=${cat.slug}`}
                    className="pill px-4 py-1.5 text-sm font-medium transition-colors"
                    style={{
                      border: "1px solid #c6c6c6",
                      color: "#161616",
                      backgroundColor: "#ffffff",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0f62fe";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#0f62fe";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#ffffff";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#161616";
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c6c6c6";
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/cursos"
                  className="pill px-4 py-1.5 text-sm font-medium"
                  style={{
                    border: "1px dashed #c6c6c6",
                    color: "#0f62fe",
                    backgroundColor: "transparent",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Ver todas <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
                </Link>
              </div>
            )}
          </div>

          {/* ── Right: stats card ── */}
          <div className="hidden md:block">
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                borderTop: "3px solid #0f62fe",
              }}
            >
              <div className="p-5 border-b" style={{ borderColor: "#e0e0e0" }}>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
                >
                  Resultados comprovados
                </p>
              </div>

              <div>
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4"
                    style={{
                      borderBottom: i < STATS.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <div
                      className="w-1 self-stretch flex-shrink-0"
                      style={{ backgroundColor: "#0f62fe" }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-serif, Georgia, serif)",
                          fontWeight: 300,
                          fontSize: "2rem",
                          color: "#0f62fe",
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                        }}
                      >
                        <AnimatedNumber
                          target={stat.target}
                          suffix={stat.suffix}
                          decimals={stat.decimals}
                          separator={stat.separator}
                          duration={1800}
                        />
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: "#525252" }}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5" style={{ backgroundColor: "#f4f4f4" }}>
                <Link
                  href="/cadastro"
                  className="flex items-center justify-between text-sm font-semibold"
                  style={{ color: "#0f62fe", textDecoration: "none" }}
                >
                  Comece gratuitamente <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Partner bar ─────────────────────────────────────────────────────── */
export function SocialProofBar() {
  const partners = [
    "Google", "IBM", "Microsoft", "OpenAI", "Meta AI",
    "DeepMind", "Stanford", "MIT",
  ];
  return (
    <div
      className="py-5 px-4 md:px-8 border-b"
      style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <p
            className="text-xs uppercase tracking-[0.22em] flex-shrink-0"
            style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
          >
            Conteúdo referenciado em
          </p>
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {partners.map((p) => (
              <span
                key={p}
                className="text-sm font-semibold"
                style={{ color: "#525252" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
