export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, BookOpen } from "lucide-react";
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
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (fallbackCourse) {
      course = {
        ...fallbackCourse,
        modules: fallbackCourse.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) => ({
            ...lesson,
            quiz: null,
          })),
        })),
      };
    }
  }

  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!enrollment) redirect(`/cursos/${slug}`);

  const allLessons = course.modules.flatMap((module) => module.lessons);
  const currentLesson = aula
    ? allLessons.find((lesson) => lesson.id === aula) ?? allLessons[0]
    : allLessons[0];

  const progressRecords = await prisma.progress.findMany({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
  });

  const completedIds = new Set(
    progressRecords.filter((progress) => progress.completed).map((progress) => progress.lessonId)
  );

  const completedCount = completedIds.size;
  const percentage =
    allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="flex h-full flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <Link
            href="/dashboard/cursos"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Voltar para meus cursos
          </Link>
          <h1 className="mt-2 text-xl font-bold">{course.title}</h1>
          {quizFeatureError && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {quizFeatureError}
            </div>
          )}
          <div className="mt-2 flex items-center gap-3">
            <Progress value={percentage} className="h-2 flex-1" />
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              {percentage}% concluído
            </span>
          </div>
        </div>

        {currentLesson ? (
          <LessonPlayer
            lesson={currentLesson}
            courseId={course.id}
            isCompleted={completedIds.has(currentLesson.id)}
            bunnyLibraryId={process.env.BUNNY_STREAM_LIBRARY_ID ?? ""}
          />
        ) : (
          <div className="rounded-lg border p-12 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-40" />
            <p>Este curso ainda não tem aulas.</p>
          </div>
        )}
      </div>

      <aside className="w-full flex-shrink-0 lg:w-72">
        <h2 className="mb-3 font-semibold">Conteúdo do curso</h2>
        <div className="overflow-hidden rounded-lg border">
          {course.modules.map((module) => (
            <div key={module.id}>
              <div className="border-b bg-muted/50 px-4 py-2 text-sm font-medium">
                {module.title}
              </div>
              <ul className="divide-y">
                {module.lessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  const isCurrent = lesson.id === currentLesson?.id;

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/dashboard/cursos/${slug}?aula=${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isCurrent ? "bg-[#0052ff0f] text-[#0052ff]" : "hover:bg-muted/50"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : (
                          <Circle
                            className={`h-4 w-4 flex-shrink-0 ${
                              isCurrent ? "text-[#0052ff]" : "text-muted-foreground"
                            }`}
                          />
                        )}
                        <span className="line-clamp-2">{lesson.title}</span>
                        {lesson.duration && (
                          <Badge variant="outline" className="ml-auto flex-shrink-0 text-xs">
                            {lesson.duration}min
                          </Badge>
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
