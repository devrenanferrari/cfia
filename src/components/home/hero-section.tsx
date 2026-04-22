"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedNumber } from "./animated-number";

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&q=80",
];

const COLS = 5;
const ROWS = 7;

// Pre-computed node list so the array doesn't regenerate on render
const NODES = Array.from({ length: COLS }, (_, col) =>
  Array.from({ length: ROWS }, (_, row) => ({
    cx: 60 + col * 95,
    cy: 60 + row * 95,
    delay: (col * ROWS + row) * 0.14,
    duration: 2 + (col + row) % 3,
  }))
).flat();

// Only animate a curated subset of lines (data flow effect)
const FLOW_LINES = [
  { x1: 60, y1: 155, x2: 155, y2: 60, delay: 0 },
  { x1: 155, y1: 250, x2: 250, y2: 155, delay: 0.6 },
  { x1: 250, y1: 60, x2: 345, y2: 250, delay: 1.2 },
  { x1: 345, y1: 345, x2: 440, y2: 155, delay: 0.3 },
  { x1: 60, y1: 440, x2: 155, y2: 540, delay: 0.9 },
  { x1: 250, y1: 345, x2: 345, y2: 440, delay: 1.5 },
  { x1: 155, y1: 60, x2: 250, y2: 250, delay: 0.4 },
  { x1: 345, y1: 155, x2: 440, y2: 345, delay: 1.1 },
];

const textVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const lineVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on the right panel
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#0a0a0a", color: "#fff" }}
    >
      {/* 64px grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: 1440 }}>
        <div className="grid lg:grid-cols-[1.15fr_1fr]" style={{ borderBottom: "1px solid #1a1a1a" }}>

          {/* ── LEFT: editorial slab ──────────────────────────── */}
          <motion.div
            className="px-4 py-20 md:px-16 md:py-24 lg:px-16 lg:py-28"
            style={{ borderRight: "1px solid #1a1a1a" }}
            initial="hidden"
            animate="show"
            variants={textVariants}
          >
            {/* Eyebrow */}
            <motion.div
              variants={lineVariant}
              className="flex flex-wrap items-center gap-3 mb-10 text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.14em" }}
            >
              <span>CFIA</span>
              <span className="w-6 h-px flex-shrink-0" style={{ background: "#2a2a2a" }} />
              <span>Centro de Formação em IA</span>
              <span className="hidden sm:block w-6 h-px flex-shrink-0" style={{ background: "#2a2a2a" }} />
              <span className="hidden sm:block">Est. 2024</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={lineVariant}
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.98,
                color: "#fff",
                marginBottom: "1.75rem",
              }}
            >
              Uma nova<br />
              geração de<br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "#4589ff" }}>profissionais</em><br />
              de IA começa aqui.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={lineVariant}
              className="text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "#8d8d8d" }}
            >
              Trilhas estruturadas, projetos reais e mentoria de quem constrói IA no mercado.
              Do primeiro modelo ao deploy em produção.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={lineVariant} className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/cadastro"
                className="btn-glow-white inline-flex items-center justify-center gap-3 px-7 py-4 font-semibold text-sm transition-all duration-200 hover:bg-[#e8e8e8] active:scale-[0.98]"
                style={{ background: "#fff", color: "#161616" }}
              >
                Começar gratuitamente <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cursos"
                className="inline-flex items-center justify-center gap-3 px-7 py-4 font-semibold text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/40"
                style={{ background: "transparent", color: "#fff", border: "1px solid #333" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l6 4-6 4z" fill="currentColor" />
                </svg>
                Ver trilhas · 2 min
              </Link>
            </motion.div>

            {/* Mini stats strip — animated counters */}
            <motion.div
              variants={lineVariant}
              className="grid grid-cols-3 pt-7 max-w-sm"
              style={{ borderTop: "1px solid #1f1f1f" }}
            >
              {[
                { target: 12400, prefix: "+", suffix: "", separator: true, label: "Alunos ativos" },
                { target: 97, prefix: "", suffix: "%", separator: false, label: "Taxa de conclusão" },
                { target: 4.9, prefix: "", suffix: "★", separator: false, decimals: 1, label: "Avaliação média" },
              ].map(({ target, prefix, suffix, separator, decimals, label }, i) => (
                <div
                  key={label}
                  className="pl-5 first:pl-0"
                  style={{ borderLeft: i > 0 ? "1px solid #1f1f1f" : "none" }}
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
                    <AnimatedNumber
                      target={target}
                      prefix={prefix}
                      suffix={suffix}
                      separator={separator}
                      decimals={decimals}
                      duration={1600}
                    />
                  </div>
                  <div
                    className="text-xs uppercase mt-1"
                    style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.08em" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: visual panel (desktop only) ───────────── */}
          <motion.div
            className="relative hidden lg:block"
            style={{ minHeight: 700, y: rightY }}
          >
            {/* Blue gradient panel */}
            <div
              className="absolute overflow-hidden"
              style={{
                inset: "40px 40px 40px 0",
                background: "linear-gradient(165deg, #0d4bdb 0%, #001f78 50%, #000a2e 100%)",
              }}
            >
              {/* ── Animated neural network ──────────────── */}
              <svg
                viewBox="0 0 500 700"
                width="100%"
                height="100%"
                className="absolute inset-0"
                aria-hidden="true"
              >
                {/* Static mesh lines (faint base) */}
                {Array.from({ length: COLS - 1 }, (_, col) =>
                  Array.from({ length: ROWS }, (_, r1) =>
                    Array.from({ length: ROWS }, (_, r2) => (
                      <line
                        key={`bg-${col}-${r1}-${r2}`}
                        x1={60 + col * 95} y1={60 + r1 * 95}
                        x2={60 + (col + 1) * 95} y2={60 + r2 * 95}
                        stroke="#a6c8ff"
                        strokeWidth="0.35"
                        opacity={((r1 * r2 + col) % 5 === 0) ? 0.12 : 0.04}
                      />
                    ))
                  )
                )}

                {/* Pulsing nodes */}
                {NODES.map(({ cx, cy, delay, duration }) => (
                  <circle
                    key={`n-${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill="#78a9ff"
                    style={{
                      animation: `nn-pulse ${duration}s ease-in-out ${delay}s infinite`,
                    }}
                  />
                ))}

                {/* Animated data-flow lines */}
                {FLOW_LINES.map((l, i) => {
                  const len = Math.hypot(l.x2 - l.x1, l.y2 - l.y1);
                  return (
                    <line
                      key={`flow-${i}`}
                      x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                      stroke="#4589ff"
                      strokeWidth="1.5"
                      strokeDasharray={len}
                      style={{
                        animation: `nn-flow 2.4s ease-in-out ${l.delay}s infinite`,
                      }}
                    />
                  );
                })}
              </svg>

              {/* Training log ticker */}
              <div
                className="absolute bottom-8 left-8 right-8 text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em" }}
              >
                <div className="flex justify-between mb-2 uppercase">
                  <span>LATEST · PROJECT_RUN_OUTPUT</span>
                  <span style={{ color: "#42be65" }}>● TRAINING</span>
                </div>
                <div
                  className="p-4 leading-loose"
                  style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
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
            <motion.div
              className="absolute top-20 right-8 w-72 p-5 bg-white"
              style={{ color: "#161616", boxShadow: "0 24px 64px rgba(0,0,0,0.55)" }}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
            </motion.div>

            {/* Floating metric tile */}
            <motion.div
              className="absolute w-44 bg-white p-5"
              style={{ bottom: 168, right: 0, color: "#161616", boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
                  <motion.div
                    key={i}
                    className="flex-1 h-5"
                    style={{ background: i < 19 ? "#0f62fe" : "#e0e0e0" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 1.4 + i * 0.03, ease: "easeOut" }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ── Social Proof / Partner Strip ───────────────────────────────────────────────
const COMPANIES = ["Google", "IBM", "Microsoft", "Amazon", "Nubank", "iFood", "Stone", "Mercado Livre"];

export function SocialProofBar() {
  return (
    <section style={{ background: "#0f0f0f", borderBottom: "1px solid #1a1a1a" }}>
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
                  style={{ border: "2px solid #0f0f0f" }}
                />
              ))}
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: "#fff" }}>+12.000 alunos</div>
              <div className="text-sm" style={{ color: "#525252" }}>já estão aprendendo IA</div>
            </div>
          </div>
          <p
            className="text-xs uppercase"
            style={{ fontFamily: "var(--font-mono)", color: "#393939", letterSpacing: "0.14em" }}
          >
            Nossos alunos trabalham em
          </p>
        </div>

        {/* Company wordmarks — hairline dark grid */}
        <div
          className="grid grid-cols-4 md:grid-cols-8"
          style={{ gap: 1, background: "#1a1a1a", border: "1px solid #1a1a1a" }}
        >
          {COMPANIES.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center"
              style={{ padding: "20px 12px", background: "#0f0f0f" }}
            >
              <span
                className="text-base font-bold whitespace-nowrap"
                style={{ color: "#2a2a2a" }}
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
