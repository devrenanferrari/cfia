export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { HeroSection, SocialProofBar, StatsBar } from "@/components/home/hero-section";
import {
  ArrowRight,
  Brain,
  BarChart3,
  Cpu,
  Sparkles,
  BookOpen,
  FolderGit2,
  Award,
  Briefcase,
  Clock,
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

export default async function HomePage() {
  const { featuredCourses } = await getHomeData();

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Prova social ─────────────────────────────────────── */}
      <SocialProofBar />

      {/* ── Números ──────────────────────────────────────────── */}
      <StatsBar />

      {/* ── Trilhas de carreira ───────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 mb-5"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
            >
              Trilhas de carreira
            </span>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#161616", letterSpacing: "-0.02em" }}
            >
              Escolha sua carreira em Inteligência Artificial
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#525252" }}>
              Caminhos estruturados para você evoluir com clareza e chegar ao mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                Icon: Cpu,
                title: "Engenheiro de IA",
                desc: "Construa e coloque modelos em produção",
                duration: "6–8 meses",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: BarChart3,
                title: "Cientista de Dados",
                desc: "Transforme dados em decisões inteligentes",
                duration: "4–6 meses",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: Brain,
                title: "Engenheiro de Machine Learning",
                desc: "Treine, otimize e escale modelos",
                duration: "6–8 meses",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: Sparkles,
                title: "Especialista em IA Generativa",
                desc: "Crie aplicações modernas com IA",
                duration: "4–5 meses",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
            ].map((track) => (
              <div
                key={track.title}
                className="bg-white p-8 flex flex-col hover:bg-[#f4f4f4] transition-colors"
              >
                <div
                  className="h-12 w-12 flex items-center justify-center mb-6"
                  style={{ backgroundColor: track.bg }}
                >
                  <track.Icon className="h-6 w-6" style={{ color: track.color }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#161616" }}>
                  {track.title}
                </h3>
                <p className="text-sm mb-5 flex-1" style={{ color: "#525252" }}>
                  {track.desc}
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="h-4 w-4" style={{ color: "#8d8d8d" }} />
                  <span className="text-sm" style={{ color: "#525252" }}>{track.duration}</span>
                </div>
                <Link
                  href="/cursos"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 font-semibold text-sm transition-colors border hover:bg-[#0f62fe] hover:text-white hover:border-[#0f62fe]"
                  style={{ color: "#0f62fe", borderColor: "#0f62fe" }}
                >
                  Ver trilha <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Como funciona ─────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 mb-5"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
            >
              Como funciona
            </span>
            <h2
              className="text-4xl font-bold"
              style={{ color: "#161616", letterSpacing: "-0.02em" }}
            >
              Um caminho claro até sua nova carreira
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                Icon: BookOpen,
                step: "01",
                title: "Aprenda",
                desc: "Cursos práticos e diretos ao ponto, com linguagem simples e sem jargão.",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: FolderGit2,
                step: "02",
                title: "Construa",
                desc: "Desenvolva projetos reais para compor seu portfólio profissional.",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: Award,
                step: "03",
                title: "Certifique-se",
                desc: "Receba certificados reconhecidos ao concluir cada trilha ou curso.",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
              {
                Icon: Briefcase,
                step: "04",
                title: "Trabalhe",
                desc: "Prepare-se para vagas e oportunidades na área de IA com confiança.",
                color: "#0f62fe",
                bg: "#edf5ff",
              },
            ].map((step) => (
              <div key={step.step} className="bg-white p-10 flex flex-col items-center text-center">
                <div
                  className="h-14 w-14 flex items-center justify-center mb-5"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.Icon className="h-7 w-7" style={{ color: step.color }} />
                </div>
                <span
                  className="text-xs font-bold mb-2 tracking-widest"
                  style={{ color: "#c6c6c6" }}
                >
                  PASSO {step.step}
                </span>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#161616" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cursos em destaque ────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span
                className="inline-block text-sm font-semibold px-4 py-1.5 mb-5"
                style={{ backgroundColor: "#edf5ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
              >
                Cursos em destaque
              </span>
              <h2
                className="text-4xl font-bold"
                style={{ color: "#161616", letterSpacing: "-0.02em" }}
              >
                Comece pelos mais populares
              </h2>
            </div>
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 font-semibold text-sm whitespace-nowrap"
              style={{ color: "#0f62fe" }}
            >
              Ver todos os cursos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {featuredCourses.map((course, i) => (
                <div key={course.id} className="bg-white">
                  <CourseCard course={course} index={i} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-20 border border-[#e0e0e0]"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <p style={{ color: "#8d8d8d" }}>Em breve, novos cursos disponíveis.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Projetos reais ────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#edf5ff" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 mb-5"
              style={{ backgroundColor: "#d0e2ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
            >
              Projetos reais
            </span>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#161616", letterSpacing: "-0.02em" }}
            >
              Aprenda fazendo, não só assistindo
            </h2>
            <p className="text-xl max-w-xl mx-auto" style={{ color: "#525252" }}>
              Cada trilha inclui projetos práticos que você pode mostrar para empregadores
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#a6c8ff] border border-[#a6c8ff]">
            {[
              {
                emoji: "💬",
                title: "Chatbot com IA",
                desc: "Crie um assistente virtual inteligente usando modelos de linguagem modernos",
              },
              {
                emoji: "🎯",
                title: "Sistema de recomendação",
                desc: "Construa um sistema que recomenda produtos, filmes ou conteúdos para usuários",
              },
              {
                emoji: "📊",
                title: "Análise de dados reais",
                desc: "Explore e visualize datasets reais para extrair insights de negócio",
              },
              {
                emoji: "🚀",
                title: "Deploy de modelo",
                desc: "Coloque um modelo de ML em produção e crie uma API para consumi-lo",
              },
            ].map((project) => (
              <div
                key={project.title}
                className="bg-white p-8 hover:bg-[#f4f4f4] transition-colors"
              >
                <div className="text-4xl mb-4">{project.emoji}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "#161616" }}>
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                  {project.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jornada de aprendizado ────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 mb-5"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
            >
              Jornada de aprendizado
            </span>
            <h2
              className="text-4xl font-bold"
              style={{ color: "#161616", letterSpacing: "-0.02em" }}
            >
              Veja sua evolução na prática
            </h2>
          </div>

          <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              { label: "Fundamentos de IA",  done: true },
              { label: "Python e Dados",      done: true },
              { label: "Machine Learning",    done: false },
              { label: "Deep Learning",       done: false },
              { label: "Deploy e Produção",   done: false },
            ].map((step, i) => (
              <div
                key={step.label}
                className="flex items-center gap-4 p-5 transition-all"
                style={{ backgroundColor: step.done ? "#edf5ff" : "#ffffff" }}
              >
                <div
                  className="h-9 w-9 flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    backgroundColor: step.done ? "#0f62fe" : "#e0e0e0",
                    color: step.done ? "#ffffff" : "#8d8d8d",
                  }}
                >
                  {step.done ? "✓" : i + 1}
                </div>
                <span
                  className="font-semibold"
                  style={{ color: step.done ? "#0043ce" : "#525252" }}
                >
                  {step.label}
                </span>
                {!step.done && (
                  <span
                    className="ml-auto text-xs px-3 py-1 font-medium"
                    style={{ backgroundColor: "#f4f4f4", color: "#8d8d8d" }}
                  >
                    Próximo
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────── */}
      <section className="py-28 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Seu próximo passo na carreira começa aqui
          </h2>
          <p className="text-xl mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Comece hoje e construa seu futuro na área de Inteligência Artificial
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white font-bold text-lg transition-all hover:bg-[#f4f4f4] active:scale-[0.98]"
            style={{ color: "#0f62fe" }}
          >
            Começar gratuitamente
            <ArrowRight className="h-6 w-6" />
          </Link>
          <p className="mt-6 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sem cartão&nbsp;•&nbsp;Acesso imediato&nbsp;•&nbsp;Certificado incluso
          </p>
        </div>
      </section>

    </div>
  );
}
