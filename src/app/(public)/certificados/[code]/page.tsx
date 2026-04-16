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
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CertificateView certificate={certificate} />
    </div>
  );
}
