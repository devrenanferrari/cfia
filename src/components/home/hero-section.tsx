import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=48&h=48&fit=crop&q=80",
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-28 pb-24 px-4 md:px-8"
      style={{ background: "linear-gradient(140deg, #ffffff 0%, #edf5ff 60%, #f0f4ff 100%)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-7 text-sm font-medium"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce", border: "1px solid #a6c8ff" }}
            >
              <span className="h-2 w-2 rounded-full bg-[#0f62fe]" />
              Plataforma #1 de carreiras em IA do Brasil
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] mb-6"
              style={{ color: "#161616", letterSpacing: "-0.02em" }}
            >
              Torne-se um profissional de{" "}
              <span style={{ color: "#0f62fe" }}>Inteligência Artificial</span>{" "}
              e mude sua carreira
            </h1>

            <p className="text-xl leading-relaxed mb-8" style={{ color: "#525252" }}>
              Aprenda do zero ao avançado, construa projetos reais e esteja pronto para trabalhar com IA no mercado.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                "Trilhas estruturadas para cada carreira em IA",
                "Projetos reais para construir seu portfólio",
                "Certificados reconhecidos pelo mercado",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base" style={{ color: "#393939" }}>
                  <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#0f62fe" }} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-5">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base text-white transition-all hover:bg-[#0353e9] active:scale-[0.98]"
                style={{ backgroundColor: "#0f62fe" }}
              >
                Começar gratuitamente
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/cursos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base border transition-all hover:bg-[#f4f4f4]"
                style={{ color: "#161616", borderColor: "#c6c6c6", backgroundColor: "#ffffff" }}
              >
                Ver trilhas de carreira
              </Link>
            </div>

            <p className="text-sm" style={{ color: "#8d8d8d" }}>
              Sem cartão&nbsp;•&nbsp;Acesso imediato&nbsp;•&nbsp;Certificado incluso
            </p>
          </div>

          {/* ── Right column — Photo + floating badges ── */}
          <div className="relative hidden lg:block">
            {/* Badges ficam fora da foto — não sobrepõem o rosto */}
            <div className="relative w-full" style={{ height: 580 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tender-feminine-young-female-student-curly-hairstyle-pointing-left-index-finger-smiling-friendly-asking-which-place-dorm-standing-cheerful-white-wall.jpg"
                alt="Profissional de IA"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center top", boxShadow: "0 24px 64px rgba(15, 98, 254, 0.12)" }}
              />

              {/* Badge: IA — canto superior, fora da área do rosto */}
              <div
                className="absolute top-6 -left-16 bg-white px-4 py-3 flex items-center gap-2.5"
                style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <span className="text-xl">🤖</span>
                <span className="font-semibold text-sm" style={{ color: "#161616" }}>Inteligência Artificial</span>
              </div>

              {/* Badge: Carreira — lado direito, meio */}
              <div
                className="absolute top-40 -right-14 bg-white px-4 py-3 flex items-center gap-2.5"
                style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <span className="text-xl">🚀</span>
                <span className="font-semibold text-sm" style={{ color: "#161616" }}>Nova carreira</span>
              </div>

              {/* Badge: Certificado — inferior esquerdo */}
              <div
                className="absolute bottom-28 -left-14 bg-white px-4 py-3 flex items-center gap-2.5"
                style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <span className="text-xl">🎓</span>
                <span className="font-semibold text-sm" style={{ color: "#161616" }}>Certificado</span>
              </div>

              {/* Badge: Projetos — inferior direito */}
              <div
                className="absolute -bottom-5 right-10 bg-white px-4 py-3 flex items-center gap-2.5"
                style={{ border: "1px solid #e0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <span className="text-xl">💼</span>
                <span className="font-semibold text-sm" style={{ color: "#161616" }}>Projetos reais</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function SocialProofBar() {
  return (
    <div
      className="py-10 px-4 md:px-8 border-y"
      style={{ backgroundColor: "#f4f4f4", borderColor: "#e0e0e0" }}
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">

        <div>
          <p className="text-sm mb-4" style={{ color: "#8d8d8d" }}>
            Junte-se a milhares de alunos construindo carreira em tecnologia
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {STUDENT_AVATARS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt="Aluno"
                  className="h-10 w-10 rounded-full object-cover"
                  style={{ border: "2px solid white" }}
                />
              ))}
            </div>
            <div>
              <div className="font-bold text-base" style={{ color: "#161616" }}>+12.000 alunos</div>
              <div className="text-sm" style={{ color: "#525252" }}>já estão aprendendo IA</div>
            </div>
          </div>
        </div>

        <div>
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "#8d8d8d", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            Alunos trabalhando em empresas como
          </p>
          <div className="flex flex-wrap gap-6 items-center">
            {["Google", "IBM", "Amazon", "Nubank", "iFood"].map((company) => (
              <span key={company} className="font-bold text-base" style={{ color: "#c6c6c6" }}>
                {company}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export function StatsBar() {
  const stats = [
    { value: "+12.000", label: "Alunos ativos" },
    { value: "97%",     label: "Taxa de conclusão" },
    { value: "+40",     label: "Cursos disponíveis" },
    { value: "4.9★",   label: "Avaliação média" },
  ];

  return (
    <div className="bg-white border-b" style={{ borderColor: "#e0e0e0" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="py-10 px-6 text-center"
              style={{ borderRight: i < 3 ? "1px solid #e0e0e0" : "none" }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: "#0f62fe" }}>{value}</div>
              <div className="text-sm" style={{ color: "#525252" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
