export default function TermosPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-muted-foreground mb-10 text-sm">Última atualização: abril de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar a plataforma cfia (Centro de Formação em Inteligência Artificial),
              você concorda em cumprir estes Termos de Uso. Se você não concorda com qualquer parte destes
              termos, não poderá acessar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
            <p>
              O cfia é uma plataforma de educação online especializada em Inteligência Artificial, que oferece
              cursos em vídeo, materiais de apoio e certificados de conclusão mediante assinatura mensal ou anual.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Conta de Usuário</h2>
            <p>
              Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as
              atividades realizadas em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Assinaturas e Pagamentos</h2>
            <p>
              Os planos de assinatura são cobrados antecipadamente (mensal ou anualmente). Você pode cancelar
              a qualquer momento pelo portal do cliente. Após o cancelamento, seu acesso continua ativo até o
              fim do período já pago. Não realizamos reembolsos de períodos não utilizados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo disponibilizado na plataforma (vídeos, textos, imagens, código) é protegido por
              direitos autorais. Você não está autorizado a copiar, distribuir, vender ou criar obras derivadas
              do conteúdo sem autorização expressa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Conduta do Usuário</h2>
            <p>
              Você concorda em não usar a plataforma para fins ilegais, não compartilhar suas credenciais de
              acesso, não tentar acessar sistemas ou dados não autorizados, e não publicar conteúdo ofensivo
              ou inadequado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              O cfia não se responsabiliza por danos indiretos, incidentais ou consequentes decorrentes do
              uso da plataforma. Nosso conteúdo é fornecido para fins educacionais e não constitui consultoria
              profissional em nenhuma área.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Alterações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão
              em vigor após publicação na plataforma. O uso continuado do serviço constitui aceitação dos
              novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo email:{" "}
              <a href="mailto:contato@cfia.com.br" style={{ color: "#0052ff" }}>
                contato@cfia.com.br
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
