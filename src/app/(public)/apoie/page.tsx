import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Heart, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { InterestForm } from "@/components/interest-form";

export const metadata = {
  title: "Apoie o Projeto | CFIA",
  description:
    "Ajude o CFIA a manter cursos livres e gratuitos de programacao e inteligencia artificial.",
};

const supportWays = [
  {
    icon: Heart,
    title: "Patrocinio",
    text: "Empresas e pessoas podem apoiar infraestrutura, gravacao de aulas, bolsas e manutencao da plataforma.",
  },
  {
    icon: BookOpen,
    title: "Conteudo",
    text: "Instrutores e estudantes podem contribuir com aulas, revisao de materiais, exercicios e projetos praticos.",
  },
  {
    icon: Sparkles,
    title: "Divulgacao",
    text: "Compartilhar o CFIA com quem esta comecando em tecnologia ja ajuda o projeto a chegar mais longe.",
  },
];

export default function ApoiePage() {
  return (
    <div className="flex flex-col bg-white">
      <section className="px-4 py-20 md:px-8 border-b" style={{ backgroundColor: "#161616", borderColor: "#393939" }}>
        <div className="mx-auto max-w-[1584px] grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p
              className="mb-4 text-[11px] uppercase"
              style={{ color: "#78a9ff", fontFamily: "var(--font-mono)", letterSpacing: "0.24em" }}
            >
              Apoie o projeto de extensao
            </p>
            <h1 className="max-w-4xl text-4xl font-light leading-tight text-white md:text-6xl">
              Cursos gratuitos precisam de uma base para continuar existindo.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed" style={{ color: "#c6c6c6" }}>
              O CFIA e um projeto de extensao universitario criado para oferecer cursos livres de
              programacao e inteligencia artificial sem cobrar pelo acesso ao conteudo.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[#393939] bg-[#262626] p-6">
              <p
                className="mb-3 text-[10px] uppercase"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
              >
                Quero apoiar ou acompanhar
              </p>
              <p className="mb-5 text-sm leading-relaxed" style={{ color: "#c6c6c6" }}>
                Deixe seu email para receber novidades sobre novos cursos, certificados e formas de apoio.
              </p>
              <InterestForm source="apoie" cta="Enviar interesse" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] grid gap-px bg-[#e0e0e0] border border-[#e0e0e0] md:grid-cols-3">
          {[
            { value: "100%", label: "conteudo gratuito" },
            { value: "Cursos livres", label: "sem pos, MBA ou promessa falsa" },
            { value: "Certificado", label: "conclusao verificavel online" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-8">
              <p className="text-3xl font-light" style={{ color: "#0f62fe" }}>{item.value}</p>
              <p
                className="mt-2 text-xs uppercase"
                style={{ color: "#6f6f6f", fontFamily: "var(--font-mono)", letterSpacing: "0.14em" }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 md:px-8 border-b border-[#e0e0e0]" style={{ backgroundColor: "#f4f4f4" }}>
        <div className="mx-auto max-w-[1584px]">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-light" style={{ color: "#161616" }}>
              Como voce pode ajudar
            </h2>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#525252" }}>
              A ideia e simples: manter o acesso aos cursos gratuito e buscar apoio para pagar
              infraestrutura, tempo de producao, revisao e melhorias da plataforma.
            </p>
          </div>

          <div className="grid gap-px bg-[#e0e0e0] border border-[#e0e0e0] md:grid-cols-3">
            {supportWays.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white p-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center" style={{ backgroundColor: "#edf5ff" }}>
                  <Icon className="h-6 w-6" style={{ color: "#0f62fe" }} />
                </div>
                <h3 className="mb-3 font-semibold" style={{ color: "#161616" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#525252" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] grid gap-10 lg:grid-cols-2">
          <div>
            <p
              className="mb-3 text-[11px] uppercase"
              style={{ color: "#0f62fe", fontFamily: "var(--font-mono)", letterSpacing: "0.2em" }}
            >
              Para empresas, professores e apoiadores
            </p>
            <h2 className="text-3xl font-light leading-tight" style={{ color: "#161616" }}>
              Apoio com transparencia, sem vender uma estrutura que ainda nao existe.
            </h2>
          </div>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: "#525252" }}>
            <p>
              O CFIA ainda e uma plataforma jovem. Nao prometemos treinamento corporativo customizado,
              painel de gestor ou dezenas de instrutores. O que existe hoje e um projeto real em construcao.
            </p>
            <p>
              Se voce quer apoiar, patrocinar uma trilha, contribuir com conteudo ou conversar sobre
              parceria, o melhor caminho e entrar em contato diretamente.
            </p>
            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <Link
                href="/contato"
                className="inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#0f62fe" }}
              >
                Falar sobre apoio <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:contato@cfia.com.br"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#c6c6c6] px-5 text-sm font-semibold"
                style={{ color: "#161616" }}
              >
                <Mail className="h-4 w-4" /> contato@cfia.com.br
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8" style={{ backgroundColor: "#0f62fe" }}>
        <div className="mx-auto max-w-[1584px] flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center bg-white">
              <ShieldCheck className="h-6 w-6" style={{ color: "#0f62fe" }} />
            </div>
            <h2 className="max-w-2xl text-3xl font-light text-white">
              Quer apenas estudar? Crie sua conta e acompanhe os cursos gratuitos.
            </h2>
          </div>
          <Link
            href="/cadastro"
            className="inline-flex min-h-14 items-center justify-center gap-3 bg-white px-8 text-sm font-semibold"
            style={{ color: "#0f62fe" }}
          >
            Comecar gratuitamente <GraduationCap className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
