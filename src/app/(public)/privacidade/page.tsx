export default function PrivacidadePage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-3xl font-bold">Politica de Privacidade</h1>
        <p className="mb-10 text-sm text-muted-foreground">Ultima atualizacao: maio de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Dados que coletamos</h2>
            <p>Coletamos informacoes necessarias para operar a plataforma:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Nome, email e senha criptografada</li>
              <li>Progresso nos cursos, matriculas, quizzes e certificados</li>
              <li>Emails enviados em formularios de interesse ou apoio</li>
              <li>Dados tecnicos basicos de uso e navegacao</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Como usamos seus dados</h2>
            <p>Usamos seus dados para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Permitir acesso a conta e aos cursos</li>
              <li>Salvar progresso e emitir certificados de conclusao</li>
              <li>Enviar avisos sobre novos cursos, trilhas e atualizacoes do projeto</li>
              <li>Responder mensagens enviadas pelos formularios</li>
              <li>Melhorar a estabilidade e a experiencia da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Compartilhamento de dados</h2>
            <p>
              Nao vendemos seus dados pessoais. Compartilhamos informacoes apenas com provedores
              essenciais de infraestrutura, autenticacao, banco de dados ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Seguranca</h2>
            <p>
              Usamos HTTPS e armazenamento seguro para proteger seus dados. Senhas sao armazenadas
              com hash e nao ficam visiveis para administradores.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Seus direitos</h2>
            <p>Conforme a LGPD, voce pode solicitar acesso, correcao, exclusao ou portabilidade dos seus dados.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Cookies</h2>
            <p>
              Utilizamos cookies essenciais para manter sua sessao ativa e melhorar o funcionamento da plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Contato</h2>
            <p>
              Para exercer seus direitos ou tirar duvidas sobre privacidade:{" "}
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
