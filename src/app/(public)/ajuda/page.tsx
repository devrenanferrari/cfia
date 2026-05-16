import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, HelpCircle, Mail, ShieldCheck, UserRound } from "lucide-react";

export const metadata = {
  title: "Ajuda | CFIA",
  description: "Perguntas frequentes sobre os cursos gratuitos, certificados e o projeto CFIA.",
};

const faqs = [
  {
    category: "Cursos gratuitos",
    icon: BookOpen,
    items: [
      {
        q: "Os cursos do CFIA sao gratuitos?",
        a: "Sim. A proposta do projeto e manter o acesso ao conteudo gratuito. Voce pode criar uma conta, se matricular nos cursos publicados e estudar sem assinatura mensal.",
      },
      {
        q: "O CFIA e uma faculdade ou pos-graduacao?",
        a: "Nao. O CFIA oferece cursos livres como projeto de extensao. Nao e pos-graduacao, MBA, curso tecnico ou instituicao regulamentada pelo MEC.",
      },
      {
        q: "Por que alguns cursos aparecem como em breve?",
        a: "Porque a plataforma esta em construcao. Preferimos mostrar o caminho com transparencia em vez de fingir que ja existe um catalogo enorme.",
      },
    ],
  },
  {
    category: "Certificados",
    icon: GraduationCap,
    items: [
      {
        q: "O certificado e valido?",
        a: "O certificado e de conclusao de curso livre. Ele serve como comprovante de participacao e aprendizado, com verificacao online, mas nao substitui diploma, pos-graduacao ou certificacao oficial.",
      },
      {
        q: "Como emito meu certificado?",
        a: "Depois de concluir as aulas e avaliacoes exigidas por um curso, o certificado aparece no painel do aluno, na area de certificados.",
      },
      {
        q: "O certificado tem verificacao publica?",
        a: "Sim. Cada certificado possui um codigo unico e uma pagina publica de verificacao.",
      },
    ],
  },
  {
    category: "Conta e acesso",
    icon: UserRound,
    items: [
      {
        q: "Preciso criar conta para estudar?",
        a: "Sim. A conta permite salvar matriculas, progresso, respostas de quizzes e certificados.",
      },
      {
        q: "Esqueci minha senha. O que faco?",
        a: "Use a pagina de recuperacao de senha em /esqueci-senha. Se algo falhar, entre em contato pela pagina de contato.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col bg-white">
      <section className="border-b border-[#e0e0e0] px-4 py-16 md:px-8" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-3xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center bg-white border border-[#e0e0e0]">
              <HelpCircle className="h-8 w-8" style={{ color: "#0f62fe" }} />
            </div>
            <h1 className="mb-4 text-4xl font-light md:text-5xl" style={{ color: "#161616" }}>
              Ajuda
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "#525252" }}>
              Respostas diretas sobre cursos gratuitos, certificados, conta e o funcionamento do CFIA como projeto de extensao.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1584px] gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-20 space-y-6">
              <div className="bg-[#edf5ff] p-8">
                <h2 className="mb-3 text-lg font-semibold" style={{ color: "#161616" }}>
                  Ainda ficou alguma duvida?
                </h2>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: "#525252" }}>
                  Mande uma mensagem. Como o projeto ainda e pequeno, o contato e direto e sem central corporativa.
                </p>
                <Link
                  href="/contato"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#0f62fe" }}
                >
                  Entrar em contato <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="border border-[#e0e0e0] p-8">
                <ShieldCheck className="mb-4 h-6 w-6" style={{ color: "#0f62fe" }} />
                <h2 className="mb-3 text-lg font-semibold" style={{ color: "#161616" }}>
                  Transparencia antes de marketing
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                  O CFIA nao promete emprego, diploma oficial ou mentoria 24h. Promete conteudo livre,
                  feito com cuidado, e uma plataforma crescendo em publico.
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="space-y-14">
              {faqs.map((category) => (
                <section key={category.category} className="scroll-mt-20">
                  <div className="mb-6 flex items-center gap-3">
                    <category.icon className="h-6 w-6" style={{ color: "#161616" }} />
                    <h2 className="text-2xl font-semibold" style={{ color: "#161616" }}>{category.category}</h2>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <details key={item.q} className="border border-[#e0e0e0] bg-white">
                        <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-semibold" style={{ color: "#161616" }}>
                          {item.q}
                          <span className="text-xl font-light" style={{ color: "#0f62fe" }}>+</span>
                        </summary>
                        <div className="border-t border-[#e0e0e0] px-5 py-4 text-sm leading-relaxed" style={{ color: "#525252" }}>
                          {item.a}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-14 border-l-4 bg-[#f4f4f4] p-6" style={{ borderColor: "#0f62fe" }}>
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: "#0f62fe" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#161616" }}>Contato direto</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>
                Para parcerias, apoio, sugestoes ou problemas tecnicos:{" "}
                <a href="mailto:contato@cfia.com.br" className="font-semibold" style={{ color: "#0f62fe" }}>
                  contato@cfia.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
