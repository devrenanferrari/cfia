export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { CertificateView } from "@/components/certificate-view";

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar");

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

  if (!certificate || certificate.userId !== session.user.id) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CertificateView certificate={certificate} showDashboardLink />
    </div>
  );
}
