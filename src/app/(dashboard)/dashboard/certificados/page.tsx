export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus certificados</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {certificates.length} certificado{certificates.length !== 1 ? "s" : ""} emitido{certificates.length !== 1 ? "s" : ""}
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-white">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-semibold mb-2">Nenhum certificado ainda</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Conclua um curso para receber seu certificado.
          </p>
          <Button style={{ backgroundColor: "#0052ff" }} className="rounded-[56px] px-8" asChild>
            <Link href="/cursos">Explorar cursos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white border rounded-2xl p-6 relative overflow-hidden"
            >
              {/* decorative stripe */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: "#0052ff" }} />

              <div className="flex items-start gap-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#0052ff15" }}
                >
                  <Award className="h-6 w-6" style={{ color: "#0052ff" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-2 mb-1">{cert.course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    Instrutor: {cert.course.instructor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Emitido em {new Date(cert.issuedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs mt-1 font-mono" style={{ color: "#0052ff" }}>
                    #{cert.code.slice(0, 12).toUpperCase()}
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Certificado premium disponível para impressão em PDF e link público.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="rounded-[56px] gap-1.5 text-xs flex-1" asChild>
                  <Link href={`/dashboard/certificados/${cert.code}`}>
                    <Award className="h-3 w-3" />
                    Ver certificado
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="rounded-[56px] gap-1.5 text-xs flex-1" asChild>
                  <Link href={`/certificados/${cert.code}`}>
                    <ExternalLink className="h-3 w-3" />
                    Link público
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
