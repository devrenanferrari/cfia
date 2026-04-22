export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

export default async function CourseLearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ aula?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/entrar");

  const { slug } = await params;
  const { aula } = await searchParams;

  let quizFeatureError: string | null = null;
  let course:
    | Awaited<ReturnType<typeof prisma.course.findUnique>>
    | {
        id: string;
        title: string;
        slug: string;
        modules: Array<{
          id: string;
          title: string;
          lessons: Array<{
            id: string;
            title: string;
            description: string | null;
            videoUrl: string | null;
            type: string;
            content: string | null;
            duration: number | null;
            quiz: null;
          }>;
        }>;
      }
    | null = null;

  try {
    course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                quiz: {
                  include: {
                    attempts: {
                      where: { userId: session.user.id },
                      orderBy: { submittedAt: "desc" },
                      take: 5,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    quizFeatureError = getPrismaErrorMessage(error);
    if (!quizFeatureError) throw error;

    const fallbackCourse = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" } } },
        },
      },
    });

    if (fallbackCourse) {
      course = {
        ...fallbackCourse,
        modules: fallbackCourse.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => ({ ...l, quiz: null })),
        })),
      };
    }
  }

  if (!course) notFound();

  const typedCourse = course as {
    id: string;
    title: string;
    slug: string;
    modules: Array<{
      id: string;
      title: string;
      lessons: Array<{
        id: string;
        title: string;
        description: string | null;
        videoUrl: string | null;
        type: string;
        content: string | null;
        duration: number | null;
        quiz: { id: string; title: string; description: string | null; passingScore: number; maxAttempts: number | null; isCertificationExam: boolean; attempts: { id: string; score: number; passed: boolean; attemptNumber: number; submittedAt: Date; }[]; } | null;
      }>;
    }>;
  };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: typedCourse.id } },
  });
  if (!enrollment) redirect(`/cursos/${slug}`);

  const allLessons = typedCourse.modules.flatMap((m) => m.lessons);
  const currentLesson = aula
    ? allLessons.find((l) => l.id === aula) ?? allLessons[0]
    : allLessons[0];

  const progressRecords = await prisma.progress.findMany({
    where: { userId: session.user.id, lesson: { module: { courseId: typedCourse.id } } },
  });
  const completedIds = new Set(
    progressRecords.filter((p) => p.completed).map((p) => p.lessonId)
  );
  const completedCount = completedIds.size;
  const percentage = allLessons.length > 0
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-0 lg:flex-row lg:gap-6 lg:items-start">

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Breadcrumb + title */}
        <div className="bg-white border border-[#e0e0e0] p-4 md:p-5 mb-px">
          <Link
            href="/dashboard/cursos"
            className="inline-flex items-center gap-2 text-xs mb-3 transition-colors hover:text-[#0f62fe]"
            style={{ color: "#525252" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Meus cursos
          </Link>
          <h1 className="font-semibold text-base md:text-lg" style={{ color: "#161616" }}>
            {typedCourse.title}
          </h1>
          {quizFeatureError && (
            <div
              className="mt-3 px-4 py-3 text-sm border"
              style={{ backgroundColor: "#fff8e1", borderColor: "#f1c21b", color: "#3c2200" }}
            >
              {quizFeatureError}
            </div>
          )}
          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3">
            <Progress
              value={percentage}
              className="flex-1 h-1.5 rounded-none bg-[#e0e0e0] [&>div]:bg-[#0f62fe] [&>div]:rounded-none"
            />
            <span
              className="text-xs whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)", color: "#525252" }}
            >
              {percentage}% concluído
            </span>
          </div>
        </div>

        {/* Video player */}
        {currentLesson ? (
          <LessonPlayer
            lesson={currentLesson}
            courseId={typedCourse.id}
            isCompleted={completedIds.has(currentLesson.id)}
            bunnyLibraryId={process.env.BUNNY_STREAM_LIBRARY_ID ?? ""}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center py-20 border border-[#e0e0e0] bg-white"
            style={{ color: "#8d8d8d" }}
          >
            <BookOpen className="mb-3 h-12 w-12 opacity-40" />
            <p className="text-sm">Este curso ainda não tem aulas.</p>
          </div>
        )}
      </div>

      {/* ── Lesson sidebar ──────────────────────────────────────── */}
      <aside className="w-full lg:w-72 flex-shrink-0 mt-4 lg:mt-0 lg:sticky lg:top-20">
        {/* Header */}
        <div
          className="px-4 py-3 border border-[#e0e0e0] border-b-0"
          style={{ backgroundColor: "#161616" }}
        >
          <h2
            className="text-xs uppercase font-semibold text-white"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.14em" }}
          >
            Conteúdo do curso
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#8d8d8d" }}>
            {completedCount}/{allLessons.length} aulas concluídas
          </p>
        </div>

        <div className="border border-[#e0e0e0] overflow-hidden bg-white">
          {typedCourse.modules.map((module, mIdx) => (
            <div key={module.id}>
              {/* Module title */}
              <div
                className="px-4 py-2.5 border-b border-[#e0e0e0] text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "#f4f4f4",
                  color: "#525252",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.1em",
                  ...(mIdx > 0 ? { borderTop: "1px solid #e0e0e0" } : {}),
                }}
              >
                {module.title}
              </div>

              {/* Lessons */}
              <ul>
                {module.lessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  const isCurrent = lesson.id === currentLesson?.id;

                  return (
                    <li key={lesson.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <Link
                        href={`/dashboard/cursos/${slug}?aula=${lesson.id}`}
                        className="flex items-start gap-3 px-4 py-3.5 text-sm transition-colors"
                        style={{
                          backgroundColor: isCurrent ? "#edf5ff" : "#fff",
                          color: isCurrent ? "#0043ce" : "#161616",
                          fontWeight: isCurrent ? 600 : 400,
                          borderLeft: isCurrent ? "3px solid #0f62fe" : "3px solid transparent",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle
                            className="h-4 w-4 flex-shrink-0 mt-0.5"
                            style={{ color: "#24a148" }}
                          />
                        ) : (
                          <Circle
                            className="h-4 w-4 flex-shrink-0 mt-0.5"
                            style={{ color: isCurrent ? "#0f62fe" : "#c6c6c6" }}
                          />
                        )}
                        <span className="flex-1 line-clamp-2 text-sm leading-snug">
                          {lesson.title}
                        </span>
                        {lesson.duration && (
                          <span
                            className="text-xs flex-shrink-0"
                            style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d" }}
                          >
                            {lesson.duration}m
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}
