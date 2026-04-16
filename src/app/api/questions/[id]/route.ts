import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

async function canManageQuestion(userId: string, role: string, questionId: string) {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      quiz: {
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
      },
    },
  });

  if (!question) return null;
  if (role === "ADMIN" || question.quiz.lesson.module.course.instructorId === userId) {
    return question;
  }

  return null;
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
  const question = await canManageQuestion(session.user.id, session.user.role, id);
  if (!question) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  try {
    const updated = await prisma.question.update({
      where: { id },
      data: {
        ...(body.text !== undefined && { text: body.text }),
        ...(body.order !== undefined && { order: Number(body.order) || question.order }),
      },
      include: {
        options: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = getPrismaErrorMessage(error);
    if (message) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    throw error;
  }
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
  const question = await canManageQuestion(session.user.id, session.user.role, id);
  if (!question) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  try {
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = getPrismaErrorMessage(error);
    if (message) {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    throw error;
  }
}
