export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Award, 
  Briefcase, 
  GraduationCap
} from "lucide-react";

async function getHomeData() {
  const [featuredCourses, newsList, stats] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        instructor: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.news.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.$transaction([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.certificate.count()
    ])
  ]);
  
  return { 
    featuredCourses, 
    newsList,
    stats: {
      students: stats[0],
      courses: stats[1],
      certificates: stats[2]
    }
  };
}

export default async function HomePage() {
  const { featuredCourses, newsList, stats } = await getHomeData();

  return (
    <div className="flex flex-col">
      {/* ── 1. Carbon Hero: Alto Impacto ─────────────────────────── */}
      <section 
        className="pt-24 pb-20 px-4 md:px-8 border-b" 
        style={{ backgroundColor: "var(--cds-text-primary)", color: "#ffffff", borderColor: "var(--cds-border-strong)" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div 
                className="inline-flex items-center px-4 py-2 border mb-8 text-xs font-mono uppercase tracking-widest"
                style={{ borderColor: "var(--cds-border-strong)", color: "var(--cds-text-secondary)" }}
              >
                Acesso Ilimitado • Novas Turmas Abertas
              </div>
              <h1 className="text-5xl md:text-[64px] font-light leading-[1.1] mb-8" style={{ letterSpacing: "-0.01em" }}>
                Referência em conhecimento de Inteligência Artificial no Brasil.
              </h1>
              <p className="text-lg md:text-xl mb-12 max-w-2xl font-light" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.6" }}>
                Aprenda machine learning fundamental, deep learning e engenharia de dados com especialistas do mercado. Conteúdo avançado com a melhor densidade acadêmica, por um preço extremamente acessível.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/assinar"
                  className="flex items-center justify-between h-14 px-6 transition-colors shadow-none"
                  style={{ 
                    backgroundColor: "var(--cds-interactive)", 
                    color: "#ffffff",
                    width: "fit-content",
                    minWidth: "240px"
                  }}
                >
                  <span className="font-semibold text-base mr-12">Assinar Plataforma</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/cursos"
                  className="flex items-center justify-between h-14 px-6 transition-colors border"
                  style={{ 
                    borderColor: "var(--cds-border-strong)", 
                    color: "#ffffff",
                    width: "fit-content",
                    minWidth: "240px",
                    backgroundColor: "transparent"
                  }}
                >
                  <span className="font-semibold text-base mr-12">Explorar Catálogo</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block lg:col-span-5">
              <div className="w-full aspect-square border" style={{ borderColor: "var(--cds-border-strong)", backgroundColor: "var(--cds-layer-01)" }}>
                {/* Minimalist Graphic for Hero */}
                <div className="w-full h-full p-8 flex flex-col justify-end grid-bg relative overflow-hidden">
                  <div className="absolute inset-0" style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "32px 32px"
                  }}/>
                  <div className="relative z-10 p-6 border bg-[var(--cds-text-primary)]" style={{ borderColor: "var(--cds-border-strong)" }}>
                    <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "var(--cds-text-secondary)" }}>CFIA / Output</div>
                    <div className="flex items-end gap-4">
                       <div className="h-full border-l-2 pl-4" style={{ borderColor: "var(--cds-interactive)" }}>
                         <div className="text-4xl font-light text-white mb-1">{stats.students}+</div>
                         <div className="text-sm font-mono" style={{ color: "var(--cds-text-secondary)" }}>Alunos Matriculados</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Propositions (Porque o CFIA?) ─────────────────────────── */}
      <section className="py-20 px-4 md:px-8 border-b" style={{ backgroundColor: "var(--cds-background)", borderColor: "var(--cds-border-subtle)" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ backgroundColor: "var(--cds-border-subtle)" }}>
            {[
              {
                icon: Briefcase,
                title: "Foco no Mercado de Trabalho",
                desc: "Esqueça tutoriais rasos. Você construirá projetos reais e completos: desde algoritmos preditivos básicos até finetuning de LLMs usando infraestrutura moderna, exatamente como as big techs fazem."
              },
              {
                icon: Award,
                title: "Certificação Institucional",
                desc: "Todo conhecimento adquirido é testado. Nossos certificados não atestam apenas participação de vídeos, mas resultados concretos que alavancam o seu currículo em processos seletivos concorridos."
              },
              {
                icon: GraduationCap,
                title: "Professores Nível Senior",
                desc: "Você não aprenderá com criadores de conteúdo casuais, mas com engenheiros e cientistas de dados líderes técnicos resolvendo problemas de grande escala todos os dias."
              }
            ].map((prop, i) => (
              <div key={i} className="bg-white p-12 transition-colors hover:bg-[var(--cds-layer-01)] group">
                <div className="h-14 w-14 border mb-8 flex items-center justify-center transition-colors group-hover:bg-[var(--cds-layer-02)]" style={{ borderColor: "var(--cds-border-strong)" }}>
                  <prop.icon className="h-6 w-6" style={{ color: "var(--cds-interactive)" }} />
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: "var(--cds-text-primary)" }}>{prop.title}</h3>
                <p className="text-base" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.6" }}>
                  {prop.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Cursos em Destaque ────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white" style={{ borderBottom: "1px solid var(--cds-border-subtle)" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="font-mono text-sm uppercase tracking-widest block mb-4" style={{ color: "var(--cds-text-helper)" }}>01. Currículo Técnico</span>
              <h2 className="text-4xl md:text-[40px] font-light leading-none mb-4" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
                Programas de Formação
              </h2>
              <p className="text-lg" style={{ color: "var(--cds-text-secondary)" }}>
                Cursos estruturados para transformar iniciantes em especialistas através de aplicações matemáticas, algoritmos robustos e práticas de engenharia de software rigorosas.
              </p>
            </div>
            <Link 
              href="/cursos" 
              className="flex items-center gap-2 text-sm font-semibold transition-colors shrink-0 p-4 border hover:bg-[var(--cds-layer-01)]"
              style={{ color: "var(--cds-text-primary)", borderColor: "var(--cds-border-strong)" }}
            >
              Catálogo Completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[1px] bg-[var(--cds-border-subtle)] border border-[var(--cds-border-subtle)]">
            {featuredCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>
      
      {/* ── 4. Notícias / Institucional ─────────────────────────────────────── */}
      <section 
        className="py-24 px-4 md:px-8 border-b" 
        style={{ borderColor: "var(--cds-border-subtle)", backgroundColor: "var(--cds-layer-01)" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-2xl mb-12">
            <span className="font-mono text-sm uppercase tracking-widest block mb-4" style={{ color: "var(--cds-text-helper)" }}>02. Sala de Imprensa</span>
            <h2 className="text-[40px] font-light leading-tight" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
              Atualizações e Entregas
            </h2>
          </div>

          {newsList.length === 0 ? (
            <div className="py-12 border-t" style={{ borderColor: "var(--cds-border-subtle)" }}>
              <p className="text-sm" style={{ color: "var(--cds-text-secondary)" }}>Centro de imprensa temporariamente sem atividades abertas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1px]" style={{ backgroundColor: "var(--cds-border-subtle)" }}>
              {newsList.map((news) => (
                <div 
                  key={news.id} 
                  className="bg-white p-8 flex flex-col justify-between transition-colors hover:bg-white cursor-pointer group hover:scale-[1.01] duration-300"
                  style={{ minHeight: "320px", border: "1px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--cds-interactive)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Calendar className="h-4 w-4" style={{ color: "var(--cds-text-helper)" }} />
                      <time className="text-sm font-mono uppercase tracking-widest" style={{ color: "var(--cds-text-secondary)" }}>
                        {new Intl.DateTimeFormat('pt-BR').format(news.createdAt)}
                      </time>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 leading-snug" style={{ color: "var(--cds-text-primary)" }}>
                      {news.title}
                    </h3>
                    <p className="text-base line-clamp-3" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.6" }}>
                      {news.summary}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 font-medium text-sm" style={{ color: "var(--cds-interactive)" }}>
                    Leia o artigo completo <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. Pricing (Vendas Diretas) ────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b" style={{ borderColor: "var(--cds-border-subtle)" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-sm uppercase tracking-widest block mb-4" style={{ color: "var(--cds-text-helper)" }}>03. Planos Comerciais</span>
            <h2 className="text-[40px] font-light leading-tight mb-6" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
              Invista na sua excelência técnica
            </h2>
            <p className="text-lg" style={{ color: "var(--cds-text-secondary)" }}>
              Escolha a rota de aprendizagem que se adequa ao seu momento. Comece pelos cursos introdutórios ou assine o plano completo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Conta Gratuita */}
            <div className="p-10 border transition-all duration-300 hover:border-[var(--cds-interactive)]" style={{ borderColor: "var(--cds-border-subtle)", backgroundColor: "var(--cds-background)" }}>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: "var(--cds-text-primary)" }}>Acesso Base</h3>
              <p className="text-sm mb-6" style={{ color: "var(--cds-text-secondary)", minHeight: "40px" }}>Para estudantes e curiosos que desejam dar os primeiros passos.</p>
              
              <div className="text-[48px] font-light mb-8" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
                Grátis
              </div>
              
              <ul className="space-y-4 mb-10">
                {["Acesso restrito a cursos introdutórios (Beginner)", "Materiais de leitura básicos", "Fórum da comunidade"].map((feat, i) => (
                  <li key={i} className="flex gap-3 text-base" style={{ color: "var(--cds-text-secondary)" }}>
                    <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: "var(--cds-text-helper)" }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/cadastro"
                className="flex items-center justify-between h-14 px-6 border transition-colors w-full bg-[var(--cds-layer-01)] hover:bg-[var(--cds-layer-02)]"
                style={{ borderColor: "var(--cds-border-strong)", color: "var(--cds-text-primary)" }}
              >
                <span className="font-semibold text-base">Criar conta free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Plano Premium */}
            <div className="p-10 border-2 relative" style={{ borderColor: "var(--cds-interactive)", backgroundColor: "var(--cds-text-primary)" }}>
              <div 
                className="absolute top-0 right-0 px-4 py-1 text-xs font-mono uppercase tracking-widest font-semibold"
                style={{ backgroundColor: "var(--cds-interactive)", color: "white", transform: "translateY(-50%)" }}
              >
                Recomendado
              </div>
              <h3 className="text-2xl font-semibold mb-2" style={{ color: "#ffffff" }}>Acesso Premium</h3>
              <p className="text-sm mb-6" style={{ color: "var(--cds-text-secondary)", minHeight: "40px" }}>Acesso irrestrito a todas as dependências da plataforma por um valor incrivelmente acessível.</p>
              
              <div className="flex items-end gap-2 mb-8">
                <span className="text-[48px] font-light leading-none" style={{ color: "#ffffff", letterSpacing: "0" }}>R$49</span>
                <span className="text-base font-normal pb-2" style={{ color: "var(--cds-text-secondary)" }}>/mês</span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Acesso irrestrito a TODOS os cursos", 
                  "Certificados vitalícios verificáveis e oficiais", 
                  "Repositórios de código dos instrutores", 
                  "Prioridade no suporte técnico"
                ].map((feat, i) => (
                  <li key={i} className="flex gap-3 text-base text-white">
                    <CheckCircle2 className="h-6 w-6 shrink-0" style={{ color: "var(--cds-interactive)" }} />
                    <span style={{ color: "var(--cds-text-secondary)" }}>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/assinar"
                className="flex items-center justify-between h-14 px-6 transition-colors w-full"
                style={{ backgroundColor: "var(--cds-interactive)", color: "#ffffff" }}
              >
                <span className="font-semibold text-base">Assinar agora</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Final CTA (Carbon Band) ───────────────────────────────── */}
      <section 
        className="py-20 px-4 md:px-8"
        style={{ backgroundColor: "var(--cds-text-primary)" }}
      >
        <div className="mx-auto max-w-[1584px] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[40px] font-light mb-4 text-white leading-tight" style={{ letterSpacing: "0" }}>
              Inicie sua jornada hoje
            </h2>
            <p className="text-lg" style={{ color: "var(--cds-text-secondary)" }}>
              Pare de atrasar seu crescimento técnico. Cadastre-se na CFIA.
            </p>
          </div>
          
          <Link
            href="/cadastro"
            className="flex items-center justify-between h-16 px-8 transition-colors shrink-0"
            style={{ 
              backgroundColor: "var(--cds-interactive)", 
              color: "#ffffff",
              minWidth: "280px"
            }}
          >
            <span className="font-semibold text-lg mr-8">Criar Conta Agora</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
