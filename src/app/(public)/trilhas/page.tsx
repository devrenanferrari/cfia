import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";
import { RoadmapVisual } from "@/components/trilhas/roadmap-visual";
import { InterestForm } from "@/components/interest-form";

export const metadata = {
  title: "Trilhas de Carreira | CFIA",
  description: "Roadmaps visuais e interativos para quatro perfis de carreira em tecnologia e IA.",
};

export default function TrilhasPage() {
  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ── */}
      <section className="bg-black text-white py-24 px-4 md:px-8">
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="text-[11px] text-[#4589ff] uppercase font-mono tracking-[0.28em] mb-4">
                Trilhas de Carreira · Roadmaps Interativos
              </p>
              <h1
                className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)", letterSpacing: "-0.02em" }}
              >
                Saiba exatamente{" "}
                <em className="text-[#4589ff] not-italic">o que aprender</em>{" "}
                e em que ordem.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                Quatro perfis de carreira em tecnologia e IA, cada um com um roadmap visual
                e interativo. Clique em qualquer nó para entender o que ele é e por que importa.
              </p>
              <Link
                href="#roadmap"
                className="inline-flex items-center gap-2 bg-[#0f62fe] text-white px-6 py-4 font-bold transition-colors hover:bg-[#0353e9]"
              >
                Explorar roadmaps <ArrowRight className="h-5 w-5" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Como usar ── */}
      <section className="py-16 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f8faff" }}>
        <div className="mx-auto max-w-[1584px]">
          <ScrollReveal>
            <h2 className="text-xl font-bold mb-8 text-[#161616]">Como usar os roadmaps</h2>
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                step: "01",
                title: "Escolha seu perfil",
                desc: "Selecione qual carreira faz mais sentido para você agora. Pode trocar depois — o caminho não é linear.",
              },
              {
                step: "02",
                title: "Clique em cada nó",
                desc: "Cada ponto do mapa explica o que é o tópico, por que ele importa e quais tecnologias estão envolvidas.",
              },
              {
                step: "03",
                title: "Siga a trilha",
                desc: "A ordem importa. Fundamentos antes de avançado. O projeto final consolida tudo que você aprendeu.",
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="bg-white p-8 h-full">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.24em] block mb-3"
                    style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    PASSO {item.step}
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-[#0f62fe] mb-3" />
                  <h3 className="text-base font-semibold mb-2 text-[#161616]">{item.title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── Roadmap Visual ── */}
      <section id="roadmap" className="border-b border-[#e0e0e0]">
        <RoadmapVisual />
      </section>

      {/* ── Nota de honestidade ── */}
      <section className="py-12 px-4 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div
              className="p-6 border-l-4"
              style={{ borderColor: "#0f62fe", backgroundColor: "#ffffff" }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Transparência
              </p>
              <p className="text-sm text-[#525252] leading-relaxed">
                Esses roadmaps foram desenhados com base no que o mercado de tecnologia realmente pede.
                Os cursos estão em construção. A maioria dos nós ainda aparece como em breve.
                Isso é honesto: é melhor mostrar o caminho completo do que fingir que temos mais do que temos.
              </p>
            </div>
            <div className="p-6 bg-white border border-[#e0e0e0]">
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
              >
                Lista de interesse
              </p>
              <h2 className="text-xl font-semibold mb-2 text-[#161616]">
                Avise-me quando as trilhas forem liberadas.
              </h2>
              <p className="text-sm text-[#525252] leading-relaxed mb-5">
                Voce recebe um aviso quando novos cursos, trilhas e projetos praticos forem publicados.
              </p>
              <InterestForm source="trilhas" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
