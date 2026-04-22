export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CertificateView } from "@/components/certificate-view";

export default async function PublicCertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { name: true, email: true } },
      course: {
        include: {
          instructor: { select: { name: true } },
          modules: {
            include: {
              lessons: {
                select: { duration: true },
              },
            },
          },
        },
      },
    },
  });

  if (!certificate) notFound();

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <p
            className="text-xs font-semibold uppercase tracking-[0.32em]"
            style={{ color: "#4589ff", fontFamily: "var(--font-mono, monospace)" }}
          >
            CFIA — Certificado Público
          </p>
          <p className="text-xs" style={{ color: "#6f6f6f" }}>
            Verificação de autenticidade
          </p>
        </div>
        <CertificateView certificate={certificate} />
      </div>
    </div>
  );
}
