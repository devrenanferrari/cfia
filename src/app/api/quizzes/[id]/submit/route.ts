import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gradeQuizSubmission } from "@/lib/quiz";
import { syncCourseCertificate } from "@/lib/certificates";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" } } },
      },
      attempts: {
        where: { userId: session.user.id },
        orderBy: { attemptNumber: "desc" },
        take: 1,
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: quiz.lesson.module.courseId,
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Não matriculado neste curso" }, { status: 403 });
  }

  if (quiz.questions.length === 0) {
    return NextResponse.json({ error: "Este quiz ainda não possui perguntas." }, { status: 400 });
  }

  const lastAttemptNumber = quiz.attempts[0]?.attemptNumber ?? 0;
  if (quiz.maxAttempts && lastAttemptNumber >= quiz.maxAttempts) {
    return NextResponse.json({ error: "Limite de tentativas atingido." }, { status: 400 });
  }

  const { answers } = (await req.json()) as { answers?: Record<string, string> };
  const normalizedAnswers = answers ?? {};
  const { total, correct, score } = gradeQuizSubmission(quiz.questions, normalizedAnswers);
  const passed = score >= quiz.passingScore;

  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: session.user.id,
        attemptNumber: lastAttemptNumber + 1,
        score,
        passed,
        responses: {
          create: quiz.questions.map((question) => ({
            questionId: question.id,
            optionId: normalizedAnswers[question.id] || null,
          })),
        },
      },
    });

    if (passed) {
      await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: quiz.lessonId,
          },
        },
        create: {
          userId: session.user.id,
          lessonId: quiz.lessonId,
          completed: true,
          completedAt: new Date(),
        },
        update: {
          completed: true,
          completedAt: new Date(),
        },
      });

      await syncCourseCertificate(session.user.id, quiz.lesson.module.courseId);
    }

    return NextResponse.json({
      id: attempt.id,
      score,
      correct,
      total,
      passed,
      passingScore: quiz.passingScore,
      attemptNumber: attempt.attemptNumber,
      attemptsRemaining:
        quiz.maxAttempts === null ? null : Math.max(0, quiz.maxAttempts - attempt.attemptNumber),
    });
  } catch (error) {
    const message = getPrismaErrorMessage(error);
    if (message) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    throw error;
  }
}
