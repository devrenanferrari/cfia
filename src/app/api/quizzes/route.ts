import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageLessonQuiz } from "@/lib/quiz";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { lessonId } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId é obrigatório" }, { status: 400 });
  }

  const lesson = await canManageLessonQuiz(session.user.id, session.user.role, lessonId);
  if (!lesson) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    const existingQuiz = await prisma.quiz.findUnique({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { options: { orderBy: { order: "asc" } } },
        },
      },
    });
    if (existingQuiz) return NextResponse.json(existingQuiz);

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title: lesson.title,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { options: { orderBy: { order: "asc" } } },
        },
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    const message = getPrismaErrorMessage(error);
    if (message) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    throw error;
  }
}
