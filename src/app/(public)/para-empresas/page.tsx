import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users, Target, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "CFIA para Empresas | Treinamento Corporativo em IA",
  description: "Trilhas customizadas de Inteligência Artificial para capacitar a sua equipe, aumentar a produtividade e reter talentos.",
};

export default function ForBusinessPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section B2B */}
      <section className="bg-[#161616] py-24 px-4 md:px-8 overflow-hidden relative">
        <div className="mx-auto max-w-[1584px] relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#393939] flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#4589ff]" />
                  </div>
                  <span className="font-mono font-bold text-[#4589ff] tracking-[0.2em] text-sm uppercase">
                    CFIA for Business
                  </span>
                </div>
                <h1
                  className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-white"
                >
                  Transforme sua equipe em uma central de inteligência.
                </h1>
                <p className="text-lg md:text-xl text-[#a8a8a8] mb-10 max-w-xl leading-relaxed">
                  Capacite todos os setores da sua empresa com as competências de Inteligência Artificial mais requisitadas do mercado. Aumente a produtividade, a inovação e o rendimento da sua equipe.
                </p>
              </ScrollReveal>
            </div>
            
            <div className="bg-white p-8 md:p-10 shadow-2xl relative">
              {/* Fake form / Lead capture */}
              <ScrollReveal delay={0.2}>
                <h3 className="text-2xl font-bold text-[#161616] mb-2">Fale com um consultor</h3>
                <p className="text-[#525252] text-sm mb-8">Descubra como podemos customizar uma trilha para sua empresa.</p>
                
                <form className="space-y-6" action="mailto:contato@cfia.com.br" method="POST" encType="text/plain">
                  <div className="space-y-4">
                    <div>
                      <Input 
                        placeholder="Nome completo" 
                        name="nome"
                        required
                        className="rounded-none border-0 border-b border-[#8d8d8d] bg-[#f4f4f4] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#0f62fe] h-12"
                      />
                    </div>
                    <div>
                      <Input 
                        type="email" 
                        placeholder="Email corporativo" 
                        name="email"
                        required
                        className="rounded-none border-0 border-b border-[#8d8d8d] bg-[#f4f4f4] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#0f62fe] h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Empresa" 
                        name="empresa"
                        required
                        className="rounded-none border-0 border-b border-[#8d8d8d] bg-[#f4f4f4] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#0f62fe] h-12"
                      />
                      <Input 
                        type="tel" 
                        placeholder="Telefone" 
                        name="telefone"
                        className="rounded-none border-0 border-b border-[#8d8d8d] bg-[#f4f4f4] focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#0f62fe] h-12"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-none bg-[#0f62fe] hover:bg-[#0353e9] text-base font-bold"
                  >
                    Solicitar contato <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-[#8d8d8d] text-center mt-4">
                    Ao enviar, você concorda com nossos Termos de Privacidade.
                  </p>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-4 md:px-8 border-b border-[#e0e0e0] bg-[#f4f4f4]">
        <div className="mx-auto max-w-[1584px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4 text-[#161616]">
                Por que investir em IA para a sua empresa?
              </h2>
              <p className="text-[#525252] text-lg">
                Seja para automatizar processos com IA Generativa ou otimizar a infraestrutura com Machine Learning, suas ferramentas são construídas pelas pessoas.
              </p>
            </ScrollReveal>
          </div>

          <StaggerReveal className="grid md:grid-cols-3 gap-1">
            {[
              {
                icon: TrendingUp,
                title: "Aumento de Produtividade",
                desc: "Equipes capacitadas em agentes de IA e automação entregam resultados até 40% mais rápido em tarefas rotineiras."
              },
              {
                icon: Users,
                title: "Retenção de Talentos",
                desc: "Empresas que investem numa cultura de upskilling conseguem atrair e manter os melhores talentos de tecnologia."
              },
              {
                icon: Target,
                title: "Decisões Orientadas",
                desc: "Treine seus analistas para utilizar Data Science profunda e obter insights que impulsionam o negócio direto para a meta."
              }
            ].map((prop, i) => (
              <StaggerItem key={i}>
                <div className="bg-white p-10 h-full border border-[#e0e0e0] transition-colors hover:border-[#0f62fe]">
                  <div className="w-12 h-12 bg-[#edf5ff] flex items-center justify-center mb-6">
                    <prop.icon className="w-6 h-6 text-[#0f62fe]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#161616]">{prop.title}</h3>
                  <p className="text-[#525252] leading-relaxed">{prop.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Solutions / Features */}
      <section className="py-24 px-4 md:px-8 bg-white border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-6 text-[#161616]">A plataforma de ensino contínuo ideal para o ambiente corporativo.</h2>
              <div className="space-y-6">
                {[
                  "Acesso a todo o acervo CFIA + Lançamentos semanais.",
                  "Painel do gestor: Acompanhe o progresso da equipe em tempo real.",
                  "Trilhas curadas para perfis de Cargo (Engenharia, Produto, Dados).",
                  "Certificados de conclusão atrelados ao seu domínio corporativo."
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#0f62fe] shrink-0" />
                    <p className="text-[#525252] font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="bg-[#f8faff] p-12 border border-[#c0d8ff] flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] mx-auto flex items-center justify-center mb-6 relative">
                  <Building2 className="w-10 h-10 text-[#0f62fe]" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0f62fe] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="font-mono text-xs font-bold tracking-widest text-[#0f62fe] uppercase">Painel Corporativo</h3>
                <p className="text-[#525252] max-w-sm">Visão centralizada de pagamentos, licenças ativas e métricas de engajamento do seu time.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
