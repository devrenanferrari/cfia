import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { lessonId, courseId } = await req.json();
  if (!lessonId) return NextResponse.json({ error: "lessonId é obrigatório" }, { status: 400 });

  // Verifica se o aluno está matriculado no curso
  if (courseId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Não matriculado neste curso" }, { status: 403 });
    }
  }

  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    create: {
      userId: session.user.id,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
  });

  // Verifica se o curso foi concluído para emitir certificado
  if (courseId) {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: { select: { id: true } } } } },
    });

    if (course) {
      const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const completedCount = await prisma.progress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessonIds },
          completed: true,
        },
      });

      if (completedCount === allLessonIds.length && allLessonIds.length > 0) {
        // Emite certificado se ainda não existe
        await prisma.certificate.upsert({
          where: { userId_courseId: { userId: session.user.id, courseId } },
          create: { userId: session.user.id, courseId },
          update: {},
        });

        // Atualiza o enrollment como concluído
        await prisma.enrollment.update({
          where: { userId_courseId: { userId: session.user.id, courseId } },
          data: { status: "COMPLETED", completedAt: new Date() },
        });
      }
    }
  }

  return NextResponse.json(progress);
}
