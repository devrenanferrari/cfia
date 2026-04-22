export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowRight, CheckCircle2, Play } from "lucide-react";

async function getEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          category: { select: { name: true } },
          modules: { include: { lessons: { select: { id: true } } } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return Promise.all(
    enrollments.map(async (e) => {
      const totalLessons = e.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = await prisma.progress.count({
        where: { userId, completed: true, lesson: { module: { courseId: e.courseId } } },
      });
      return {
        ...e,
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    })
  );
}

function StatusLabel({ percentage }: { percentage: number }) {
  if (percentage === 100) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#defbe6", color: "#198038" }}
      >
        <CheckCircle2 className="h-3 w-3" />
        Concluído
      </span>
    );
  }
  if (percentage > 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
        style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
      >
        Em progresso
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: "#f4f4f4", color: "#525252" }}
    >
      Não iniciado
    </span>
  );
}

export default async function MeusCursosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const enrollments = await getEnrollments(session.user.id);

  return (
    <div>
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-[#e0e0e0] mb-px">
        <h1
          className="text-3xl font-light mb-1"
          style={{ color: "#161616", letterSpacing: "-0.01em" }}
        >
          Meus cursos
        </h1>
        <p
          className="text-xs uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}
        >
          {enrollments.length} matrícula{enrollments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-20 border border-[#e0e0e0] bg-white">
          <div
            className="h-14 w-14 flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <BookOpen className="h-7 w-7" style={{ color: "#8d8d8d" }} />
          </div>
          <h2 className="font-semibold text-lg mb-2" style={{ color: "#161616" }}>
            Nenhum curso ainda
          </h2>
          <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "#525252", lineHeight: 1.6 }}>
            Explore o catálogo e escolha um curso para começar agora mesmo.
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
        <div className="flex flex-col gap-px bg-[#e0e0e0] border border-[#e0e0e0] border-t-0">
          {enrollments.map((e) => {
            const ctaLabel = e.percentage === 0 ? "Começar" : e.percentage === 100 ? "Rever" : "Continuar";
            return (
              <div
                key={e.id}
                className="bg-white p-5 md:p-6 flex items-center gap-5 hover:bg-[#f4f4f4] transition-colors group"
              >
                {/* Thumbnail */}
                <div
                  className="h-16 w-24 flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
                >
                  {e.course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.course.thumbnail}
                      alt={e.course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6" style={{ color: "#8d8d8d" }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm line-clamp-1" style={{ color: "#161616" }}>
                      {e.course.title}
                    </h3>
                    <StatusLabel percentage={e.percentage} />
                  </div>
                  <p className="text-xs mb-3" style={{ color: "#525252" }}>
                    {e.course.instructor.name}
                    {e.course.category ? ` · ${e.course.category.name}` : ""}
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={e.percentage}
                      className="flex-1 h-1.5 rounded-none bg-[#e0e0e0] [&>div]:bg-[#0f62fe] [&>div]:rounded-none"
                    />
                    <span
                      className="text-xs whitespace-nowrap"
                      style={{ fontFamily: "var(--font-mono)", color: "#525252" }}
                    >
                      {e.completedLessons}/{e.totalLessons}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/dashboard/cursos/${e.course.slug}`}
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-xs text-white transition-colors hover:bg-[#0353e9] flex-shrink-0"
                  style={{ backgroundColor: "#0f62fe" }}
                >
                  {e.percentage > 0 && e.percentage < 100 && <Play className="h-3.5 w-3.5" />}
                  {ctaLabel}
                </Link>
                <Link
                  href={`/dashboard/cursos/${e.course.slug}`}
                  className="sm:hidden flex-shrink-0 transition-colors"
                  style={{ color: "#0f62fe" }}
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
