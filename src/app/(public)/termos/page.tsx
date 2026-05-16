export default function TermosPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-2 text-3xl font-bold">Termos de Uso</h1>
        <p className="mb-10 text-sm text-muted-foreground">Ultima atualizacao: maio de 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Aceitacao dos termos</h2>
            <p>
              Ao acessar ou utilizar o CFIA, voce concorda com estes Termos de Uso. Se nao concordar
              com alguma parte, recomendamos nao utilizar a plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Descricao do projeto</h2>
            <p>
              O CFIA e uma plataforma de cursos livres em programacao e inteligencia artificial,
              criada como projeto de extensao universitario. O acesso aos cursos publicados e gratuito.
            </p>
            <p className="mt-3">
              O CFIA nao e uma instituicao de ensino regulamentada pelo MEC e nao oferece pos-graduacao,
              MBA, curso tecnico ou diploma academico.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Conta de usuario</h2>
            <p>
              Voce e responsavel por manter a confidencialidade das suas credenciais e por todas as
              atividades realizadas na sua conta. Notifique-nos se perceber qualquer uso indevido.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Certificados</h2>
            <p>
              Os certificados emitidos pelo CFIA sao certificados de conclusao de cursos livres. Eles
              comprovam participacao e progresso dentro da plataforma, mas nao substituem diplomas,
              titulos academicos ou certificacoes oficiais.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Apoio ao projeto</h2>
            <p>
              O CFIA pode receber manifestacoes de interesse, apoio, patrocinio ou contribuicoes para
              manter o projeto. Qualquer modalidade paga, se existir, sera comunicada de forma clara
              antes de qualquer cobranca.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Propriedade intelectual</h2>
            <p>
              O conteudo da plataforma e protegido por direitos autorais. Voce nao deve copiar,
              vender, redistribuir ou criar obras derivadas sem autorizacao expressa.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Conduta do usuario</h2>
            <p>
              Voce concorda em nao usar a plataforma para fins ilegais, nao compartilhar credenciais,
              nao tentar acessar sistemas nao autorizados e nao publicar conteudo ofensivo ou inadequado.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Limitacao de responsabilidade</h2>
            <p>
              O conteudo do CFIA e educacional. Nao prometemos emprego, renda, certificacao oficial
              ou resultado profissional especifico.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Contato</h2>
            <p>
              Para duvidas sobre estes termos, entre em contato pelo email:{" "}
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
