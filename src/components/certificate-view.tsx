import { Award, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { CertificateActions } from "@/components/certificate-actions";
import { formatCourseDuration, getCourseDurationMinutes } from "@/lib/certificates";

interface CertificateViewProps {
  certificate: {
    code: string;
    issuedAt: Date;
    finalScore: number | null;
    user: { name: string | null; email: string | null };
    course: {
      title: string;
      duration: number | null;
      instructor: { name: string | null };
      modules?: Array<{
        lessons?: Array<{
          duration: number | null;
        }>;
      }>;
    };
  };
  showDashboardLink?: boolean;
}

export function CertificateView({ certificate, showDashboardLink = false }: CertificateViewProps) {
  const studentName = certificate.user.name || certificate.user.email || "Aluno CFIA";
  const workload = formatCourseDuration(getCourseDurationMinutes(certificate.course));
  const publicPath = `/certificados/${certificate.code}`;

  return (
    <div className="space-y-6">
      <CertificateActions
        code={certificate.code}
        publicPath={publicPath}
        showDashboardLink={showDashboardLink}
      />

      <div className="print:shadow-none print:border-0 print:bg-white relative mx-auto overflow-hidden rounded-[28px] border bg-[#f6f0e4] shadow-sm print:max-w-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(184,134,11,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(15,98,254,0.10),_transparent_28%)]" />
        <div className="absolute inset-[18px] border border-[#d8b86a]/70" />
        <div className="absolute inset-[32px] border border-[#d8b86a]/40" />

        <div className="relative aspect-[1.414/1] min-h-[720px] w-full bg-[linear-gradient(135deg,#fbf7ef_0%,#f4ebda_48%,#fbf8f1_100%)] px-12 py-10 print:min-h-0">
          <div className="absolute left-0 top-0 h-48 w-48 rounded-br-[140px] border-b border-r border-[#d8b86a]/35 bg-[radial-gradient(circle_at_top_left,_rgba(216,184,106,0.18),_transparent_70%)]" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-tl-[160px] border-l border-t border-[#d8b86a]/35 bg-[radial-gradient(circle_at_bottom_right,_rgba(15,98,254,0.10),_transparent_72%)]" />

          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b86a] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#8b6b2e]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Certificação Oficial CFIA
                  </div>

                  <p className="mt-8 text-sm uppercase tracking-[0.55em] text-[#8b6b2e]">
                    Certificado de Conclusão
                  </p>
                  <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[0.02em] text-[#1b2430]">
                    {studentName}
                  </h1>
                  <p className="mt-6 max-w-3xl text-lg leading-8 text-[#4b5563]">
                    concluiu integralmente a formação e cumpriu todos os requisitos acadêmicos,
                    incluindo avaliações obrigatórias e prova final quando aplicável, do curso
                  </p>
                  <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-[#0f62fe]">
                    {certificate.course.title}
                  </h2>
                </div>

                <div className="w-[220px] flex-shrink-0">
                  <div className="relative mx-auto flex h-[184px] w-[184px] items-center justify-center rounded-full border-[10px] border-[#d8b86a] bg-[radial-gradient(circle,#fffdf8_0%,#f4ebd8_72%,#ead9b6_100%)] shadow-[inset_0_0_0_2px_rgba(139,107,46,0.18)]">
                    <div className="absolute inset-[10px] rounded-full border border-[#8b6b2e]/30" />
                    <div className="absolute inset-[24px] rounded-full border border-dashed border-[#8b6b2e]/45" />
                    <div className="relative text-center">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f62fe]/10">
                        <Award className="h-7 w-7 text-[#0f62fe]" />
                      </div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#8b6b2e]">
                        Selo
                      </p>
                      <p className="mt-1 text-2xl font-bold tracking-[0.22em] text-[#1b2430]">
                        CFIA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-4 gap-4">
                <div className="rounded-[18px] border border-[#d8b86a]/60 bg-white/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#8b7355]">Carga horária</p>
                  <p className="mt-3 text-2xl font-semibold text-[#1b2430]">{workload}</p>
                </div>
                <div className="rounded-[18px] border border-[#d8b86a]/60 bg-white/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#8b7355]">Instrutor</p>
                  <p className="mt-3 text-xl font-semibold text-[#1b2430]">
                    {certificate.course.instructor.name || "Equipe CFIA"}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#d8b86a]/60 bg-white/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#8b7355]">Data de emissão</p>
                  <p className="mt-3 text-xl font-semibold text-[#1b2430]">
                    {new Date(certificate.issuedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#d8b86a]/60 bg-white/70 p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#8b7355]">Resultado final</p>
                  <p className="mt-3 text-2xl font-semibold text-[#1b2430]">
                    {certificate.finalScore !== null ? `${certificate.finalScore}%` : "100%"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-[1.2fr_1fr] gap-8 border-t border-[#d8b86a]/55 pt-8">
              <div className="flex items-end justify-between gap-8">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-[#0f62fe]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                      Conclusão integral validada
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#4b5563]">
                    Certificado emitido automaticamente apenas após a conclusão de 100% do curso e
                    aprovação em todas as provas obrigatórias de certificação, quando existentes.
                  </p>
                </div>

                <div className="min-w-[280px]">
                  <div className="border-b border-[#7a5d1b] pb-3 text-center">
                    <p
                      className="text-[40px] leading-none text-[#253041]"
                      style={{
                        fontFamily:
                          '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive',
                      }}
                    >
                      Renan Ferrari
                    </p>
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.28em] text-[#7a5d1b]">
                    Renan Ferrari
                  </p>
                  <p className="mt-1 text-center text-xs uppercase tracking-[0.26em] text-[#8b7355]">
                    Reitor do CFIA
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#d8b86a]/60 bg-white/75 p-5">
                <div className="flex items-center gap-2 text-[#0f62fe]">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                    Verificação pública
                  </span>
                </div>
                <p className="mt-4 font-mono text-sm leading-7 break-all text-[#1b2430]">
                  {certificate.code.toUpperCase()}
                </p>
                <p className="mt-4 text-xs leading-6 text-[#6b7280]">
                  Este código autentica a validade do certificado e permite consulta pública pelo
                  link compartilhável do aluno.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
