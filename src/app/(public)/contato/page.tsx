import { Mail, Clock, MapPin, Building, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/home/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contato | CFIA",
  description: "Fale com a equipe do Centro de Formação em Inteligência Artificial.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="bg-[#161616] text-white py-16 px-4 md:px-8 border-b border-[#393939]">
        <div className="mx-auto max-w-[1584px]">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h1
                className="text-4xl md:text-5xl font-light mb-4 tracking-tight"
              >
                Fale Conosco
              </h1>
              <p className="text-lg text-[#a8a8a8]">
                Nossa equipe está pronta para te atender. Mande sua mensagem ou direcione o suporte ao canal correto.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="mx-auto max-w-[1584px]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Infos de Contato */}
            <div>
              <ScrollReveal>
                <h2 className="text-2xl font-bold mb-10 text-[#161616]">Canais de Atendimento</h2>
              </ScrollReveal>

              <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
                {[
                  {
                    icon: Mail,
                    title: "Suporte Geral",
                    val: "suporte@cfia.com.br"
                  },
                  {
                    icon: Building,
                    title: "Comercial / B2B",
                    val: "empresas@cfia.com.br"
                  },
                  {
                    icon: MapPin,
                    title: "Endereço Fiscal",
                    val: "Av. Paulista, 1106 - São Paulo, SP (Atendimento online)"
                  },
                  {
                    icon: Clock,
                    title: "Horário de Apoio",
                    val: "Seg - Sex, das 9h às 18h"
                  }
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <div className="bg-white p-6 h-full transition-colors hover:bg-[#f4f4f4]">
                      <item.icon className="h-6 w-6 text-[#0f62fe] mb-4" />
                      <h3 className="font-bold text-sm mb-1 text-[#161616] tracking-widest uppercase font-mono">{item.title}</h3>
                      <p className="text-sm text-[#525252] leading-relaxed">{item.val}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerReveal>

              <ScrollReveal delay={0.2} className="mt-12 bg-[#edf5ff] p-8 border border-[#c0d8ff]">
                <h3 className="text-lg font-bold text-[#161616] mb-2">Já é aluno?</h3>
                <p className="text-[#525252] text-sm mb-6">
                  Para tempos de resposta mais rápidos, abra um chamado diretamente na área logada do seu dashboard, na seção de ingressos.
                </p>
                <div className="text-sm text-[#0f62fe] font-bold">
                  A equipe de tecnologia e mentoria atua 24h em nossos sistemas de ticket interno.
                </div>
              </ScrollReveal>
            </div>

            {/* Formulário */}
            <div className="bg-[#f4f4f4] p-8 md:p-12 border border-[#e0e0e0]">
              <ScrollReveal>
                <h2 className="text-2xl font-bold mb-2 text-[#161616]">Envie uma mensagem</h2>
                <p className="text-[#525252] text-sm mb-8">Utilize o formulário para contatos comerciais ou não respondidos na FAQ.</p>
                
                <form className="space-y-6" action="mailto:suporte@cfia.com.br" method="POST" encType="text/plain">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#161616] mb-2 uppercase tracking-widest">Nome completo</label>
                      <Input 
                        name="nome"
                        required
                        className="rounded-none border border-[#c6c6c6] bg-white focus-visible:ring-0 focus-visible:border-2 focus-visible:border-[#0f62fe] h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#161616] mb-2 uppercase tracking-widest">Email</label>
                      <Input 
                        type="email" 
                        name="email"
                        required
                        className="rounded-none border border-[#c6c6c6] bg-white focus-visible:ring-0 focus-visible:border-2 focus-visible:border-[#0f62fe] h-12"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#161616] mb-2 uppercase tracking-widest">Assunto</label>
                    <select 
                      name="assunto"
                      className="w-full rounded-none border border-[#c6c6c6] bg-white focus-visible:ring-0 focus-visible:border-2 focus-visible:border-[#0f62fe] h-12 px-3 text-sm"
                    >
                      <option>Dúvida sobre cursos/trilhas</option>
                      <option>Comercial e Empresas</option>
                      <option>Financeiro e Assinatura</option>
                      <option>Problemas técnicos</option>
                      <option>Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#161616] mb-2 uppercase tracking-widest">Sua Mensagem</label>
                    <Textarea 
                      name="mensagem"
                      required
                      className="min-h-[150px] rounded-none border border-[#c6c6c6] bg-white focus-visible:ring-0 focus-visible:border-2 focus-visible:border-[#0f62fe] resize-y"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="h-14 px-8 rounded-none bg-[#0f62fe] hover:bg-[#0353e9] text-base font-bold text-white w-full sm:w-auto"
                  >
                    Enviar mensagem <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </ScrollReveal>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
