import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&q=80",
];

const NEURAL_COLS = 5;
const NEURAL_ROWS = 7;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#161616", color: "#fff" }}>
      {/* Subtle 64px grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid lg:grid-cols-[1.15fr_1fr]" style={{ borderBottom: "1px solid #393939" }}>

          {/* LEFT: editorial slab */}
          <div className="px-4 py-20 md:px-16 md:py-24 lg:px-16 lg:py-28" style={{ borderRight: "1px solid #393939" }}>
            {/* Eyebrow */}
            <div
              className="flex flex-wrap items-center gap-3 mb-10 text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "#c6c6c6", letterSpacing: "0.14em" }}
            >
              <span>CFIA</span>
              <span className="w-6 h-px flex-shrink-0" style={{ background: "#525252" }} />
              <span>Centro de Formação em IA</span>
              <span className="hidden sm:block w-6 h-px flex-shrink-0" style={{ background: "#525252" }} />
              <span className="hidden sm:block">Est. 2024</span>
            </div>

            {/* H1 — IBM Plex Serif 300, italic accent word */}
            <h1
              className="mb-7"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.98,
                color: "#fff",
              }}
            >
              Uma nova<br />
              geração de<br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "#4589ff" }}>profissionais</em><br />
              de IA começa aqui.
            </h1>

            {/* Subheadline */}
            <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: "#c6c6c6" }}>
              Trilhas estruturadas, projetos reais e mentoria de quem constrói IA no mercado. Do primeiro modelo ao deploy em produção.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 font-semibold text-sm transition-colors hover:bg-[#f4f4f4] active:scale-[0.98]"
                style={{ background: "#fff", color: "#161616" }}
              >
                Começar gratuitamente <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cursos"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 font-semibold text-sm transition-colors"
                style={{ background: "transparent", color: "#fff", border: "1px solid #525252" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l6 4-6 4z" fill="currentColor" />
                </svg>
                Ver trilhas · 2 min
              </Link>
            </div>

            {/* Mini stats strip */}
            <div className="grid grid-cols-3 pt-7 max-w-sm" style={{ borderTop: "1px solid #393939" }}>
              {[
                ["12.400+", "Alunos ativos"],
                ["97%", "Taxa de conclusão"],
                ["4,9★", "Avaliação média"],
              ].map(([value, label], i) => (
                <div
                  key={label}
                  className="pl-5 first:pl-0"
                  style={{ borderLeft: i > 0 ? "1px solid #393939" : "none" }}
                >
                  <div
                    className="text-3xl mb-1"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs uppercase mt-1"
                    style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: visual panel — desktop only */}
          <div className="relative hidden lg:block" style={{ minHeight: 700 }}>
            {/* Blue gradient panel */}
            <div
              className="absolute overflow-hidden"
              style={{
                inset: "40px 40px 40px 0",
                background: "linear-gradient(165deg, #0f62fe 0%, #002d9c 50%, #001141 100%)",
              }}
            >
              {/* Neural network SVG */}
              <svg
                viewBox="0 0 500 700"
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ opacity: 0.35 }}
                aria-hidden="true"
              >
                {Array.from({ length: NEURAL_COLS }).map((_, col) =>
                  Array.from({ length: NEURAL_ROWS }).map((_, row) => (
                    <circle
                      key={`c-${col}-${row}`}
                      cx={60 + col * 95}
                      cy={60 + row * 95}
                      r="3"
                      fill="#a6c8ff"
                    />
                  ))
                )}
                {Array.from({ length: NEURAL_COLS - 1 }).map((_, col) =>
                  Array.from({ length: NEURAL_ROWS }).flatMap((_, r1) =>
                    Array.from({ length: NEURAL_ROWS }).map((_, r2) => (
                      <line
                        key={`l-${col}-${r1}-${r2}`}
                        x1={60 + col * 95}
                        y1={60 + r1 * 95}
                        x2={60 + (col + 1) * 95}
                        y2={60 + r2 * 95}
                        stroke="#a6c8ff"
                        strokeWidth="0.4"
                        opacity={((r1 * r2 + col) % 5 === 0) ? 0.6 : 0.1}
                      />
                    ))
                  )
                )}
              </svg>

              {/* Training log ticker */}
              <div
                className="absolute bottom-8 left-8 right-8 text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em" }}
              >
                <div className="flex justify-between mb-2 uppercase">
                  <span>LATEST · PROJECT_RUN_OUTPUT</span>
                  <span style={{ color: "#24a148" }}>● TRAINING</span>
                </div>
                <div
                  className="p-4 leading-loose"
                  style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <div>epoch 12/30 · loss 0.142 · val_acc 0.913</div>
                  <div>epoch 13/30 · loss 0.128 · val_acc 0.924</div>
                  <div>
                    epoch 14/30 · loss 0.117 · val_acc{" "}
                    <span style={{ color: "#f1c21b" }}>0.937</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating course preview card */}
            <div
              className="absolute top-20 right-8 w-72 p-5 bg-white"
              style={{ color: "#161616", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }}
            >
              <div
                className="text-xs uppercase tracking-widest mb-2.5"
                style={{ fontFamily: "var(--font-mono)", color: "#0f62fe", letterSpacing: "0.12em" }}
              >
                CURSO EM DESTAQUE
              </div>
              <div className="text-base font-semibold leading-snug mb-3">
                Construindo agentes com LLMs em produção
              </div>
              <div className="flex items-center gap-2.5 text-sm mb-4" style={{ color: "#525252" }}>
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#f4d3b3,#c89474)" }}
                />
                Camila Tavares · IBM
              </div>
              <div
                className="flex justify-between items-center pt-3 text-xs"
                style={{ borderTop: "1px solid #e0e0e0", color: "#525252" }}
              >
                <span>8 semanas · Avançado</span>
                <span className="font-semibold">⭐ 4,9 (487)</span>
              </div>
            </div>

            {/* Floating metric tile */}
            <div
              className="absolute w-44 bg-white p-5"
              style={{ bottom: 168, right: 0, color: "#161616", boxShadow: "0 16px 32px rgba(0,0,0,0.2)" }}
            >
              <div
                className="text-xs uppercase mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.12em" }}
              >
                Conclusão
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "3rem",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                97<span style={{ color: "#0f62fe" }}>%</span>
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-5"
                    style={{ background: i < 19 ? "#0f62fe" : "#e0e0e0" }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function SocialProofBar() {
  const companies = ["Google", "IBM", "Microsoft", "Amazon", "Nubank", "iFood", "Stone", "Mercado Livre"];

  return (
    <section style={{ background: "#fff", borderBottom: "1px solid #e0e0e0" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        {/* Avatar row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {STUDENT_AVATARS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt="Aluno"
                  className="h-10 w-10 rounded-full object-cover"
                  style={{ border: "2px solid white" }}
                />
              ))}
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: "#161616" }}>+12.000 alunos</div>
              <div className="text-sm" style={{ color: "#525252" }}>já estão aprendendo IA</div>
            </div>
          </div>
          <p
            className="text-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}
          >
            Nossos alunos trabalham em empresas como
          </p>
        </div>

        {/* Company wordmarks — hairline grid */}
        <div
          className="grid grid-cols-4 md:grid-cols-8"
          style={{ gap: 1, background: "#e0e0e0", border: "1px solid #e0e0e0" }}
        >
          {companies.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center bg-white"
              style={{ padding: "20px 12px" }}
            >
              <span
                className="text-base font-bold whitespace-nowrap"
                style={{ color: "#c6c6c6" }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
