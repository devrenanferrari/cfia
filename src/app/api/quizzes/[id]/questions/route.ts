import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageQuiz } from "@/lib/quiz";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

export async function POST(
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

  const count = await prisma.question.count({ where: { quizId: id } });
  const body = await req.json().catch(() => ({}));
  const text = typeof body.text === "string" && body.text.trim() ? body.text.trim() : `Pergunta ${count + 1}`;

  try {
    const question = await prisma.question.create({
      data: {
        quizId: id,
        text,
        order: count + 1,
        options: {
          create: [
            { text: "Opção 1", order: 1, isCorrect: true },
            { text: "Opção 2", order: 2 },
            { text: "Opção 3", order: 3 },
            { text: "Opção 4", order: 4 },
          ],
        },
      },
      include: {
        options: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    const message = getPrismaErrorMessage(error);
    if (message) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    throw error;
  }
}
