export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Award, TrendingUp, ArrowRight,
  CheckCircle2, Play,
} from "lucide-react";

async function getStudentData(userId: string) {
  const [enrollments, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            modules: { include: { lessons: { select: { id: true } } } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    prisma.certificate.count({ where: { userId } }),
  ]);

  const progressData = await Promise.all(
    enrollments.map(async (enrollment) => {
      const totalLessons = enrollment.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const completedLessons = await prisma.progress.count({
        where: { userId, completed: true, lesson: { module: { courseId: enrollment.courseId } } },
      });
      return {
        enrollment,
        totalLessons,
        completedLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    })
  );

  const inProgress = progressData.filter((p) => p.percentage > 0 && p.percentage < 100).length;
  const completed = progressData.filter((p) => p.percentage === 100).length;

  return { progressData, certificates, totalEnrollments: enrollments.length, inProgress, completed };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { progressData, certificates, totalEnrollments, inProgress, completed } =
    await getStudentData(session.user.id);
  const firstName = session.user.name?.split(" ")[0] ?? "aluno";
  const isSubscribed = session.user.subscriptionStatus === "ACTIVE";

  const inProgressCourses = progressData.filter((p) => p.percentage > 0 && p.percentage < 100).slice(0, 4);
  const notStarted = progressData.filter((p) => p.percentage === 0).slice(0, 4);
  const continueCourses = inProgressCourses.length > 0 ? inProgressCourses : notStarted;

  return (
    <div className="space-y-0">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div
        className="flex items-start justify-between p-6 md:p-8 bg-white border border-[#e0e0e0] mb-px"
      >
        <div>
          <p
            className="text-xs uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}
          >
            {isSubscribed ? "Apoiador" : "Aluno"}
          </p>
          <h1
            className="text-3xl font-light"
            style={{ color: "#161616", letterSpacing: "-0.01em" }}
          >
            Olá, {firstName}
          </h1>
          <p className="text-sm mt-1" style={{ color: "#525252" }}>
            {isSubscribed
              ? "Seu acesso está ativo. O que vamos aprender hoje?"
              : "Continue explorando cursos gratuitos."}
          </p>
        </div>
        {isSubscribed && (
          <span
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white"
            style={{ backgroundColor: "#24a148" }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Apoiador ativo
          </span>
        )}
      </div>

      {/* ── Stats grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e0e0e0] border border-[#e0e0e0] border-t-0">
        {[
          { label: "Matrículas", value: totalEnrollments, icon: BookOpen },
          { label: "Em progresso", value: inProgress, icon: TrendingUp },
          { label: "Concluídos", value: completed, icon: CheckCircle2 },
          { label: "Certificados", value: certificates, icon: Award },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-6 flex flex-col gap-4">
            <Icon className="h-5 w-5" style={{ color: "#8d8d8d" }} />
            <div>
              <div
                className="text-4xl font-light mb-1"
                style={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  color: "#161616",
                  letterSpacing: "-0.02em",
                }}
              >
                {value}
              </div>
              <div className="text-xs" style={{ color: "#525252" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upgrade banner (free users) ─────────────────────────── */}
      {!isSubscribed && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-8 mt-px border border-[#e0e0e0] border-t-0"
          style={{ backgroundColor: "#161616" }}
        >
          <div>
            <p
              className="text-xs uppercase mb-2"
              style={{ fontFamily: "var(--font-mono)", color: "#4589ff", letterSpacing: "0.14em" }}
            >
              Projeto gratuito
            </p>
            <h2
              className="text-xl font-light text-white mb-2"
              style={{ letterSpacing: "-0.01em" }}
            >
              Ajude o CFIA a continuar gratuito
            </h2>
            <p className="text-sm" style={{ color: "#c6c6c6" }}>
              O acesso aos cursos publicados e gratuito. Apoios ajudam a manter infraestrutura, gravacao e melhorias.
            </p>
          </div>
          <Link
            href="/apoie"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold text-sm whitespace-nowrap transition-colors hover:bg-[#f4f4f4] active:scale-[0.98] flex-shrink-0"
            style={{ backgroundColor: "#fff", color: "#0f62fe" }}
          >
            Apoiar projeto <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* ── Continue aprendendo ─────────────────────────────────── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-base" style={{ color: "#161616" }}>
            Continue aprendendo
          </h2>
          <Link
            href="/dashboard/cursos"
            className="text-sm flex items-center gap-1 transition-colors hover:text-[#0043ce]"
            style={{ color: "#0f62fe" }}
          >
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {progressData.length === 0 ? (
          <div
            className="text-center py-16 border border-[#e0e0e0] bg-white"
          >
            <div className="h-12 w-12 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#f4f4f4" }}>
              <BookOpen className="h-6 w-6" style={{ color: "#8d8d8d" }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "#161616" }}>Nenhum curso em andamento</h3>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "#525252", lineHeight: 1.5 }}>
              Explore o catálogo e comece sua jornada em IA.
            </p>
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0353e9]"
              style={{ backgroundColor: "#0f62fe" }}
            >
              Explorar catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            {continueCourses.map(({ enrollment, percentage }) => (
              <div
                key={enrollment.id}
                className="bg-white p-5 flex flex-col justify-between hover:bg-[#f4f4f4] transition-colors"
              >
                <div className="flex gap-4">
                  <div
                    className="h-16 w-24 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#f4f4f4", border: "1px solid #e0e0e0" }}
                  >
                    {enrollment.course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-6 w-6" style={{ color: "#8d8d8d" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: "#161616" }}>
                      {enrollment.course.title}
                    </p>
                    <p className="text-xs mb-3" style={{ color: "#525252" }}>
                      {enrollment.course.instructor.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={percentage}
                        className="flex-1 h-1.5 rounded-none bg-[#e0e0e0] [&>div]:bg-[#0f62fe] [&>div]:rounded-none"
                      />
                      <span
                        className="text-xs"
                        style={{ fontFamily: "var(--font-mono)", color: "#525252" }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/cursos/${enrollment.course.slug}`}
                  className="mt-5 flex justify-between items-center text-sm font-semibold transition-colors border-t border-[#e0e0e0] pt-4 hover:text-[#0043ce]"
                  style={{ color: "#0f62fe" }}
                >
                  <span>{percentage === 0 ? "Começar" : "Continuar"}</span>
                  <Play className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
