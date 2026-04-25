import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, GraduationCap, CreditCard, ShieldAlert, FileText, Lock } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";

export const metadata = {
  title: "Central de Ajuda | CFIA",
  description: "Encontre respostas para as perguntas mais comuns sobre a plataforma CFIA.",
};

const faqs = [
  {
    category: "Assinatura e Pagamentos",
    icon: CreditCard,
    items: [
      {
        q: "Como cancelar minha assinatura?",
        a: "Você pode cancelar a qualquer momento acessando seu menu superior direito -> Gerenciar plano -> Cancelar assinatura. O acesso permanecerá ativo até o final do período faturado."
      },
      {
        q: "Quais são as formas de pagamento aceitas?",
        a: "Aceitamos cartão de crédito (parcelamento disponível dependendo do plano) e PIX. Não trabalhamos com boletos."
      },
      {
        q: "O que acontece quando meu plano acaba?",
        a: "Para planos anuais (Assinatura), a renovação é automática. Caso opte por não renovar, você perderá acesso aos conteúdos."
      }
    ]
  },
  {
    category: "Cursos e Certificados",
    icon: GraduationCap,
    items: [
      {
        q: "Os certificados são reconhecidos pelo MEC?",
        a: "Nossos certificados são de cursos livres de capacitação profissional e aperfeiçoamento. Eles são amplamente reconhecidos pelo mercado corporativo, válidos legalmente em todo o território nacional, mas não são diplomas de graduação ou pós pelo MEC."
      },
      {
        q: "Como eu emito meu certificado?",
        a: "Após concluir 100% das aulas e avaliações de um curso, você poderá emitir o certificado diretamente no seu painel do aluno, na aba 'Certificados'."
      },
      {
        q: "Posso compartilhar os certificados no LinkedIn?",
        a: "Sim. Nossos certificados possuem uma URL única e verificável, com integração direta de 1 clique para adicionar ao seu perfil do LinkedIn."
      }
    ]
  },
  {
    category: "Acesso e Conta",
    icon: Lock,
    items: [
      {
        q: "Esqueci minha senha, como recuperar?",
        a: "Na página de login inicial, clique em 'Esqueci minha senha'. Enviaremos um link temporário para o seu e-mail cadastrado."
      },
      {
        q: "Posso acessar pelo celular?",
        a: "Nosso ambiente Web é 100% responsivo e otimizado para celulares e tablets. Você não precisa baixar um app para assistir às aulas onde estiver."
      }
    ]
  }
];

export default function HelpPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <section className="bg-[#f4f4f4] py-16 px-4 md:px-8 border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px] text-center max-w-3xl">
          <ScrollReveal>
            <div className="w-16 h-16 bg-white border border-[#e0e0e0] flex items-center justify-center mx-auto mb-6">
              <MessageCircleQuestion className="w-8 h-8 text-[#0f62fe]" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-light mb-4 text-[#161616] tracking-tight"
            >
              Central de Ajuda
            </h1>
            <p className="text-lg text-[#525252]">
              Tire suas dúvidas sobre pagamentos, certificados, acesso às aulas e mais.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main content */}
      <section className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Sidebar nav / Contact */}
            <div className="lg:col-span-4 space-y-12">
              <ScrollReveal>
                <div className="bg-[#edf5ff] p-8">
                  <h3 className="text-lg font-bold text-[#161616] mb-3">Ainda precisa de ajuda?</h3>
                  <p className="text-[#525252] text-sm mb-6 leading-relaxed">
                    Não encontrou a resposta para a sua dúvida? Nossa equipe de suporte está à disposição.
                  </p>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-2 bg-[#0f62fe] text-white px-6 py-3 font-semibold text-sm transition-colors hover:bg-[#0353e9]"
                  >
                    Fale com nosso Suporte <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="border border-[#e0e0e0] p-8">
                  <h3 className="text-lg font-bold text-[#161616] mb-4">Políticas e Termos</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/termos" className="flex items-center gap-2 text-sm text-[#0f62fe] hover:underline">
                        <FileText className="w-4 h-4" /> Termos de Uso
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacidade" className="flex items-center gap-2 text-sm text-[#0f62fe] hover:underline">
                        <ShieldAlert className="w-4 h-4" /> Política de Privacidade
                      </Link>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-8">
              <div className="space-y-16">
                {faqs.map((category, i) => (
                  <div key={i} className="scroll-mt-32" id={`cat-${i}`}>
                    <StaggerReveal className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <category.icon className="w-6 h-6 text-[#161616]" />
                        <h2 className="text-2xl font-bold text-[#161616]">{category.category}</h2>
                      </div>
                    </StaggerReveal>

                    <div className="space-y-4">
                      {category.items.map((item, j) => (
                        <div key={j} className="border border-[#e0e0e0] bg-white group">
                          {/* We use Details/Summary for native Accordion with IBM Carbon stylings */}
                          <details className="cursor-pointer peer group-open:bg-[#f8faff]">
                            <summary className="p-6 font-semibold text-[#161616] select-none list-none flex justify-between items-center outline-none">
                              {item.q}
                              <span className="text-2xl font-light text-[#0f62fe] transition-transform group-open:rotate-45 leading-none">
                                +
                              </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 text-[#525252] text-sm leading-relaxed border-t border-[#e0e0e0] mt-0 pt-4 cursor-text">
                              {item.a}
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
