import { ArrowRight, Code2 } from "lucide-react";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { CodePlayground } from "@/components/code-playground";

export const metadata = {
  title: "Laboratório Interativo | CFIA",
  description: "Dê os primeiros passos em Python e Inteligência Artificial diretamente no seu navegador.",
};

export default function LabPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header simplão tipo IBM */}
      <section className="bg-[#f4f4f4] py-16 px-4 md:px-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#edf5ff] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-[#0f62fe]" />
              </div>
              <span className="font-mono font-bold text-[#0f62fe] tracking-widest text-sm uppercase">
                Ambiente de Prática
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light mb-4 text-[#161616] tracking-tight">
              Laboratório Interativo.
            </h1>
            <p className="text-lg text-[#525252] max-w-2xl">
              Escreva em Python e execute Inteligência Artificial e Dados 100% no seu navegador. O WebAssembly isola e executa o código com a mesma segurança e recursos da infraestrutura da CFIA.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Code Editor Container */}
      <section className="py-12 px-4 md:px-8 bg-white flex-1">
        <div className="mx-auto max-w-[1584px]">
          <ScrollReveal delay={0.2} className="shadow-[0_4px_32px_rgba(0,0,0,0.1)]">
            <CodePlayground />
          </ScrollReveal>

          <ScrollReveal delay={0.3} className="mt-12 max-w-3xl border-l-[3px] border-[#0f62fe] pl-6 py-2">
            <h3 className="font-bold text-lg mb-2 text-[#161616]">Por que isso importa na sua formação?</h3>
            <p className="text-[#525252] leading-relaxed">
              Em nossos cursos fechados, a prática é a espinha dorsal de todo aprendizado. Este ambiente é embutido aula por aula, garantindo que você teste, erre e construa sem ter que configurar nenhum ambiente local antes de focar nos fundamentos técnicos corretos.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
