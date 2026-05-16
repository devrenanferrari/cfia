import { ArrowRight, Clock, GraduationCap, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contato | CFIA",
  description: "Fale com o CFIA sobre cursos, apoio, parcerias ou problemas tecnicos.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white">
      <section className="border-b border-[#393939] bg-[#161616] px-4 py-16 text-white md:px-8">
        <div className="mx-auto max-w-[1584px]">
          <div className="max-w-2xl">
            <p
              className="mb-4 text-[11px] uppercase"
              style={{ color: "#78a9ff", fontFamily: "var(--font-mono)", letterSpacing: "0.22em" }}
            >
              Contato direto
            </p>
            <h1 className="mb-4 text-4xl font-light md:text-5xl">Fale com o CFIA</h1>
            <p className="text-base leading-relaxed text-[#c6c6c6]">
              Use este canal para duvidas sobre cursos, sugestoes, apoio ao projeto, parcerias ou problemas tecnicos.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1584px] gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="mb-10 text-2xl font-semibold text-[#161616]">Canais</h2>

            <div className="grid grid-cols-1 gap-px border border-[#e0e0e0] bg-[#e0e0e0] sm:grid-cols-2">
              {[
                { icon: Mail, title: "Email", val: "contato@cfia.com.br" },
                { icon: GraduationCap, title: "Projeto", val: "Cursos livres e gratuitos em IA" },
                { icon: MapPin, title: "Atendimento", val: "Online, conforme disponibilidade do projeto" },
                { icon: Clock, title: "Resposta", val: "Assim que possivel, sem promessa de suporte 24h" },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 transition-colors hover:bg-[#f4f4f4]">
                  <item.icon className="mb-4 h-6 w-6 text-[#0f62fe]" />
                  <h3 className="mb-1 font-mono text-sm font-bold uppercase tracking-widest text-[#161616]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#525252]">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 border border-[#c0d8ff] bg-[#edf5ff] p-8">
              <h3 className="mb-2 text-lg font-semibold text-[#161616]">Quer apoiar o projeto?</h3>
              <p className="mb-6 text-sm leading-relaxed text-[#525252]">
                Para patrocinio, contribuicao de conteudo ou divulgacao, conte brevemente como voce quer ajudar.
              </p>
              <a href="/apoie" className="text-sm font-semibold text-[#0f62fe]">
                Ver formas de apoio →
              </a>
            </div>
          </div>

          <div className="border border-[#e0e0e0] bg-[#f4f4f4] p-8 md:p-12">
            <h2 className="mb-2 text-2xl font-semibold text-[#161616]">Envie uma mensagem</h2>
            <p className="mb-8 text-sm text-[#525252]">
              O formulario abre seu cliente de email com a mensagem preenchida.
            </p>

            <form className="space-y-6" action="mailto:contato@cfia.com.br" method="POST" encType="text/plain">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#161616]">Nome</label>
                  <Input name="nome" required className="h-12 rounded-none bg-white" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#161616]">Email</label>
                  <Input type="email" name="email" required className="h-12 rounded-none bg-white" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#161616]">Assunto</label>
                <select name="assunto" className="h-12 w-full px-3 text-sm">
                  <option>Duvida sobre cursos</option>
                  <option>Apoio ou patrocinio</option>
                  <option>Contribuir com conteudo</option>
                  <option>Problema tecnico</option>
                  <option>Outro assunto</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#161616]">Mensagem</label>
                <Textarea name="mensagem" required className="min-h-[150px] rounded-none bg-white" />
              </div>

              <Button type="submit" className="h-14 w-full rounded-none bg-[#0f62fe] text-base font-bold text-white hover:bg-[#0353e9] sm:w-auto">
                Enviar mensagem <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
