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

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!enrollment) redirect(`/cursos/${slug}`);

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentLesson = aula
    ? allLessons.find((l) => l.id === aula) ?? allLessons[0]
    : allLessons[0];

  const progressRecords = await prisma.progress.findMany({
    where: { userId: session.user.id, lesson: { module: { courseId: course.id } } },
  });

  const completedIds = new Set(
    progressRecords.filter((p) => p.completed).map((p) => p.lessonId)
  );

  const completedCount = completedIds.size;
  const percentage = allLessons.length > 0
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Player principal */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <Link href="/dashboard/cursos" className="text-sm text-muted-foreground hover:text-foreground">
            ← Meus cursos
          </Link>
          <h1 className="text-xl font-bold mt-2">{course.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={percentage} className="flex-1 h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{percentage}% concluído</span>
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
          <div className="border rounded-lg p-12 text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>Este curso ainda não tem aulas.</p>
          </div>
        )}
      </div>

      {/* Sidebar com currículo */}
      <aside className="w-full lg:w-72 flex-shrink-0">
        <h2 className="font-semibold mb-3">Conteúdo do curso</h2>
        <div className="border rounded-lg overflow-hidden">
          {course.modules.map((mod) => (
            <div key={mod.id}>
              <div className="bg-muted/50 px-4 py-2 text-sm font-medium border-b">
                {mod.title}
              </div>
              <ul className="divide-y">
                {mod.lessons.map((lesson) => {
                  const isCompleted = completedIds.has(lesson.id);
                  const isCurrent = lesson.id === currentLesson?.id;
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/dashboard/cursos/${slug}?aula=${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isCurrent
                            ? "bg-[#0052ff0f] text-[#0052ff]"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : (
                          <Circle className={`h-4 w-4 flex-shrink-0 ${isCurrent ? "text-[#0052ff]" : "text-muted-foreground"}`} />
                        )}
                        <span className="line-clamp-2">{lesson.title}</span>
                        {lesson.duration && (
                          <Badge variant="outline" className="ml-auto text-xs flex-shrink-0">
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
