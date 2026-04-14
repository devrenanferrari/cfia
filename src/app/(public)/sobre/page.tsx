import Link from "next/link";
import { ArrowRight, Target, Eye, Heart, Globe } from "lucide-react";

export const metadata = {
  title: "Sobre a CFIA | Plataforma de Formação em IA",
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
              Sobre a CFIA
            </span>
          </div>
          <h1
            className="text-5xl md:text-[64px] font-light leading-[1.05] mb-8 max-w-4xl text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            A escola que está formando os profissionais de IA do Brasil.
          </h1>
          <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed">
            Fundada com a missão de democratizar o acesso ao conhecimento em Inteligência Artificial,
            a CFIA forma engenheiros, cientistas e especialistas prontos para transformar o mercado.
          </p>
        </div>
      </section>

      {/* ── Números ── */}
      <section className="bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e0e0e0]">
          {[
            { value: "+12.000", label: "Alunos formados" },
            { value: "2021",    label: "Ano de fundação" },
            { value: "+40",     label: "Cursos ativos" },
            { value: "98%",     label: "Aprovação dos alunos" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white py-12 px-8 flex flex-col gap-2">
              <div
                className="text-4xl font-light tracking-tighter"
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
                Acreditamos que a Inteligência Artificial vai redefinir todas as profissões.
                Nossa missão é garantir que profissionais brasileiros estejam na vanguarda dessa transformação.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                {
                  Icon: Target,
                  title: "Missão",
                  text: "Democratizar o acesso à formação de qualidade em IA, transformando talentos brasileiros em profissionais de classe mundial.",
                },
                {
                  Icon: Eye,
                  title: "Visão",
                  text: "Ser a referência na formação de profissionais de Inteligência Artificial na América Latina até 2030.",
                },
                {
                  Icon: Heart,
                  title: "Valores",
                  text: "Excelência técnica, aprendizado contínuo, diversidade e impacto social positivo através da tecnologia.",
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

      {/* ── Nossa história ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Nossa história
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                De uma ideia a uma escola referência em IA.
              </h2>
              <div className="space-y-6 text-[#525252] leading-relaxed text-base">
                <p>
                  A CFIA nasceu em 2021 da frustração de um grupo de engenheiros de IA que percebeu
                  uma lacuna enorme no mercado brasileiro: profissionais com vontade de aprender,
                  mas sem acesso a conteúdo técnico de qualidade em português.
                </p>
                <p>
                  Começamos com um único curso de Machine Learning e uma comunidade de 300 alunos.
                  Em três anos, crescemos para mais de 12.000 alunos, 40 cursos e parcerias com
                  empresas como Google, AWS e Nubank.
                </p>
                <p>
                  Hoje somos reconhecidos como a principal escola de formação em IA do Brasil,
                  com alunos empregados nas maiores empresas de tecnologia do mundo.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                { year: "2021", event: "Fundação da CFIA com o primeiro curso de Machine Learning" },
                { year: "2022", event: "Lançamento das Trilhas de Carreira e parceria com Google" },
                { year: "2023", event: "Programa de Residência em IA e 5.000 alunos certificados" },
                { year: "2024", event: "Expansão para América Latina e 12.000 alunos ativos" },
              ].map(({ year, event }) => (
                <div key={year} className="bg-white p-8 flex items-start gap-6">
                  <span
                    className="font-mono text-sm font-bold shrink-0"
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

      {/* ── Impacto global ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="flex items-center gap-3 mb-12">
            <Globe className="h-5 w-5" style={{ color: "#0f62fe" }} />
            <h2 className="text-3xl font-light" style={{ color: "#161616" }}>
              Presença em todo o Brasil e além.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              { label: "São Paulo", alunos: "4.800+" },
              { label: "Rio de Janeiro", alunos: "2.100+" },
              { label: "Minas Gerais", alunos: "1.400+" },
              { label: "Nordeste", alunos: "2.200+" },
              { label: "Sul do Brasil", alunos: "1.100+" },
              { label: "Exterior", alunos: "400+" },
            ].map(({ label, alunos }) => (
              <div key={label} className="bg-white p-8 flex justify-between items-center">
                <span className="font-semibold" style={{ color: "#161616" }}>{label}</span>
                <span className="font-mono text-sm" style={{ color: "#0f62fe" }}>{alunos} alunos</span>
              </div>
            ))}
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
