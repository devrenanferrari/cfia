export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { HeroSection, SocialProofBar } from "@/components/home/hero-section";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";
import {
  ArrowRight,
  BookOpen,
  FolderGit2,
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

async function getHomeData() {
  const [featuredCourses, categories, banners] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        instructor: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      take: 1,
    }),
  ]);
  return { featuredCourses, categories, banner: banners[0] ?? null };
}

export default async function HomePage() {
  const { featuredCourses, categories, banner } = await getHomeData();

  return (
    <div className="flex flex-col" style={{ backgroundColor: "#ffffff" }}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <HeroSection categories={categories} />

      {/* ── Partner logos ────────────────────────────────────────── */}
      <SocialProofBar />

      {/* ── Goal cards ──────────────────────────────────────────── */}
      <section className="py-10 px-4 md:px-8 border-b" style={{ borderColor: "#e0e0e0", backgroundColor: "#f8faff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { Icon: TrendingUp, title: "Aprenda do zero", desc: "Cursos práticos que saem da teoria e entram na prática desde a primeira aula.", href: "/cursos", color: "#0f62fe" },
              { Icon: GraduationCap, title: "Obtenha certificado", desc: "Certificado de conclusão verificável incluído em todos os cursos.", href: "/cursos", color: "#0f62fe" },
              { Icon: ShieldCheck, title: "Acesso vitalício", desc: "Compre uma vez e assista quantas vezes quiser, para sempre.", href: "/cursos", color: "#0f62fe" },
            ].map(({ Icon, title, desc, href, color }) => (
              <Link
                key={title}
                href={href}
                className="group flex items-center gap-4 p-5 border transition-colors hover:border-[#0f62fe]"
                style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0", textDecoration: "none" }}
              >
                <div
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: "#edf5ff" }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#161616" }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#525252" }}>{desc}</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#0f62fe" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promotional banners ─────────────────────────────────── */}
      <section className="py-8 px-4 md:px-8 border-b" style={{ borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Admin-configurable banner */}
            {banner ? (
              <div
                className="relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]"
                style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
              >
                {banner.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={banner.imageUrl}
                    alt=""
                    className="absolute right-0 top-0 h-full object-cover pointer-events-none select-none"
                    style={{ maxWidth: "55%", opacity: 0.22 }}
                  />
                )}
                <div className="relative z-10">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.32em] mb-3"
                    style={{ opacity: 0.6, fontFamily: "var(--font-mono, monospace)" }}
                  >
                    Destaque
                  </p>
                  <h3
                    className="text-2xl font-bold mb-2 leading-tight"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-sm mb-5 max-w-xs" style={{ opacity: 0.75, lineHeight: 1.6 }}>
                      {banner.subtitle}
                    </p>
                  )}
                </div>
                {banner.ctaText && (
                  <Link
                    href={banner.ctaUrl}
                    className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold self-start"
                    style={{ backgroundColor: "#0f62fe", color: "#ffffff", textDecoration: "none" }}
                  >
                    {banner.ctaText} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ) : (
              /* Default banner when none configured */
              <div
                className="relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]"
                style={{ backgroundColor: "#edf5ff" }}
              >
                <div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.32em] mb-3"
                    style={{ color: "#0f62fe", opacity: 0.7, fontFamily: "var(--font-mono, monospace)" }}
                  >
                    Cursos de programação e IA
                  </p>
                  <h3
                    className="text-2xl font-bold mb-2 leading-tight"
                    style={{ color: "#161616", letterSpacing: "-0.01em" }}
                  >
                    Do zero à primeira vaga em tecnologia
                  </h3>
                  <p className="text-sm mb-5 max-w-xs" style={{ color: "#525252", lineHeight: 1.6 }}>
                    Aprenda com projetos reais e saia com portfólio e certificado em mãos.
                  </p>
                </div>
                <Link
                  href="/cursos"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold self-start"
                  style={{ backgroundColor: "#0f62fe", color: "#ffffff", textDecoration: "none" }}
                >
                  Ver cursos <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Value proposition card */}
            <div
              className="relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]"
              style={{ backgroundColor: "#161616" }}
            >
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.32em] mb-3"
                  style={{ color: "#4589ff", fontFamily: "var(--font-mono, monospace)" }}
                >
                  Por que a CFIA
                </p>
                <h3
                  className="text-2xl font-bold mb-2 text-white leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Conteúdo prático feito por quem realmente programa
                </h3>
                <p className="text-sm mb-5 max-w-xs" style={{ color: "#a8a8a8", lineHeight: 1.6 }}>
                  Sem teoria vazia. Cada curso é construído com projetos reais, código comentado e suporte ativo.
                </p>
              </div>
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold self-start border"
                style={{ borderColor: "#4589ff", color: "#4589ff", textDecoration: "none", backgroundColor: "transparent" }}
              >
                Saiba mais <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cursos em destaque ─────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 border-b" style={{ borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <ScrollReveal>
              <p
                className="text-[11px] uppercase tracking-[0.28em] mb-2"
                style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
              >
                Cursos em alta
              </p>
              <h2
                className="font-semibold"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#161616", letterSpacing: "-0.01em" }}
              >
                Os mais populares agora
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                style={{ color: "#0f62fe", textDecoration: "none" }}
              >
                Ver todos os cursos <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          </div>

          {featuredCourses.length > 0 ? (
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCourses.map((course, i) => (
                <StaggerItem key={course.id}>
                  <div style={{ border: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
                    <CourseCard course={course} index={i} />
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          ) : (
            <div
              className="text-center py-16 border"
              style={{ backgroundColor: "#f4f4f4", borderColor: "#e0e0e0" }}
            >
              <p className="text-sm" style={{ color: "#8d8d8d" }}>Em breve, novos cursos disponíveis.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Trilhas de carreira ────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 border-b" style={{ backgroundColor: "#f4f4f4", borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 mb-12 items-end">
            <ScrollReveal>
              <p
                className="text-[11px] uppercase tracking-[0.28em] mb-3"
                style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
              >
                Trilhas de carreira
              </p>
              <h2
                className="font-light"
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#161616",
                }}
              >
                Escolha sua{" "}
                <em style={{ fontStyle: "italic", color: "#0f62fe" }}>carreira</em> em IA.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-base leading-relaxed" style={{ color: "#525252" }}>
                Quatro caminhos estruturados, cada um com currículo e projetos práticos.
                As faixas salariais são referências de mercado, não resultados garantidos.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal className="grid md:grid-cols-2 gap-3">
            {[
              {
                n: "01", title: "Engenheiro de IA",
                desc: "Construa e coloque modelos em produção com deploy real e arquitetura de sistemas.",
                dur: "6–8 meses", salary: "R$ 14–22k",
                stack: ["Python", "PyTorch", "Docker", "FastAPI"],
              },
              {
                n: "02", title: "Cientista de Dados",
                desc: "Transforme dados brutos em decisões inteligentes com análise e visualização.",
                dur: "4–6 meses", salary: "R$ 10–18k",
                stack: ["Python", "SQL", "Estatística", "BI"],
              },
              {
                n: "03", title: "Engenheiro de ML",
                desc: "Treine, otimize e escale modelos em infraestrutura de produção.",
                dur: "6–8 meses", salary: "R$ 16–26k",
                stack: ["MLOps", "Kubernetes", "Airflow", "AWS"],
              },
              {
                n: "04", title: "IA Generativa",
                desc: "Crie aplicações modernas com LLMs, RAG e agentes de IA.",
                dur: "4–5 meses", salary: "R$ 12–20k",
                stack: ["LLMs", "RAG", "LangChain", "Vector DB"],
              },
            ].map((track) => (
              <StaggerItem key={track.n}>
                <Link
                  href="/cursos"
                  className="track-card group flex gap-5 bg-white p-7 border transition-colors hover:border-[#0f62fe]"
                  style={{ borderColor: "#e0e0e0", textDecoration: "none", display: "flex" }}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 flex items-center justify-center mb-3"
                      style={{ backgroundColor: "#edf5ff" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#0f62fe",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {track.n}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold mb-1.5" style={{ color: "#161616" }}>
                        {track.title}
                      </h3>
                      <ArrowRight
                        className="h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                        style={{ color: "#0f62fe" }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "#525252" }}>
                      {track.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {track.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5"
                          style={{
                            fontFamily: "var(--font-mono, monospace)",
                            backgroundColor: "#f4f4f4",
                            border: "1px solid #e0e0e0",
                            color: "#525252",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-6 pt-3" style={{ borderTop: "1px solid #f0f0f0" }}>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#8d8d8d" }}>
                          Duração
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "#161616" }}>
                          {track.dur}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: "#8d8d8d" }}>
                          Mercado
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "#0f62fe" }}>
                          {track.salary}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Como funciona ──────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 border-b" style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-xl mb-12">
            <p
              className="text-[11px] uppercase tracking-[0.28em] mb-3"
              style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
            >
              Como funciona
            </p>
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-serif, Georgia, serif)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#161616",
              }}
            >
              Um caminho claro até{" "}
              <em style={{ fontStyle: "italic", color: "#0f62fe" }}>sua nova carreira</em>.
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { Icon: BookOpen, step: "01", title: "Escolha um curso", desc: "Encontre o curso ideal para seu objetivo e adquira com acesso vitalício." },
              { Icon: FolderGit2, step: "02", title: "Construa projetos", desc: "Projetos reais para compor um portfólio profissional sólido." },
              { Icon: Award, step: "03", title: "Certifique-se", desc: "Receba certificados verificáveis ao concluir cada formação." },
              { Icon: Briefcase, step: "04", title: "Avance na carreira", desc: "Prepare-se para vagas e oportunidades na área de tecnologia e IA." },
            ].map((step) => (
              <StaggerItem key={step.step}>
                <div
                  className="p-7 flex flex-col h-full border transition-colors hover:border-[#0f62fe]"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
                >
                  <div
                    className="h-12 w-12 flex items-center justify-center mb-4"
                    style={{ backgroundColor: "#edf5ff" }}
                  >
                    <step.Icon className="h-6 w-6" style={{ color: "#0f62fe" }} />
                  </div>
                  <span
                    className="text-[10px] font-bold mb-2 tracking-[0.24em]"
                    style={{ fontFamily: "var(--font-mono, monospace)", color: "#c6c6c6" }}
                  >
                    PASSO {step.step}
                  </span>
                  <h3 className="text-base font-bold mb-2" style={{ color: "#161616" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Sobre a plataforma ─────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-8 border-b" style={{ backgroundColor: "#f4f4f4", borderColor: "#e0e0e0" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <p
                className="text-[11px] uppercase tracking-[0.28em] mb-3"
                style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
              >
                Sobre a CFIA
              </p>
              <h2
                className="font-light mb-5"
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "#161616",
                }}
              >
                Feito com cuidado,{" "}
                <em style={{ fontStyle: "italic", color: "#0f62fe" }}>para quem quer crescer</em>.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#525252" }}>
                A CFIA é uma plataforma de cursos práticos em programação e inteligência artificial.
                Cada curso é desenvolvido com projetos reais, linguagem clara e foco total em resultado.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#525252" }}>
                Não vendemos promessas vazias. Nosso compromisso é entregar conteúdo honesto,
                atualizado e aplicável — com certificado verificável e suporte ativo.
              </p>
              <ScrollReveal delay={0.1}>
                <a
                  href="/sobre"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "#0f62fe", textDecoration: "none" }}
                >
                  Conhecer a plataforma <ArrowRight className="h-4 w-4" />
                </a>
              </ScrollReveal>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div
                className="p-8 border"
                style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0", borderLeft: "3px solid #0f62fe" }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest mb-4"
                  style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                >
                  O que está incluído
                </p>
                {[
                  { label: "Tipo", value: "Cursos avulsos com preço único" },
                  { label: "Acesso", value: "Vitalício após a compra" },
                  { label: "Certificado", value: "Verificável online, incluso" },
                  { label: "Idioma", value: "Português" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between py-3"
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <span className="text-sm" style={{ color: "#8d8d8d" }}>{label}</span>
                    <span className="text-sm font-semibold" style={{ color: "#161616" }}>{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2
            className="text-white mb-5"
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Seu próximo passo na carreira{" "}
            <em style={{ fontStyle: "italic" }}>começa aqui</em>.
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.75)" }}>
            Escolha um curso, aprenda na prática e saia com certificado e portfólio.
          </p>
          <Link
            href="/cursos"
            className="btn-glow-white inline-flex items-center gap-3 px-8 py-4 bg-white font-bold text-base transition-colors hover:bg-[#f4f4f4]"
            style={{ color: "#0f62fe", textDecoration: "none" }}
          >
            Explorar cursos
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Acesso vitalício&nbsp;•&nbsp;Certificado incluso&nbsp;•&nbsp;Suporte ativo
          </p>
        </ScrollReveal>
      </section>

    </div>
  );
}
