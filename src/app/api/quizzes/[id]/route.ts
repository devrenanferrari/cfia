import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageQuiz } from "@/lib/quiz";

export async function GET(
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
        orderBy: { submittedAt: "desc" },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
  }

  const isManager =
    session.user.role === "ADMIN" || quiz.lesson.module.course.instructorId === session.user.id;

  if (!isManager) {
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
  }

  if (isManager) {
    return NextResponse.json(quiz);
  }

  const sanitizedQuiz = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    isCertificationExam: quiz.isCertificationExam,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.text,
      order: question.order,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        order: option.order,
      })),
    })),
    attempts: quiz.attempts.map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      passed: attempt.passed,
      attemptNumber: attempt.attemptNumber,
      submittedAt: attempt.submittedAt,
    })),
  };

  return NextResponse.json(sanitizedQuiz);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const quiz = await canManageQuiz(session.user.id, session.user.role, id);
  if (!quiz) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.quiz.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description || null }),
      ...(body.passingScore !== undefined && {
        passingScore: Math.min(100, Math.max(1, Number(body.passingScore) || 1)),
      }),
      ...(body.maxAttempts !== undefined && {
        maxAttempts: body.maxAttempts ? Math.max(1, Number(body.maxAttempts)) : null,
      }),
      ...(body.isCertificationExam !== undefined && {
        isCertificationExam: Boolean(body.isCertificationExam),
      }),
    },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const quiz = await canManageQuiz(session.user.id, session.user.role, id);
  if (!quiz) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.quiz.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
