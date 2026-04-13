export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Award, TrendingUp, ArrowRight,
  Zap, CheckCircle2, Lock, Play, BarChart3, Sparkles,
} from "lucide-react";

async function getStudentData(userId: string) {
  const [enrollments, certificates, featuredCourses] = await Promise.all([
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
    prisma.course.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        instructor: { select: { name: true } },
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
    }),
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

  return { progressData, certificates, totalEnrollments: enrollments.length, inProgress, completed, featuredCourses };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { progressData, certificates, totalEnrollments, inProgress, completed, featuredCourses } =
    await getStudentData(session.user.id);
  const firstName = session.user.name?.split(" ")[0] ?? "aluno";
  const isSubscribed = session.user.subscriptionStatus === "ACTIVE";

  const statCards = [
    { label: "Matrículas", value: totalEnrollments, icon: BookOpen },
    { label: "Em progresso", value: inProgress, icon: TrendingUp },
    { label: "Concluídos", value: completed, icon: CheckCircle2 },
    { label: "Certificados", value: certificates, icon: Award },
  ];

  // ─── ALUNO ASSINANTE ───────────────────────────────────────────────────────
  if (isSubscribed) {
    const inProgressCourses = progressData.filter((p) => p.percentage > 0 && p.percentage < 100).slice(0, 3);
    const notStarted = progressData.filter((p) => p.percentage === 0).slice(0, 3);
    const continueCourses = inProgressCourses.length > 0 ? inProgressCourses : notStarted;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--cds-text-primary)" }}>
              Olá, {firstName}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--cds-text-secondary)" }}>
              Seu acesso está ativo. O que vamos aprender hoje?
            </p>
          </div>
          <span
            className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2"
            style={{ backgroundColor: "var(--cds-support-success)", color: "#ffffff" }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Assinante ativo
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-[var(--cds-border-subtle)] border border-[var(--cds-border-subtle)]">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-white p-6"
            >
              <div className="flex flex-col gap-4">
                <Icon className="h-6 w-6" style={{ color: "var(--cds-text-secondary)" }} />
                <div>
                  <div className="text-4xl font-light tracking-tight" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>{value}</div>
                  <div className="text-sm mt-1" style={{ color: "var(--cds-text-secondary)" }}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue learning */}
        <div className="border border-[var(--cds-border-subtle)] p-6 bg-white mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg" style={{ color: "var(--cds-text-primary)" }}>Continue aprendendo</h2>
            <Link 
              href="/dashboard/cursos"
              className="text-sm font-semibold flex items-center transition-colors hover:underline"
              style={{ color: "var(--cds-interactive)" }}
            >
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {progressData.length === 0 ? (
            <div
              className="text-center py-16"
              style={{ backgroundColor: "var(--cds-layer-01)" }}
            >
              <div className="h-12 w-12 flex items-center justify-center mx-auto mb-4 bg-white border border-[var(--cds-border-subtle)]">
                <BookOpen className="h-6 w-6" style={{ color: "var(--cds-text-secondary)" }} />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: "var(--cds-text-primary)" }}>Nenhum curso em andamento</h3>
              <p className="text-sm px-4 max-w-sm mx-auto" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.5" }}>
                Você ainda não começou nenhum curso. Explore o catálogo para iniciar sua jornada.
              </p>
              <Button
                className="mt-6 rounded-none font-semibold px-6 h-12"
                style={{ backgroundColor: "var(--cds-button-primary)", color: "#ffffff" }}
                asChild
              >
                <Link href="/cursos">Explorar catálogo</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[var(--cds-border-subtle)] border border-[var(--cds-border-subtle)]">
              {continueCourses.map(({ enrollment, percentage }) => (
                <div
                  key={enrollment.id}
                  className="bg-white p-6 flex flex-col justify-between group transition-colors hover:bg-[var(--cds-layer-01)]"
                >
                  <div className="flex gap-4">
                    <div
                      className="h-16 w-24 flex items-center justify-center shrink-0 border border-[var(--cds-border-subtle)] bg-[var(--cds-layer-01)]"
                    >
                      {enrollment.course.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-6 w-6" style={{ color: "var(--cds-text-secondary)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base line-clamp-1 mb-1" style={{ color: "var(--cds-text-primary)" }}>
                        {enrollment.course.title}
                      </p>
                      <p className="text-sm mb-3" style={{ color: "var(--cds-text-secondary)" }}>
                        {enrollment.course.instructor.name}
                      </p>
                      <div className="flex items-center gap-3">
                        <Progress value={percentage} className="flex-1 h-2 rounded-none bg-[var(--cds-layer-02)] [&>div]:bg-[var(--cds-interactive)]" />
                        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--cds-text-primary)" }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/dashboard/cursos/${enrollment.course.slug}`}
                    className="mt-6 flex justify-between items-center text-sm font-semibold transition-colors group-hover:underline"
                    style={{ color: "var(--cds-interactive)" }}
                  >
                    {percentage === 0 ? "Começar aula" : "Continuar assistindo"} <Play className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── ALUNO GRATUITO (NÃO ASSINANTE) ────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Upgrade Banner (Carbon Style) */}
      <div
        className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          backgroundColor: "var(--cds-text-primary)",
          color: "#ffffff"
        }}
      >
        <div className="max-w-xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}
          >
            Acesso Limitado
          </div>
          <h2 className="text-3xl font-light mb-3" style={{ letterSpacing: "0" }}>
            Acesso Ilimitado ao Conhecimento
          </h2>
          <p style={{ color: "var(--cds-text-secondary)", lineHeight: "1.5" }}>
            Desbloqueie todos os cursos de nível avançado, emita certificados válidos e alcance a excelência técnica.
          </p>
        </div>
        <Button
          className="shrink-0 rounded-none h-12 px-6 font-semibold"
          style={{ backgroundColor: "var(--cds-interactive)", color: "#ffffff" }}
          asChild
        >
          <Link href="/assinar">
            Atualizar para Premium <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mt-2">
        <div>
          <h1 className="text-3xl font-light tracking-tight" style={{ color: "var(--cds-text-primary)" }}>
            Painel do aluno
          </h1>
        </div>
      </div>

      {/* Progress / My Courses Grid */}
      <div>
        <h2 className="font-semibold text-lg mb-6" style={{ color: "var(--cds-text-primary)" }}>
          Meus cursos gratuitos
        </h2>

        {progressData.length === 0 ? (
          <div
            className="text-center py-16"
            style={{ backgroundColor: "var(--cds-layer-01)" }}
          >
            <BookOpen className="mx-auto h-8 w-8 mb-4" style={{ color: "var(--cds-text-secondary)" }} />
            <h3 className="font-semibold mb-2" style={{ color: "var(--cds-text-primary)" }}>Nenhum curso iniciado</h3>
            <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.5" }}>
              Acesse o catálogo e escolha um curso gratuito para começar agora mesmo.
            </p>
            <Button
              className="rounded-none font-semibold h-12 px-6"
              style={{ backgroundColor: "var(--cds-button-secondary)", color: "#ffffff" }}
              asChild
            >
              <Link href="/cursos">Explorar catálogo</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-[var(--cds-border-subtle)] border border-[var(--cds-border-subtle)]">
            {progressData.slice(0, 4).map(({ enrollment, percentage }) => (
              <div
                key={enrollment.id}
                className="bg-white p-6 flex items-center justify-between group transition-colors hover:bg-[var(--cds-layer-01)]"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-16 flex items-center justify-center shrink-0 border border-[var(--cds-border-subtle)] bg-[var(--cds-layer-01)]"
                  >
                    {enrollment.course.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-5 w-5" style={{ color: "var(--cds-text-secondary)" }} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base line-clamp-1 mb-1" style={{ color: "var(--cds-text-primary)" }}>
                      {enrollment.course.title}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: "var(--cds-text-primary)" }}>
                        {percentage}% Completo
                      </span>
                    </div>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/cursos/${enrollment.course.slug}`} className="transition-colors group-hover:text-[var(--cds-interactive)]"
                  style={{ color: "var(--cds-text-secondary)" }}
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
