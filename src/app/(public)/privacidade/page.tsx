export default function PrivacidadePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-10 text-sm">Última atualização: abril de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Dados que Coletamos</h2>
            <p>Coletamos as seguintes informações ao usar nossa plataforma:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nome, endereço de email e senha (criptografada)</li>
              <li>Dados de pagamento (processados pelo Stripe — não armazenamos dados de cartão)</li>
              <li>Progresso nos cursos e histórico de aprendizagem</li>
              <li>Dados de uso e navegação na plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Como Usamos seus Dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Fornecer acesso à plataforma e aos cursos</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Personalizar sua experiência de aprendizagem</li>
              <li>Emitir certificados de conclusão</li>
              <li>Enviar comunicações relevantes sobre a plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Compartilhamento de Dados</h2>
            <p>
              Não vendemos seus dados pessoais. Compartilhamos dados apenas com prestadores de serviço
              essenciais (Stripe para pagamentos, provedores de infraestrutura) e quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Segurança</h2>
            <p>
              Utilizamos criptografia em trânsito (HTTPS) e em repouso para proteger seus dados.
              As senhas são armazenadas com hash bcrypt. Os dados de pagamento são processados
              integralmente pelo Stripe, certificado PCI DSS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
            <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar exclusão dos seus dados</li>
              <li>Revogar seu consentimento a qualquer momento</li>
              <li>Portabilidade dos seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para manter sua sessão ativa e cookies de análise
              para melhorar a plataforma. Você pode desativar cookies nas configurações do seu navegador,
              mas isso pode afetar a funcionalidade do site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta,
              os dados são removidos em até 30 dias, exceto onde a retenção seja exigida por obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Contato</h2>
            <p>
              Para exercer seus direitos ou tirar dúvidas sobre privacidade:{" "}
              <a href="mailto:privacidade@cfia.com.br" style={{ color: "#0052ff" }}>
                privacidade@cfia.com.br
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
