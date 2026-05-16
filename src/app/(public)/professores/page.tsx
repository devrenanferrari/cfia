import Link from "next/link";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";

export const metadata = {
  title: "Instrutor | CFIA",
};

export default function ProfessoresPage() {
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
              Instrutor
            </span>
          </div>
          <h1
            className="text-5xl md:text-[64px] font-light leading-[1.05] mb-8 max-w-3xl text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Aprenda com quem está aprendendo junto com você.
          </h1>
          <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed">
            O CFIA tem um único instrutor por enquanto — Renan Ferrari, estudante de Ciência da
            Computação que ensina o que sabe como projeto de extensão universitária. Sem grandes
            credenciais, com honestidade.
          </p>
        </div>
      </section>

      {/* ── Perfil do instrutor ── */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Foto placeholder */}
            <div className="lg:col-span-4">
              <div
                className="w-full max-w-xs aspect-square flex flex-col items-center justify-center border-2 border-dashed mb-6"
                style={{ borderColor: "#c6c6c6", backgroundColor: "#f4f4f4" }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "#edf5ff" }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
                  >
                    RF
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#8d8d8d" }}>Foto em breve</p>
              </div>

              <h2 className="text-2xl font-bold mb-1" style={{ color: "#161616" }}>Renan Ferrari</h2>
              <p className="text-base mb-4" style={{ color: "#0f62fe" }}>
                Estudante de Ciência da Computação
              </p>
              <p className="text-sm mb-1" style={{ color: "#525252" }}>
                Instrutor e fundador do CFIA
              </p>
              <p className="text-sm mb-6" style={{ color: "#525252" }}>
                Projeto de extensão universitária · 2026
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/renannferrari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 border transition-colors hover:border-[#161616]"
                  style={{ borderColor: "#e0e0e0", color: "#525252", textDecoration: "none" }}
                >
                  <ExternalLink className="h-4 w-4" /> GitHub
                </a>
                <a
                  href="mailto:gomesrenan514@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 border transition-colors hover:border-[#0f62fe]"
                  style={{ borderColor: "#e0e0e0", color: "#525252", textDecoration: "none" }}
                >
                  <Mail className="h-4 w-4" /> gomesrenan514@gmail.com
                </a>
              </div>
            </div>

            {/* Bio e detalhes */}
            <div className="lg:col-span-8">
              <div className="space-y-5 text-[#525252] leading-relaxed text-base mb-10">
                <p>
                  Sou estudante de Ciência da Computação apaixonado por programação, algoritmos e
                  inteligência artificial. Criei o CFIA como projeto de extensão da faculdade — uma forma
                  de compartilhar o que aprendo e tornar o conhecimento em tecnologia mais acessível.
                </p>
                <p>
                  Não tenho PhD nem 20 anos de mercado. Mas tenho a experiência de quem está
                  aprendendo na prática, estudando as melhores referências disponíveis e tentando
                  explicar coisas complexas de um jeito simples. Às vezes isso é mais útil do que
                  uma aula acadêmica densa.
                </p>
                <p>
                  Cada curso aqui foi feito com cuidado. Se algo estiver errado ou puder melhorar,
                  adoraria saber — este projeto cresce com feedback real.
                </p>
              </div>

              {/* Tags de tecnologia */}
              <div className="mb-10">
                <p
                  className="text-[10px] uppercase tracking-widest mb-4"
                  style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                >
                  Áreas de ensino
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Python", "Algoritmos", "Estrutura de Dados", "Machine Learning",
                    "IA Generativa", "JavaScript", "Desenvolvimento Web", "SQL",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1"
                      style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nota de transparência */}
              <div
                className="p-6 border-l-4"
                style={{ backgroundColor: "#f4f4f4", borderColor: "#0f62fe" }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
                >
                  Nota de transparência
                </p>
                <p className="text-sm text-[#525252] leading-relaxed">
                  Os cursos aqui são livres — não são pós-graduação, MBA ou graduação. O certificado
                  emitido é de conclusão de curso livre e não possui reconhecimento do MEC. O que vale
                  é o conhecimento que você vai adquirir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Seja um instrutor ── */}
      <section className="py-20 px-4 md:px-8 border-t border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-light mb-2" style={{ color: "#161616" }}>
              Sabe algo que vale a pena ensinar?
            </h2>
            <p className="text-[#525252]">
              Este projeto cresce com pessoas que querem compartilhar o que aprenderam.
            </p>
          </div>
          <Link
            href="/seja-instrutor"
            className="h-14 px-10 border font-semibold flex items-center gap-3 hover:bg-[#161616] hover:text-white hover:border-[#161616] transition-all shrink-0"
            style={{ color: "#161616", borderColor: "#161616" }}
          >
            Quero ser instrutor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
