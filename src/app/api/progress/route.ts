import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncCourseCertificate } from "@/lib/certificates";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { lessonId, courseId } = await req.json();
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId é obrigatório" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 });
  }

  if (lesson.type === "QUIZ") {
    return NextResponse.json(
      { error: "Aulas de quiz só podem ser concluídas após aprovação na avaliação." },
      { status: 400 }
    );
  }

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

  if (courseId) {
    await syncCourseCertificate(session.user.id, courseId);
  }

  return NextResponse.json(progress);
}
