import Link from "next/link";
import { ArrowRight, Code2, Database, Terminal, BrainCircuit, CheckCircle2, Clock, Map } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";

export const metadata = {
  title: "Trilhas de Carreira | CFIA",
  description: "Formações completas em Inteligência Artificial para alavancar sua carreira no mercado tech.",
};

const tracks = [
  {
    id: "engenheiro-de-ia",
    number: "01",
    title: "Engenheiro de IA",
    desc: "A trila essencial para construir e colocar modelos de inteligência artificial em produção, estruturando APIs e aplicações reais do zero.",
    duration: "6 a 8 meses",
    salary: "R$ 14.000 a R$ 22.000",
    icon: Code2,
    skills: ["Python", "PyTorch", "Módulos FastAPI", "Docker", "Git"],
    modules: [
      "Lógica de Programação com Python",
      "Fundamentos Matemáticos para IA",
      "Arquitetura de Software e APIs",
      "Deploy em Containers",
      "Projeto: Criação de API de Visão Computacional"
    ]
  },
  {
    id: "cientista-de-dados",
    number: "02",
    title: "Cientista de Dados",
    desc: "A formação clássica para quem quer transformar dados brutos em insights e tomar decisões baseadas em modelagem estatística profunda.",
    duration: "4 a 6 meses",
    salary: "R$ 10.000 a R$ 18.000",
    icon: Database,
    skills: ["Python", "SQL Avançado", "Estatística", "Pandas & Numpy", "Machine Learning Clássico"],
    modules: [
      "SQL e Extração de Dados",
      "Análise Exploratória e Visualização",
      "Estatística para Data Science",
      "Modelagem Clássica de Machine Learning",
      "Projeto: Detecção de Fraude em Cartões"
    ]
  },
  {
    id: "ml-engineer",
    number: "03",
    title: "Engenheiro de Machine Learning",
    desc: "Voltado para infraestrutura escalável, MLOps, monitoramento de drift de dados e treinamento de modelos em clusters robustos.",
    duration: "6 a 8 meses",
    salary: "R$ 16.000 a R$ 26.000",
    icon: Terminal,
    skills: ["MLOps", "Kubernetes", "AWS SageMaker", "Airflow", "CI/CD para ML"],
    modules: [
      "Sistemas Distribuídos",
      "Pipeline de Dados e Airflow",
      "Continuous Integration e Continuous Training",
      "Infraestrutura AWS e Cloud",
      "Projeto: Refatorando um Modelo para MLOps"
    ]
  },
  {
    id: "ia-generativa",
    number: "04",
    title: "IA Generativa",
    desc: "Surfe a maior onda da atualidade. Domine os Grandes Modelos de Linguagem (LLMs), frameworks de orquestração e agentes autônomos.",
    duration: "4 a 5 meses",
    salary: "R$ 12.000 a R$ 20.000",
    icon: BrainCircuit,
    skills: ["LLMs", "RAG (Retrieval-Augmented Generation)", "LangChain", "Vector Databases", "Prompt Engineering"],
    modules: [
      "Fundamentos de Modelos de Linguagem",
      "Prompt Engineering Avançado",
      "Bancos de Dados Vetoriais",
      "Aplicações RAG com LangChain",
      "Projeto: Chatbot Especialista de Documentos Corporativos"
    ]
  }
];

export default function TrilhasPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-24 px-4 md:px-8">
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="text-[11px] text-[#4589ff] uppercase font-mono tracking-[0.28em] mb-4">
                Programas de Formação Profissional
              </p>
              <h1
                className="text-4xl md:text-6xl font-light mb-6 tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-serif, Georgia, serif)', letterSpacing: '-0.02em' }}
              >
                Desenvolva a <em className="text-[#4589ff] not-italic relative">sua carreira</em> e conquiste o mercado.
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                Nossas trilhas são programas intensivos focados em te ensinar exatamente o que a indústria demanda, construindo um portfólio prático do zero às entrevistas técnicas.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#trilhas"
                  className="inline-flex items-center gap-2 bg-[#0f62fe] text-white px-6 py-4 font-bold transition-colors hover:bg-[#0353e9]"
                >
                  Explorar trilhas <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/assinar"
                  className="inline-flex items-center gap-2 bg-transparent text-white border border-[#8d8d8d] px-6 py-4 font-bold transition-colors hover:border-white hover:bg-[#262626]"
                >
                  Ver planos de assinatura
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 px-4 md:px-8 border-b border-[#e0e0e0] bg-[#f8faff]">
        <div className="mx-auto max-w-[1584px]">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-10 text-[#161616]">O diferencial CFIA</h2>
          </ScrollReveal>
          
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {[
              {
                title: "Conteúdo focado no mercado",
                desc: "Sem teorias excessivas. Focamos no que os gestores de RH e Tech Leads validam como diferencial nas contratações."
              },
              {
                title: "Construção de Portfólio",
                desc: "Ao final de cada trilha, você construirá um projeto robusto de ponta a ponta para apresentar durante processos seletivos."
              },
              {
                title: "Certificação respeitada",
                desc: "Conquiste um certificado validado pelo CFIA a cada competência e uma certificação macro ao finalizar sua formação completa."
              }
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <div className="bg-white p-8 h-full transition-colors hover:bg-[#f4f4f4]">
                  <CheckCircle2 className="h-6 w-6 text-[#0f62fe] mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-[#161616]">{feature.title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{feature.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Tracks Details */}
      <section id="trilhas" className="py-24 px-4 md:px-8 bg-white">
        <div className="mx-auto max-w-[1584px]">
          <div className="flex flex-col gap-24">
            {tracks.map((track, i) => (
              <div key={track.id} className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start relative">
                {/* Visual Number on Desktop bg */}
                <div className="hidden lg:block absolute -left-12 top-0 text-[10rem] font-bold text-[#f4f4f4] select-none opacity-50 -z-10 leading-none">
                  {track.number}
                </div>

                <div className="lg:col-span-5">
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-[#edf5ff] flex items-center justify-center">
                        <track.icon className="w-6 h-6 text-[#0f62fe]" />
                      </div>
                      <span className="font-mono font-bold text-[#0f62fe] tracking-widest text-sm uppercase">
                        Trilha {track.number}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 text-[#161616]">{track.title}</h2>
                    <p className="text-lg text-[#525252] mb-8 leading-relaxed max-w-lg">
                      {track.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                      <div>
                        <p className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-1">Duração média</p>
                        <p className="flex items-center gap-2 font-semibold text-[#161616]">
                          <Clock className="w-4 h-4 text-[#0f62fe]" /> {track.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-1">Expectativa salarial (BR)</p>
                        <p className="flex items-center gap-2 font-semibold text-[#161616]">
                          <Map className="w-4 h-4 text-[#0f62fe]" /> {track.salary}
                        </p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <p className="text-[10px] text-[#8d8d8d] uppercase tracking-widest font-semibold mb-3">Tecnologias aprendidas</p>
                      <div className="flex flex-wrap gap-2">
                        {track.skills.map((skill) => (
                          <span key={skill} className="bg-[#f4f4f4] border border-[#e0e0e0] px-2 py-1 text-xs font-mono text-[#525252]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/cursos`}
                      className="inline-flex items-center gap-2 bg-[#0f62fe] text-white px-6 py-3 font-semibold text-sm transition-colors hover:bg-[#0353e9]"
                    >
                      Buscando cursos da trilha <ArrowRight className="h-4 w-4" />
                    </Link>
                  </ScrollReveal>
                </div>

                <div className="lg:col-span-6 lg:col-start-7 lg:mt-16">
                  <StaggerReveal className="flex flex-col border border-[#e0e0e0] border-b-0">
                    {track.modules.map((module, j) => (
                      <StaggerItem key={j}>
                        <div className="p-6 border-b border-[#e0e0e0] bg-white hover:bg-[#f8faff] transition-colors flex gap-4 items-start">
                          <span className="text-[#8d8d8d] font-mono text-xs font-bold leading-relaxed w-6 shrink-0 mt-0.5">
                            {(j + 1).toString().padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className="font-semibold text-[#161616] text-base">{module}</h4>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#edf5ff] py-24 px-4 md:px-8 border-t border-[#c0d8ff]">
        <div className="mx-auto max-w-[1584px] text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#161616]">
              Acesso total com a Assinatura CFIA
            </h2>
            <p className="text-[#525252] text-lg max-w-2xl mx-auto mb-10">
              Faça a assinatura e tenha acesso imediato a todas as trilhas, cursos avulsos, laboratórios práticos e materiais de apoio. O seu MBA em formato de streaming.
            </p>
            <Link
              href="/assinar"
              className="inline-flex items-center gap-2 bg-[#0f62fe] text-white px-8 py-4 font-bold text-base transition-colors hover:bg-[#0353e9]"
            >
              Assine agora e comece a aprender
              <ArrowRight className="h-5 w-5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
