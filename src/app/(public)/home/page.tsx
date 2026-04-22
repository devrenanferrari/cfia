export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { HeroSection, SocialProofBar } from "@/components/home/hero-section";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";
import { AnimatedNumber } from "@/components/home/animated-number";
import {
  ArrowRight,
  BookOpen,
  FolderGit2,
  Award,
  Briefcase,
} from "lucide-react";

async function getHomeData() {
  const featuredCourses = await prisma.course.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: { select: { name: true } },
      category: { select: { name: true } },
      _count: { select: { enrollments: true } },
    },
  });
  return { featuredCourses };
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className="block text-xs uppercase mb-4"
      style={{
        fontFamily: "var(--font-mono)",
        color: light ? "#4589ff" : "#0f62fe",
        letterSpacing: "0.14em",
      }}
    >
      {children}
    </span>
  );
}

function SerifH2({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-serif), Georgia, serif",
        fontWeight: 300,
        fontSize: "clamp(2rem, 4vw, 3.25rem)",
        letterSpacing: "-0.02em",
        lineHeight: 1.05,
        color: light ? "#fff" : "#161616",
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

export default async function HomePage() {
  const { featuredCourses } = await getHomeData();

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Parceiros ──────────────────────────────────────────── */}
      <SocialProofBar />

      {/* ── Trilhas de carreira ────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 mb-16 items-end">
            <ScrollReveal>
              <Eyebrow>Trilhas de carreira</Eyebrow>
              <SerifH2>
                Escolha sua{" "}
                <em style={{ fontStyle: "italic", color: "#0f62fe" }}>carreira</em> em IA.
              </SerifH2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg leading-relaxed" style={{ color: "#525252" }}>
                Quatro caminhos estruturados, cada um com currículo, projetos e mentoria
                para chegar preparado ao mercado.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal className="grid md:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                n: "01",
                title: "Engenheiro de IA",
                desc: "Construa e coloque modelos em produção com deploy real e arquitetura de sistemas.",
                dur: "6–8 meses",
                salary: "R$ 14–22k",
                stack: ["Python", "PyTorch", "Docker", "FastAPI"],
                iconPath: "M5 5h14v14H5zM9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4",
              },
              {
                n: "02",
                title: "Cientista de Dados",
                desc: "Transforme dados brutos em decisões inteligentes com análise e visualização.",
                dur: "4–6 meses",
                salary: "R$ 10–18k",
                stack: ["Python", "SQL", "Estatística", "BI"],
                iconPath: "M3 3v18h18M7 14l4-4 4 4 5-5",
              },
              {
                n: "03",
                title: "Engenheiro de ML",
                desc: "Treine, otimize e escale modelos em infraestrutura de produção.",
                dur: "6–8 meses",
                salary: "R$ 16–26k",
                stack: ["MLOps", "Kubernetes", "Airflow", "AWS"],
                iconPath: "M12 3a3 3 0 0 0-3 3v1.5a3 3 0 0 0-3 3V12a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-3a3 3 0 0 0-3-3v-1.5a3 3 0 0 0-3-3V6a3 3 0 0 0-3-3z",
              },
              {
                n: "04",
                title: "Especialista em IA Generativa",
                desc: "Crie aplicações modernas com LLMs, RAG e agentes de IA.",
                dur: "4–5 meses",
                salary: "R$ 12–20k",
                stack: ["LLMs", "RAG", "LangChain", "Vector DB"],
                iconPath: "M12 3l2 6 6 1-4.5 4 1 6-5-3-5 3 1-6L3 10l6-1z",
              },
            ].map((track) => (
              <StaggerItem key={track.n}>
                <Link
                  href="/cursos"
                  className="track-card group block bg-white p-10 relative hover:bg-[#f4f4f4] transition-colors h-full"
                >
                  {/* Arrow hover button */}
                  <div
                    className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center transition-all duration-200 border group-hover:bg-[#0f62fe] group-hover:border-[#0f62fe] group-hover:text-white"
                    style={{ borderColor: "#c6c6c6", color: "#161616" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <div className="flex gap-8">
                    <div className="flex-shrink-0">
                      <div
                        className="w-16 h-16 flex items-center justify-center mb-4"
                        style={{ background: "#edf5ff" }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="2">
                          <path d={track.iconPath} />
                        </svg>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-serif), Georgia, serif",
                          fontWeight: 300,
                          fontSize: "2.25rem",
                          color: "#0f62fe",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {track.n}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-2 pr-14" style={{ color: "#161616", letterSpacing: "-0.01em" }}>
                        {track.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: "#525252" }}>
                        {track.desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {track.stack.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1"
                            style={{ fontFamily: "var(--font-mono)", background: "#fff", border: "1px solid #e0e0e0", color: "#525252" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-5" style={{ borderTop: "1px solid #e0e0e0" }}>
                        <div>
                          <div className="text-xs uppercase mb-1" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.1em" }}>Duração</div>
                          <div className="text-sm font-semibold" style={{ color: "#161616" }}>{track.dur}</div>
                        </div>
                        <div>
                          <div className="text-xs uppercase mb-1" style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.1em" }}>Salário médio</div>
                          <div className="text-sm font-semibold" style={{ color: "#161616" }}>{track.salary}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Outcomes (dark) ────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8" style={{ background: "#0a0a0a", color: "#fff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 mb-16 items-end">
            <ScrollReveal>
              <Eyebrow light>Resultados que importam</Eyebrow>
              <SerifH2 light>
                O que acontece{" "}
                <em style={{ fontStyle: "italic", color: "#4589ff" }}>depois</em> da formação.
              </SerifH2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg leading-relaxed" style={{ color: "#525252" }}>
                Dados das turmas formadas entre 2024 e 2026. Acompanhamos cada aluno
                após a conclusão.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal
            className="grid grid-cols-2 lg:grid-cols-4 gap-px border border-[#1a1a1a]"
            style={{ background: "#1a1a1a" } as React.CSSProperties}
          >
            {[
              { target: 87, suffix: "%", label: "Conseguem vaga ou promoção em até 6 meses", n: "01" },
              { target: 42, prefix: "+", suffix: "%", label: "Aumento médio de salário após a formação", n: "02" },
              { target: 3.2, suffix: "×", decimals: 1, label: "Mais chamadas para entrevistas com portfólio", n: "03" },
              { target: 11, prefix: "R$ ", suffix: "k", label: "Salário mediano em primeiro cargo júnior", n: "04" },
            ].map((s) => (
              <StaggerItem key={s.n}>
                <div className="relative p-8 md:p-10" style={{ background: "#0a0a0a" }}>
                  <span
                    className="absolute top-5 right-5 text-xs"
                    style={{ fontFamily: "var(--font-mono)", color: "#2a2a2a" }}
                  >
                    {s.n}
                  </span>
                  <div
                    className="mb-5"
                    style={{
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontWeight: 400,
                      fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                      letterSpacing: "-0.03em",
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedNumber
                      target={s.target}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      decimals={(s as { decimals?: number }).decimals}
                      duration={1600}
                    />
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "#525252", maxWidth: 220 }}>
                    {s.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Como funciona ──────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-xl mb-16">
            <Eyebrow>Como funciona</Eyebrow>
            <SerifH2>
              Um caminho claro até{" "}
              <em style={{ fontStyle: "italic", color: "#0f62fe" }}>sua nova carreira</em>.
            </SerifH2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              { Icon: BookOpen, step: "01", title: "Aprenda", desc: "Cursos práticos e diretos ao ponto, com linguagem simples e sem jargão." },
              { Icon: FolderGit2, step: "02", title: "Construa", desc: "Desenvolva projetos reais para compor seu portfólio profissional." },
              { Icon: Award, step: "03", title: "Certifique-se", desc: "Receba certificados reconhecidos ao concluir cada trilha ou curso." },
              { Icon: Briefcase, step: "04", title: "Trabalhe", desc: "Prepare-se para vagas e oportunidades na área de IA com confiança." },
            ].map((step) => (
              <StaggerItem key={step.step}>
                <div className="bg-white p-10 flex flex-col h-full hover:bg-[#f4f4f4] transition-colors">
                  <div className="h-14 w-14 flex items-center justify-center mb-6" style={{ backgroundColor: "#edf5ff" }}>
                    <step.Icon className="h-7 w-7" style={{ color: "#0f62fe" }} />
                  </div>
                  <span className="text-xs font-bold mb-3 tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "#c6c6c6" }}>
                    PASSO {step.step}
                  </span>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#161616" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Cursos em destaque ─────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <ScrollReveal>
              <Eyebrow>Cursos em destaque</Eyebrow>
              <SerifH2>
                Comece pelos{" "}
                <em style={{ fontStyle: "italic", color: "#0f62fe" }}>mais populares</em>.
              </SerifH2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 font-semibold text-sm whitespace-nowrap transition-colors hover:text-[#0043ce]"
                style={{ color: "#0f62fe" }}
              >
                Ver todos os cursos <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            {featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
                {featuredCourses.map((course, i) => (
                  <div key={course.id} className="bg-white">
                    <CourseCard course={course} index={i} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
                <p style={{ color: "#8d8d8d" }}>Em breve, novos cursos disponíveis.</p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* ── Depoimentos ────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ background: "#f4f4f4" }}>
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-lg mb-14">
            <Eyebrow>Histórias reais</Eyebrow>
            <SerifH2>
              Do{" "}
              <em style={{ fontStyle: "italic" }}>primeiro modelo</em> ao primeiro cargo na área.
            </SerifH2>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              { q: "Em quatro meses eu saí de análise de dados em planilha para deploy de modelos em produção. A trilha de MLOps foi decisiva.", n: "Juliana Almeida", r: "ML Engineer · Nubank", g: ["#f4d3b3", "#c89474"] },
              { q: "Os projetos reais foram o que me destacaram em entrevista. Mostrei código, métricas e decisões — não só certificados.", n: "Thiago Nakamura", r: "Data Scientist · iFood", g: ["#b3d4ff", "#4589ff"] },
              { q: "A mentoria semanal me tirou de travas que eu teria sozinho. Paguei o curso em três meses com o aumento do novo cargo.", n: "Leticia Freitas", r: "AI Engineer · Stone", g: ["#b3e4c4", "#4a8a60"] },
            ].map((t, i) => (
              <StaggerItem key={i}>
                <figure className="bg-white p-10 m-0 flex flex-col h-full">
                  <span
                    className="mb-6"
                    style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: "4.5rem", lineHeight: 0.6, color: "#0f62fe" }}
                  >
                    &ldquo;
                  </span>
                  <blockquote className="text-base leading-relaxed mb-8 flex-1 m-0" style={{ color: "#161616" }}>
                    {t.q}
                  </blockquote>
                  <figcaption className="flex items-center gap-3.5 pt-5" style={{ borderTop: "1px solid #e0e0e0" }}>
                    <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${t.g[0]}, ${t.g[1]})` }} />
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#161616" }}>{t.n}</div>
                      <div className="text-xs" style={{ color: "#525252" }}>{t.r}</div>
                    </div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Projetos reais ─────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 mb-16 items-end">
            <ScrollReveal>
              <Eyebrow>Projetos reais</Eyebrow>
              <SerifH2>
                Aprenda fazendo,{" "}
                <em style={{ fontStyle: "italic", color: "#0f62fe" }}>não só assistindo</em>.
              </SerifH2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg leading-relaxed" style={{ color: "#525252" }}>
                Cada trilha inclui projetos práticos com código real que você pode mostrar
                para empregadores.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              { emoji: "💬", title: "Chatbot com IA", desc: "Crie um assistente virtual usando modelos de linguagem modernos." },
              { emoji: "🎯", title: "Sistema de recomendação", desc: "Recomende produtos, filmes ou conteúdos com ML supervisionado." },
              { emoji: "📊", title: "Análise de dados reais", desc: "Explore e visualize datasets reais para extrair insights de negócio." },
              { emoji: "🚀", title: "Deploy de modelo", desc: "Coloque um modelo de ML em produção e crie uma API para consumi-lo." },
            ].map((project) => (
              <StaggerItem key={project.title}>
                <div className="bg-white p-8 hover:bg-[#f4f4f4] transition-colors h-full">
                  <div className="text-4xl mb-5">{project.emoji}</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#161616" }}>{project.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{project.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Manifesto ──────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ background: "#edf5ff" }}>
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <Eyebrow>Manifesto</Eyebrow>
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                color: "#161616",
              }}
            >
              Acreditamos que o Brasil pode formar a próxima geração de profissionais de IA{" "}
              <em style={{ fontStyle: "italic", color: "#0f62fe" }}>sem copiar</em> o que vem de fora —
              construindo conhecimento próprio, em português, com a profundidade técnica que o mercado
              exige e a acessibilidade que nosso contexto pede.
            </p>
            <div
              className="mt-10 text-xs uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}
            >
              — Equipe CFIA
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────────────────────── */}
      <section className="py-28 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2
            className="text-white mb-6"
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Seu próximo passo na carreira{" "}
            <em style={{ fontStyle: "italic" }}>começa aqui</em>.
          </h2>
          <p className="text-xl mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Comece hoje e construa seu futuro na área de Inteligência Artificial.
          </p>
          <Link
            href="/cadastro"
            className="btn-glow-white inline-flex items-center gap-3 px-10 py-5 bg-white font-bold text-lg transition-all duration-200 hover:bg-[#f4f4f4] active:scale-[0.98]"
            style={{ color: "#0f62fe" }}
          >
            Começar gratuitamente
            <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sem cartão&nbsp;•&nbsp;Acesso imediato&nbsp;•&nbsp;Certificado incluso
          </p>
        </ScrollReveal>
      </section>

    </div>
  );
}
