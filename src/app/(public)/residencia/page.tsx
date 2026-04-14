import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Calendar, Award, BookOpen, Globe, Star } from "lucide-react";

export const metadata = {
  title: "Programa de Residência em IA | CFIA",
};

export default function ResidenciaPage() {
  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ── */}
      <section
        className="pt-24 pb-20 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-8 bg-[#0f62fe]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d]">
              Programa exclusivo · Vagas limitadas
            </span>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1
                className="text-5xl md:text-[72px] font-light leading-[1.0] mb-8 text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Residência em<br />
                <span style={{ color: "#0f62fe" }}>Inteligência Artificial</span>
              </h1>
              <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed mb-10">
                Um programa intensivo de 6 meses projetado para transformar profissionais
                comprometidos nos próximos líderes de IA do Brasil. Por seleção. Vagas limitadas.
              </p>
              <div className="flex flex-wrap gap-[1px] bg-[#393939]">
                <Link
                  href="#candidatura"
                  className="h-16 px-10 flex items-center gap-3 font-semibold text-white transition-all hover:bg-[#0353e9]"
                  style={{ backgroundColor: "#0f62fe" }}
                >
                  Candidatar-se à próxima turma
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#programa"
                  className="h-16 px-10 flex items-center gap-3 font-semibold text-white transition-all hover:bg-[#262626]"
                  style={{ border: "1px solid #393939" }}
                >
                  Conhecer o programa
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-px bg-[#393939] border border-[#393939]">
              {[
                { label: "Duração", value: "6 meses" },
                { label: "Turmas por ano", value: "2 coortes" },
                { label: "Vagas por turma", value: "30 alunos" },
                { label: "Modalidade", value: "Remoto intensivo" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#1a1a1a] px-6 py-5 flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-[#6f6f6f]">{label}</span>
                  <span className="font-semibold text-white text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── O que é a Residência ── */}
      <section id="programa" className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                O programa
              </span>
              <h2 className="text-4xl font-light mb-6 leading-tight" style={{ color: "#161616" }}>
                Mais do que um curso. Uma imersão real.
              </h2>
              <p className="text-[#525252] leading-relaxed mb-6">
                A Residência em IA da CFIA foi desenhada a partir de modelos como os programas
                de pós-graduação executiva do MIT e Harvard Business School. O foco é na
                aplicação real, mentoria individual e construção de uma rede profissional de alto nível.
              </p>
              <p className="text-[#525252] leading-relaxed">
                Cada coorte reúne 30 profissionais selecionados que trabalham juntos em projetos
                reais, com acesso direto aos nossos professores e a líderes de mercado convidados.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                {
                  Icon: BookOpen,
                  title: "Currículo de alto nível",
                  desc: "Conteúdo desenvolvido com base nos programas mais rigorosos do mundo, adaptado para a realidade do mercado brasileiro.",
                },
                {
                  Icon: Users,
                  title: "Mentoria individual",
                  desc: "Cada residente recebe sessões semanais com um mentor sênior — um profissional ativo em posições de liderança em IA.",
                },
                {
                  Icon: Globe,
                  title: "Projetos com impacto real",
                  desc: "Trabalhe em desafios reais propostos por empresas parceiras. Seu projeto final vai para o portfólio e para o mercado.",
                },
                {
                  Icon: Star,
                  title: "Rede exclusiva",
                  desc: "Acesso permanente à comunidade CFIA Fellows — uma rede de ex-residentes em posições de liderança no Brasil e exterior.",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="bg-white p-8">
                  <div
                    className="h-10 w-10 flex items-center justify-center mb-5"
                    style={{ backgroundColor: "#edf5ff" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#0f62fe" }} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "#161616" }}>{title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Estrutura do programa ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light" style={{ color: "#161616", letterSpacing: "-0.02em" }}>
              Estrutura do programa
            </h2>
          </div>
          <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                fase: "Fase 01",
                periodo: "Meses 1–2",
                titulo: "Fundamentos e Nivelamento",
                desc: "Revisão de matemática, estatística, Python e fundamentos de ML. Todos os residentes partem do mesmo patamar técnico de excelência.",
              },
              {
                fase: "Fase 02",
                periodo: "Meses 3–4",
                titulo: "Especialização e Projetos",
                desc: "Aprofundamento na trilha escolhida (LLMs, Visão, MLOps ou Dados). Início do projeto real com empresa parceira e mentoria semanal.",
              },
              {
                fase: "Fase 03",
                periodo: "Mês 5",
                titulo: "Imersão de Liderança",
                desc: "Semanas temáticas com líderes convidados de Google, AWS, Nubank e outras. Foco em gestão de times de IA e tomada de decisão.",
              },
              {
                fase: "Fase 04",
                periodo: "Mês 6",
                titulo: "Demo Day e Certificação",
                desc: "Apresentação do projeto para banca de avaliadores do mercado. Emissão do certificado CFIA Fellows e conexão com recrutadores parceiros.",
              },
            ].map(({ fase, periodo, titulo, desc }) => (
              <div key={fase} className="bg-white p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#0f62fe]">{fase}</span>
                  <div className="text-xs text-[#8d8d8d] mt-1">{periodo}</div>
                </div>
                <div className="md:col-span-10">
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#161616" }}>{titulo}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Critérios de seleção ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Quem pode se candidatar
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                Buscamos os melhores. Independente de onde vieram.
              </h2>
              <ul className="space-y-4">
                {[
                  "Formação em área técnica (TI, Engenharia, Matemática, Física, Economia) ou experiência equivalente",
                  "Ao menos 1 ano de experiência profissional relevante",
                  "Conhecimento básico de Python ou disposição para nivelamento intensivo",
                  "Carta de motivação demonstrando objetivos claros na área de IA",
                  "Disponibilidade de 15–20 horas semanais durante os 6 meses",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#525252] leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#0f62fe" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Processo seletivo
              </span>
              <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
                {[
                  { etapa: "1", titulo: "Inscrição online", desc: "Formulário com dados profissionais e carta de motivação" },
                  { etapa: "2", titulo: "Teste técnico", desc: "Avaliação de raciocínio lógico e conceitos básicos de dados" },
                  { etapa: "3", titulo: "Entrevista", desc: "Conversa de 30 min com um membro do time da CFIA" },
                  { etapa: "4", titulo: "Resultado", desc: "Resposta em até 10 dias úteis após a entrevista" },
                ].map(({ etapa, titulo, desc }) => (
                  <div key={etapa} className="bg-white p-6 flex items-start gap-5">
                    <div
                      className="h-8 w-8 flex items-center justify-center shrink-0 font-bold text-sm text-white"
                      style={{ backgroundColor: "#0f62fe" }}
                    >
                      {etapa}
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: "#161616" }}>{titulo}</div>
                      <div className="text-xs text-[#525252]">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Depoimentos de residentes ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <h2 className="text-3xl font-light mb-12" style={{ color: "#161616" }}>
            O que dizem nossos residentes.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                quote: "A Residência mudou minha trajetória. Em 6 meses fui promovido a Tech Lead de IA na empresa onde trabalho. O projeto que desenvolvi virou produto real.",
                name: "Marcos Oliveira",
                title: "Tech Lead de IA · Turma 2023",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&q=80",
              },
              {
                quote: "Não é um curso. É uma aceleração de carreira. A mentoria e a rede que construí valem mais do que qualquer MBA que eu poderia ter feito.",
                name: "Fernanda Lima",
                title: "Cientista de Dados Sênior · Turma 2023",
                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&q=80",
              },
              {
                quote: "Fui contratado pelo Nubank três semanas depois do Demo Day. O projeto que apresentei foi o que abriu a porta. A CFIA entrega o que promete.",
                name: "Diego Santos",
                title: "ML Engineer · Nubank · Turma 2022",
                photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&q=80",
              },
            ].map(({ quote, name, title, photo }) => (
              <div key={name} className="bg-white p-8 flex flex-col">
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-[#0f62fe] text-[#0f62fe]" />
                  ))}
                </div>
                <p className="text-sm text-[#525252] leading-relaxed italic flex-1 mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3" style={{ borderTop: "1px solid #e0e0e0", paddingTop: "1.25rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={name}
                    className="h-10 w-10 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "#161616" }}>{name}</div>
                    <div className="text-xs text-[#8d8d8d]">{title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Próxima turma / CTA ── */}
      <section id="candidatura" className="py-24 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-200 block mb-4">
                Próxima turma · Agosto 2025
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-white mb-6"
                style={{ letterSpacing: "-0.02em" }}
              >
                Sua vaga está esperando por você.
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Inscrições abertas para a coorte de Agosto de 2025.
                Restam <strong className="text-white">14 vagas</strong> disponíveis.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-px bg-blue-400/20 border border-blue-300/20">
                {[
                  { label: "Início das aulas", value: "05 de Agosto de 2025" },
                  { label: "Prazo de inscrição", value: "20 de Julho de 2025" },
                  { label: "Investimento", value: "R$ 2.400 / mês ou R$ 12.000 à vista" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-blue-600/30 px-6 py-4 flex justify-between items-center">
                    <span className="text-blue-100 text-sm">{label}</span>
                    <span className="font-semibold text-white text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/cadastro"
                className="h-16 flex items-center justify-between px-8 bg-white font-bold text-lg transition-all hover:bg-[#f4f4f4]"
                style={{ color: "#0f62fe" }}
              >
                Enviar candidatura
                <ArrowRight className="h-6 w-6" />
              </Link>
              <p className="text-sm text-blue-200 text-center">
                Processo seletivo gratuito · Resultado em até 10 dias úteis
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
