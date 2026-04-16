import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPrismaErrorMessage } from "@/lib/prisma-errors";

async function canManageOption(userId: string, role: string, optionId: string) {
  const option = await prisma.option.findUnique({
    where: { id: optionId },
    include: {
      question: {
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
      },
    },
  });

  if (!option) return null;
  if (role === "ADMIN" || option.question.quiz.lesson.module.course.instructorId === userId) {
    return option;
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
  const option = await canManageOption(session.user.id, session.user.role, id);
  if (!option) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();

  try {
    if (body.isCorrect === true) {
      await prisma.option.updateMany({
        where: { questionId: option.questionId },
        data: { isCorrect: false },
      });
    }

    const updated = await prisma.option.update({
      where: { id },
      data: {
        ...(body.text !== undefined && { text: body.text }),
        ...(body.order !== undefined && { order: Number(body.order) || option.order }),
        ...(body.isCorrect !== undefined && { isCorrect: Boolean(body.isCorrect) }),
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
