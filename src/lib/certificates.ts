import { prisma } from "@/lib/prisma";

function isQuiz<T>(value: T | null): value is T {
  return value !== null;
}

export function getCourseDurationMinutes(course: {
  duration?: number | null;
  modules?: Array<{
    lessons?: Array<{
      duration?: number | null;
    }>;
  }>;
}) {
  if (typeof course.duration === "number" && course.duration > 0) {
    return course.duration;
  }

  const lessons = course.modules?.flatMap((module) => module.lessons ?? []) ?? [];
  const total = lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0);
  return total > 0 ? total : null;
}

export function formatCourseDuration(totalMinutes: number | null) {
  if (!totalMinutes || totalMinutes <= 0) return "Carga horária não informada";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}min`;
}

export async function syncCourseCertificate(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quiz: {
                include: {
                  attempts: {
                    where: { userId, passed: true },
                    orderBy: { score: "desc" },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return { eligible: false, certificate: null };

  const allLessons = course.modules.flatMap((module) => module.lessons);
  if (allLessons.length === 0) return { eligible: false, certificate: null };

  const completedProgress = await prisma.progress.findMany({
    where: {
      userId,
      lessonId: { in: allLessons.map((lesson) => lesson.id) },
      completed: true,
    },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(completedProgress.map((item) => item.lessonId));
  const allLessonsCompleted = allLessons.every((lesson) => completedLessonIds.has(lesson.id));

  const certificationAttempts = allLessons
    .map((lesson) => lesson.quiz)
    .filter(isQuiz)
    .filter((quiz) => quiz.isCertificationExam)
    .map((quiz) => quiz.attempts[0])
    .filter((attempt): attempt is NonNullable<typeof attempt> => Boolean(attempt));

  const allCertificationExamsPassed = allLessons
    .map((lesson) => lesson.quiz)
    .filter(isQuiz)
    .filter((quiz) => quiz.isCertificationExam)
    .every((quiz) => quiz.attempts.length > 0);

  if (!allLessonsCompleted || !allCertificationExamsPassed) {
    return { eligible: false, certificate: null };
  }

  const finalScore = certificationAttempts.length
    ? Math.max(...certificationAttempts.map((attempt) => attempt.score))
    : null;

  const certificate = await prisma.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, finalScore },
    update: { finalScore },
  });

  await prisma.enrollment.updateMany({
    where: { userId, courseId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return { eligible: true, certificate };
}
