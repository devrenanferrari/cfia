import { prisma } from "@/lib/prisma";

export async function canManageLessonQuiz(userId: string, role: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: {
            select: { instructorId: true },
          },
        },
      },
    },
  });

  if (!lesson) return null;
  if (role === "ADMIN" || lesson.module.course.instructorId === userId) return lesson;
  return null;
}

export async function canManageQuiz(userId: string, role: string, quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: {
                select: { instructorId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!quiz) return null;
  if (role === "ADMIN" || quiz.lesson.module.course.instructorId === userId) return quiz;
  return null;
}

export function gradeQuizSubmission(
  questions: Array<{
    id: string;
    options: Array<{ id: string; isCorrect: boolean }>;
  }>,
  answers: Record<string, string>
) {
  const total = questions.length;
  const correct = questions.reduce((count, question) => {
    const selectedOptionId = answers[question.id];
    const correctOption = question.options.find((option) => option.isCorrect);
    return selectedOptionId && correctOption?.id === selectedOptionId ? count + 1 : count;
  }, 0);

  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { total, correct, score };
}
