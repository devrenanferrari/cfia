import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Professores | CFIA",
};

const PROFESSORS = [
  {
    name: "Dr. Rafael Mendonça",
    role: "Engenharia de IA & LLMs",
    bio: "PhD em Ciência da Computação pela USP. Ex-pesquisador do Google Brain. 12 anos de experiência em sistemas de IA em larga escala.",
    courses: 6,
    students: "4.200+",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    tags: ["LLMs", "Deep Learning", "PyTorch"],
  },
  {
    name: "Dra. Camila Torres",
    role: "Ciência de Dados & Analytics",
    bio: "Doutora em Estatística pela UNICAMP. Liderou times de dados no Nubank e iFood. Especialista em decisões orientadas por dados.",
    courses: 5,
    students: "3.800+",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    tags: ["Python", "SQL", "Machine Learning"],
  },
  {
    name: "Lucas Ferreira",
    role: "MLOps & Infraestrutura de IA",
    bio: "Engenheiro Sênior de ML na AWS. Responsável por pipelines que servem bilhões de predições por dia. Especialista em deploy de modelos.",
    courses: 4,
    students: "2.900+",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    tags: ["Kubernetes", "Docker", "AWS SageMaker"],
  },
  {
    name: "Dra. Priya Nambiar",
    role: "Visão Computacional",
    bio: "Pesquisadora com publicações no NeurIPS e CVPR. Desenvolveu modelos de visão usados por 30+ empresas da Fortune 500.",
    courses: 3,
    students: "2.100+",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    tags: ["YOLO", "Transformers", "OpenCV"],
  },
  {
    name: "André Costa",
    role: "IA Generativa & Agentes",
    bio: "Fundador de duas startups de IA adquiridas por grandes tech companies. Pioneiro na aplicação de agentes autônomos em produção.",
    courses: 4,
    students: "3.400+",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    tags: ["RAG", "Agentes", "Prompt Engineering"],
  },
  {
    name: "Dra. Isabella Rocha",
    role: "Machine Learning & Pesquisa",
    bio: "Pesquisadora associada do MIT Media Lab. Co-autora de 14 artigos científicos. Transforma pesquisa de ponta em aplicações práticas.",
    courses: 3,
    students: "1.900+",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80",
    tags: ["Reinforcement Learning", "NLP", "TensorFlow"],
  },
];

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
              Nosso corpo docente
            </span>
          </div>
          <h1
            className="text-5xl md:text-[64px] font-light leading-[1.05] mb-8 max-w-3xl text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Aprenda com quem está no mercado.
          </h1>
          <p className="text-xl text-[#c6c6c6] max-w-2xl leading-relaxed">
            Nossos professores são engenheiros, pesquisadores e líderes técnicos ativos nas maiores empresas
            de tecnologia do mundo — não apenas acadêmicos.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e0e0e0]">
          {[
            { value: "18", label: "Professores ativos" },
            { value: "12+", label: "Anos médios de experiência" },
            { value: "60+", label: "Publicações científicas" },
            { value: "4.9★", label: "Avaliação média dos cursos" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white py-10 px-8 flex flex-col gap-2">
              <div className="text-3xl font-light" style={{ color: "#0f62fe", letterSpacing: "-0.02em" }}>
                {value}
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#6f6f6f]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Grid de professores ── */}
      <section className="py-24 px-4 md:px-8 bg-white">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {PROFESSORS.map((prof) => (
              <div
                key={prof.name}
                className="bg-white p-8 flex flex-col hover:bg-[#f4f4f4] transition-colors"
              >
                <div className="flex items-start gap-5 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prof.photo}
                    alt={prof.name}
                    className="h-16 w-16 object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: "#161616" }}>
                      {prof.name}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: "#0f62fe" }}>
                      {prof.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#525252] leading-relaxed mb-6 flex-1">
                  {prof.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {prof.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1"
                      style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-5 text-sm"
                  style={{ borderTop: "1px solid #e0e0e0" }}
                >
                  <span className="text-[#525252]">
                    <strong className="text-[#161616]">{prof.courses}</strong> cursos ·{" "}
                    <strong className="text-[#161616]">{prof.students}</strong> alunos
                  </span>
                  <ExternalLink className="h-4 w-4 text-[#8d8d8d] hover:text-[#0f62fe] cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Seja um professor ── */}
      <section className="py-20 px-4 md:px-8 border-t border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px] flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-light mb-2" style={{ color: "#161616" }}>
              Você é especialista em IA?
            </h2>
            <p className="text-[#525252]">
              Compartilhe seu conhecimento e alcance milhares de alunos.
            </p>
          </div>
          <Link
            href="/seja-instrutor"
            className="h-14 px-10 border font-semibold flex items-center gap-3 hover:bg-[#161616] hover:text-white hover:border-[#161616] transition-all shrink-0"
            style={{ color: "#161616", borderColor: "#161616" }}
          >
            Quero ser professor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
