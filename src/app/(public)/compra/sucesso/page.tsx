export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, ArrowRight, BookOpen } from "lucide-react";

export default async function CompraSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/cursos");

  const authSession = await getServerSession(authOptions);
  if (!authSession) redirect("/entrar");

  let courseName = "";
  let courseSlug = "";

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
    const courseId = checkoutSession.metadata?.courseId;

    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, slug: true },
      });
      if (course) {
        courseName = course.title;
        courseSlug = course.slug;
      }
    }
  } catch {
    // Stripe session lookup failed — still show success screen
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: "#f4f4f4" }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white border border-[#e0e0e0] border-t-4" style={{ borderTopColor: "#24a148" }}>
          <div className="p-8 text-center">
            <div
              className="h-16 w-16 flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: "#defbe6" }}
            >
              <CheckCircle className="h-8 w-8" style={{ color: "#24a148" }} />
            </div>

            <h1 className="text-xl font-bold mb-2" style={{ color: "#161616" }}>
              Compra realizada com sucesso!
            </h1>

            {courseName ? (
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#525252" }}>
                Você agora tem acesso vitalício ao curso{" "}
                <strong style={{ color: "#161616" }}>{courseName}</strong>.
                Comece a aprender agora mesmo.
              </p>
            ) : (
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#525252" }}>
                Seu acesso foi liberado. Acesse seus cursos no painel.
              </p>
            )}

            <div className="space-y-3">
              {courseSlug && (
                <Link
                  href={`/dashboard/cursos/${courseSlug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 px-5 text-sm font-bold"
                  style={{ backgroundColor: "#0f62fe", color: "#ffffff", textDecoration: "none" }}
                >
                  <BookOpen className="h-4 w-4" />
                  Começar o curso agora
                </Link>
              )}
              <Link
                href="/dashboard/cursos"
                className="flex items-center justify-center gap-2 w-full py-3 px-5 text-sm font-semibold border"
                style={{ borderColor: "#e0e0e0", color: "#525252", textDecoration: "none", backgroundColor: "#f4f4f4" }}
              >
                Ver meus cursos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="px-8 py-4 border-t" style={{ borderColor: "#f4f4f4", backgroundColor: "#fafafa" }}>
            <p className="text-xs text-center" style={{ color: "#8d8d8d" }}>
              Um comprovante foi enviado para o seu email · Suporte em{" "}
              <a href="mailto:contato@cfia.com.br" style={{ color: "#0f62fe" }}>
                contato@cfia.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
