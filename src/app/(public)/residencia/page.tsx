import Link from "next/link";
import { ArrowRight, CheckCircle2, BookOpen, Users, Globe, Star } from "lucide-react";

export const metadata = {
  title: "Mentoria | CFIA",
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
              Em planejamento · Em breve
            </span>
          </div>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1
                className="text-5xl md:text-[72px] font-light leading-[1.0] mb-8 text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                Programa de<br />
                <span style={{ color: "#0f62fe" }}>Mentoria</span>
              </h1>
              <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed mb-10">
                Estamos planejando um programa de acompanhamento individual para alunos que querem
                ir além dos cursos — com sessões de mentoria, revisão de código e projetos guiados.
                Ainda não está disponível, mas você pode demonstrar interesse.
              </p>
              <Link
                href="/contato"
                className="h-16 px-10 flex items-center gap-3 font-semibold text-white transition-all hover:bg-[#0353e9] self-start"
                style={{ backgroundColor: "#0f62fe" }}
              >
                Demonstrar interesse
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-px bg-[#393939] border border-[#393939]">
              {[
                { label: "Status", value: "Em planejamento" },
                { label: "Modalidade", value: "Remoto (online)" },
                { label: "Custo previsto", value: "A definir" },
                { label: "Início previsto", value: "A confirmar" },
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

      {/* ── O que estamos planejando ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                A ideia
              </span>
              <h2 className="text-4xl font-light mb-6 leading-tight" style={{ color: "#161616" }}>
                Mais do que um curso. Um acompanhamento real.
              </h2>
              <p className="text-[#525252] leading-relaxed mb-4">
                A ideia é simples: às vezes um curso não é suficiente. Você trava num projeto,
                tem dúvidas específicas sobre código, ou quer feedback de alguém que já passou pelo
                mesmo caminho.
              </p>
              <p className="text-[#525252] leading-relaxed">
                O programa de mentoria do CFIA vai oferecer exatamente isso — sessões individuais com
                o instrutor, revisão de código e projetos guiados. Gratuito ou com custo simbólico
                para manter o projeto sustentável.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
              {[
                {
                  Icon: BookOpen,
                  title: "Revisão de código",
                  desc: "Feedback direto no seu código, com explicações sobre o que melhorar e por quê.",
                },
                {
                  Icon: Users,
                  title: "Sessões individuais",
                  desc: "Conversa direta com o instrutor para tirar dúvidas e resolver bloqueios reais.",
                },
                {
                  Icon: Globe,
                  title: "Projetos guiados",
                  desc: "Trabalhe em projetos práticos com orientação — não apenas exercícios isolados.",
                },
                {
                  Icon: Star,
                  title: "Acompanhamento real",
                  desc: "Sem roteiro engessado. O foco é no que você precisa aprender no seu momento.",
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

      {/* ── Quem pode participar ── */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#8d8d8d] block mb-4">
                Para quem é
              </span>
              <h2 className="text-4xl font-light mb-8 leading-tight" style={{ color: "#161616" }}>
                Para quem quer aprender de verdade, não só assistir aulas.
              </h2>
              <ul className="space-y-4">
                {[
                  "Alunos que já fizeram algum curso aqui e querem ir além",
                  "Pessoas que travam em projetos práticos e precisam de um olhar externo",
                  "Quem quer aprender programação mas não sabe por onde continuar",
                  "Estudantes que querem construir um portfólio real com orientação",
                  "Quem tem tempo disponível e quer avançar de forma mais acelerada",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#525252] leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#0f62fe" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="p-8 border-l-4 self-start"
              style={{ backgroundColor: "#ffffff", borderColor: "#0f62fe" }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-4"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Nota importante
              </p>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Este programa ainda está em planejamento. Não há vagas abertas agora, nem
                preços definidos. Se você demonstrar interesse, vai ser o primeiro a saber quando
                começar.
              </p>
              <p className="text-sm text-[#525252] leading-relaxed">
                A ideia é que o modelo de negócio aqui ajude a manter os cursos gratuitos —
                quem pode pagar pela mentoria financia o acesso de quem não pode.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue-200 block mb-4">
                Avise-me quando abrir
              </span>
              <h2
                className="text-4xl md:text-5xl font-light text-white mb-6"
                style={{ letterSpacing: "-0.02em" }}
              >
                Quer ser avisado quando o programa começar?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Deixe seu contato e te aviso assim que houver novidades sobre o programa de mentoria.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                href="/contato"
                className="h-16 flex items-center justify-between px-8 bg-white font-bold text-lg transition-all hover:bg-[#f4f4f4]"
                style={{ color: "#0f62fe" }}
              >
                Demonstrar interesse
                <ArrowRight className="h-6 w-6" />
              </Link>
              <p className="text-sm text-blue-200 text-center">
                Sem compromisso · Gratuito para demonstrar interesse
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
