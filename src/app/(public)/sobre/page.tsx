import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, ExternalLink, Mail } from "lucide-react";

export const metadata = {
  title: "Sobre | CFIA — Projeto de Extensão",
};

export default function SobrePage() {
  return (
    <div className="flex flex-col bg-white">

      {/* ── Header ── */}
      <section
        className="pt-24 pb-20 px-4 md:px-8 border-b"
        style={{ backgroundColor: "#161616", borderColor: "#393939" }}
      >
        <div className="mx-auto max-w-[1584px]">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-8 bg-[#0f62fe]" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d]">
              Projeto de extensão universitária
            </span>
          </div>
          <h1
            className="text-5xl md:text-[64px] font-light leading-[1.05] mb-8 max-w-4xl text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Feito por um estudante. Para estudantes.
          </h1>
          <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed">
            O CFIA é um projeto de extensão universitária criado por Renan Ferrari,
            estudante de Ciência da Computação. Nasceu da vontade de compartilhar o que aprendo
            — e de tornar o acesso ao conhecimento em tecnologia mais fácil para quem está começando.
          </p>
        </div>
      </section>

      {/* ── Dados honestos ── */}
      <section className="bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e0e0e0]">
          {[
            { value: "2025",         label: "Ano de criação" },
            { value: "Cursos livres", label: "Sem pós-grad ou MBA" },
            { value: "100% grátis",  label: "Acesso ao conteúdo" },
            { value: "Crescendo",    label: "Plataforma em construção" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white py-12 px-8 flex flex-col gap-2">
              <div
                className="text-3xl font-light tracking-tighter"
                style={{ color: "#0f62fe", letterSpacing: "-0.02em" }}
              >
                {value}
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#6f6f6f]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Missão, Visão, Valores ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl font-light mb-6 leading-tight" style={{ color: "#161616" }}>
                O que nos<br />move.
              </h2>
              <p className="text-sm text-[#525252] leading-relaxed">
                Acreditamos que o conhecimento em tecnologia deve ser acessível a qualquer pessoa,
                independente de onde veio ou quanto pode pagar.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                {
                  Icon: Target,
                  title: "Missão",
                  text: "Compartilhar conhecimento em programação e inteligência artificial de forma honesta, prática e gratuita — como um projeto de extensão que leva aprendizado para além das paredes da faculdade.",
                },
                {
                  Icon: Eye,
                  title: "Visão",
                  text: "Ser um espaço onde qualquer pessoa possa aprender tecnologia do zero, sem barreiras financeiras e com conteúdo de qualidade feito por quem está aprendendo junto.",
                },
                {
                  Icon: Heart,
                  title: "Valores",
                  text: "Honestidade sobre o que somos, transparência sobre o que podemos oferecer, aprendizado contínuo e acesso livre ao conhecimento.",
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="bg-white p-10">
                  <div
                    className="h-10 w-10 flex items-center justify-center mb-6"
                    style={{ backgroundColor: "#edf5ff" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#0f62fe" }} />
                  </div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: "#161616" }}>{title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Fundador ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Quem fez isso
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                Uma pessoa, uma ideia, uma plataforma.
              </h2>
              <div className="space-y-5 text-[#525252] leading-relaxed text-base">
                <p>
                  Meu nome é Renan Ferrari. Sou estudante de Ciência da Computação e criei o CFIA
                  como projeto de extensão da faculdade — uma forma de transformar o que aprendo em
                  algo útil para outras pessoas.
                </p>
                <p>
                  A ideia é simples: ensinar o que sei, com honestidade. Não tem PhD aqui, não tem
                  empresa por trás, não tem currículo de Harvard. Tem um estudante que gosta
                  de tecnologia e quer compartilhar isso.
                </p>
                <p>
                  A plataforma é nova. Os cursos são livres e gratuitos. O certificado é de conclusão
                  — não vale como pós-graduação ou MBA, porque não sou uma instituição de ensino
                  regulamentada. Mas vale pelo conhecimento que você vai construir.
                </p>
              </div>

              {/* Social links */}
              <div className="flex gap-4 mt-8">
                <a
                  href="https://github.com/renannferrari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 border transition-colors hover:border-[#161616]"
                  style={{ borderColor: "#e0e0e0", color: "#525252", textDecoration: "none" }}
                >
                  <ExternalLink className="h-4 w-4" /> GitHub
                </a>
                <a
                  href="mailto:gomesrenan514@gmail.com"
                  className="flex items-center gap-2 text-sm font-semibold px-4 py-2 border transition-colors hover:border-[#0f62fe]"
                  style={{ borderColor: "#e0e0e0", color: "#525252", textDecoration: "none" }}
                >
                  <Mail className="h-4 w-4" /> Contato
                </a>
              </div>
            </div>

            {/* Foto placeholder */}
            <div>
              <div
                className="w-full aspect-square max-w-sm flex flex-col items-center justify-center border-2 border-dashed"
                style={{ borderColor: "#c6c6c6", backgroundColor: "#ffffff" }}
              >
                <div
                  className="w-24 h-24 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#edf5ff" }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    RF
                  </span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "#161616" }}>Renan Ferrari</p>
                <p className="text-xs mt-1" style={{ color: "#8d8d8d" }}>Foto em breve</p>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold mb-1" style={{ color: "#161616" }}>Renan Ferrari</p>
                <p className="text-sm" style={{ color: "#0f62fe" }}>Estudante de Ciência da Computação</p>
                <p className="text-sm mt-1" style={{ color: "#525252" }}>Instrutor e fundador do CFIA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nossa história ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                A história
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                Em construção desde o começo.
              </h2>
              <div className="space-y-5 text-[#525252] leading-relaxed text-base">
                <p>
                  O CFIA não nasceu de um investimento ou de um time de 20 pessoas. Nasceu de um projeto
                  de extensão universitária e da vontade de ensinar o que sei.
                </p>
                <p>
                  É uma plataforma jovem. Ainda estamos crescendo. Mas cada curso aqui foi feito com
                  cuidado — não existe conteúdo de mentira, professor falso ou número inventado.
                  O que você vê é o que existe.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                { year: "2025", event: "Criação do CFIA como projeto de extensão universitária" },
                { year: "2025", event: "Desenvolvimento da plataforma do zero — um estudante, do início ao deploy" },
                { year: "Em breve", event: "Primeiros cursos publicados e alunos certificados" },
                { year: "Futuro", event: "Novos cursos, novos instrutores e talvez patrocínios para manter o acesso gratuito" },
              ].map(({ year, event }, i) => (
                <div key={i} className="bg-white p-8 flex items-start gap-6">
                  <span
                    className="font-mono text-sm font-bold shrink-0 w-20"
                    style={{ color: "#0f62fe" }}
                  >
                    {year}
                  </span>
                  <p className="text-sm text-[#525252] leading-relaxed">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparência ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Transparência
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                O que somos. O que não somos.
              </h2>
            </div>
            <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                { check: true,  text: "Cursos livres e gratuitos para qualquer pessoa" },
                { check: true,  text: "Certificado de conclusão verificável online" },
                { check: true,  text: "Conteúdo real, criado com cuidado por quem está aprendendo" },
                { check: false, text: "Não somos instituição de ensino regulamentada pelo MEC" },
                { check: false, text: "Não ofertamos pós-graduação, MBA ou especialização" },
                { check: false, text: "Não temos dezenas de professores — ainda" },
              ].map(({ check, text }, i) => (
                <div key={i} className="bg-white px-8 py-5 flex items-start gap-4">
                  <div
                    className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: check ? "#edf5ff" : "#fff1f1",
                      color: check ? "#0f62fe" : "#da1e28",
                    }}
                  >
                    {check ? "✓" : "✗"}
                  </div>
                  <p className="text-sm text-[#525252] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <div className="mx-auto max-w-[1584px] flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="text-4xl font-light text-white leading-tight">
            Faça parte desta história.
          </h2>
          <Link
            href="/cadastro"
            className="h-16 px-12 bg-white font-bold flex items-center gap-4 hover:bg-[#f4f4f4] transition-all shrink-0"
            style={{ color: "#0f62fe" }}
          >
            Começar gratuitamente <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
