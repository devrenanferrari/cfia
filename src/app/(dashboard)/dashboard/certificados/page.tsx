export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Award, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

async function getCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { course: { include: { instructor: { select: { name: true } } } } },
    orderBy: { issuedAt: "desc" },
  });
}

export default async function CertificadosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const certificates = await getCertificates(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-[#e0e0e0] mb-px">
        <h1
          className="text-3xl font-light mb-1"
          style={{ color: "#161616", letterSpacing: "-0.01em" }}
        >
          Certificados
        </h1>
        <p
          className="text-xs uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}
        >
          {certificates.length} certificado{certificates.length !== 1 ? "s" : ""} emitido{certificates.length !== 1 ? "s" : ""}
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 border border-[#e0e0e0] bg-white">
          <div
            className="h-14 w-14 flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <Award className="h-7 w-7" style={{ color: "#8d8d8d" }} />
          </div>
          <h2 className="font-semibold text-lg mb-2" style={{ color: "#161616" }}>
            Nenhum certificado ainda
          </h2>
          <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "#525252", lineHeight: 1.6 }}>
            Conclua um curso para receber seu certificado e adicionar ao seu portfólio.
          </p>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0353e9]"
            style={{ backgroundColor: "#0f62fe" }}
          >
            Explorar cursos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0] border-t-0">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white p-6 relative overflow-hidden hover:bg-[#f4f4f4] transition-colors"
            >
              {/* Accent left border */}
              <div
                className="absolute top-0 left-0 bottom-0 w-1"
                style={{ backgroundColor: "#0f62fe" }}
              />

              <div className="pl-4">
                {/* Top: icon + code */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="h-10 w-10 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#edf5ff" }}
                  >
                    <Award className="h-5 w-5" style={{ color: "#0f62fe" }} />
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ fontFamily: "var(--font-mono)", color: "#0f62fe" }}
                  >
                    #{cert.code.slice(0, 12).toUpperCase()}
                  </span>
                </div>

                {/* Course info */}
                <h3 className="font-semibold text-base line-clamp-2 mb-1" style={{ color: "#161616" }}>
                  {cert.course.title}
                </h3>
                <p className="text-xs mb-1" style={{ color: "#525252" }}>
                  {cert.course.instructor.name}
                </p>
                <p
                  className="text-xs mb-5"
                  style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}
                >
                  Emitido em{" "}
                  {new Date(cert.issuedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {/* Actions */}
                <div
                  className="flex flex-col sm:flex-row gap-2 pt-4"
                  style={{ borderTop: "1px solid #e0e0e0" }}
                >
                  <Link
                    href={`/dashboard/certificados/${cert.code}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0353e9]"
                    style={{ backgroundColor: "#0f62fe" }}
                  >
                    <Award className="h-3.5 w-3.5" />
                    Ver certificado
                  </Link>
                  <Link
                    href={`/certificados/${cert.code}`}
                    target="_blank"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-colors border border-[#c6c6c6] hover:bg-[#f4f4f4]"
                    style={{ color: "#161616" }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Link público
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
