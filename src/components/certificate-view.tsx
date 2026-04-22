import { ShieldCheck, Award } from "lucide-react";
import { CertificateActions } from "@/components/certificate-actions";
import { formatCourseDuration, getCourseDurationMinutes, toCamelCase } from "@/lib/certificates";

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
  const studentName = toCamelCase(
    certificate.user.name || certificate.user.email?.split("@")[0] || "Aluno CFIA"
  );
  const workload = formatCourseDuration(getCourseDurationMinutes(certificate.course));
  const publicPath = `/certificados/${certificate.code}`;
  const issueDate = new Date(certificate.issuedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const score =
    certificate.finalScore !== null ? `${certificate.finalScore}%` : "100%";

  return (
    <div className="space-y-4">
      <CertificateActions
        code={certificate.code}
        publicPath={publicPath}
        showDashboardLink={showDashboardLink}
      />

      {/* Printable certificate — id is used by html2canvas */}
      <div
        id="certificate"
        className="relative mx-auto w-full max-w-2xl bg-white"
        style={{ border: "1px solid #e0e0e0" }}
      >
        {/* Blue left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: "#0f62fe" }}
        />

        <div className="pl-8 pr-6 pt-8 pb-8 sm:pl-12 sm:pr-10 sm:pt-10 sm:pb-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.32em]"
                style={{ color: "#0f62fe", fontFamily: "var(--font-mono, monospace)" }}
              >
                CFIA — Centro de Formação e Inteligência Artificial
              </p>
              <p
                className="mt-3 text-[11px] uppercase tracking-[0.26em]"
                style={{ color: "#6f6f6f" }}
              >
                Certificado de Conclusão
              </p>
            </div>
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 52,
                height: 52,
                backgroundColor: "#edf5ff",
                border: "1px solid #0f62fe",
              }}
            >
              <Award className="h-6 w-6" style={{ color: "#0f62fe" }} />
            </div>
          </div>

          {/* Hairline separator */}
          <div className="mt-6 mb-6" style={{ height: 1, backgroundColor: "#e0e0e0" }} />

          {/* Student name */}
          <p
            className="text-[11px] uppercase tracking-[0.24em]"
            style={{ color: "#6f6f6f" }}
          >
            Concedido a
          </p>
          <h1
            className="mt-3 text-4xl sm:text-5xl leading-tight"
            style={{
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#161616",
            }}
          >
            {studentName}
          </h1>

          {/* Description */}
          <p
            className="mt-5 text-sm leading-7 max-w-lg"
            style={{ color: "#525252" }}
          >
            concluiu integralmente a formação e cumpriu todos os requisitos acadêmicos,
            incluindo avaliações obrigatórias e prova final quando aplicável, do curso
          </p>

          {/* Course title */}
          <h2
            className="mt-4 text-xl sm:text-2xl font-semibold leading-snug max-w-lg"
            style={{ color: "#0f62fe" }}
          >
            {certificate.course.title}
          </h2>

          {/* Hairline separator */}
          <div className="mt-8 mb-6" style={{ height: 1, backgroundColor: "#e0e0e0" }} />

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Carga horária
              </p>
              <p className="mt-1.5 text-base font-semibold" style={{ color: "#161616" }}>
                {workload}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Instrutor
              </p>
              <p className="mt-1.5 text-base font-semibold" style={{ color: "#161616" }}>
                {toCamelCase(certificate.course.instructor.name || "Equipe CFIA")}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Emissão
              </p>
              <p className="mt-1.5 text-base font-semibold" style={{ color: "#161616" }}>
                {issueDate}
              </p>
            </div>
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "#8d8d8d", fontFamily: "var(--font-mono, monospace)" }}
              >
                Resultado
              </p>
              <p className="mt-1.5 text-base font-semibold" style={{ color: "#0f62fe" }}>
                {score}
              </p>
            </div>
          </div>

          {/* Hairline separator */}
          <div className="mt-8 mb-6" style={{ height: 1, backgroundColor: "#e0e0e0" }} />

          {/* Bottom: verification + signature */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2" style={{ color: "#0f62fe" }}>
                <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Verificação pública
                </p>
              </div>
              <p
                className="mt-2 text-sm break-all"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#161616",
                  letterSpacing: "0.06em",
                }}
              >
                {certificate.code.toUpperCase()}
              </p>
              <p className="mt-1 text-xs" style={{ color: "#8d8d8d" }}>
                certificados.cfia.com.br/{certificate.code}
              </p>
            </div>

            <div className="text-right">
              <p
                className="text-2xl"
                style={{
                  fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
                  color: "#161616",
                  borderBottom: "1px solid #c6c6c6",
                  paddingBottom: 4,
                }}
              >
                Renan Ferrari
              </p>
              <p
                className="mt-2 text-xs uppercase tracking-[0.22em]"
                style={{ color: "#525252" }}
              >
                Renan Ferrari — Reitor do CFIA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
