import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });

  const { courseId } = await req.json();
  if (!courseId) return NextResponse.json({ error: "courseId e obrigatorio" }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { id: courseId, isPublished: true } });
  if (!course) return NextResponse.json({ error: "Curso nao encontrado" }, { status: 404 });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existing) return NextResponse.json({ error: "Ja matriculado neste curso" }, { status: 409 });

  if (!course.isFree) {
    return NextResponse.json(
      { error: "Este curso ainda nao esta com acesso gratuito liberado." },
      { status: 403 }
    );
  }

  const enrollment = await prisma.enrollment.create({
    data: { userId: session.user.id, courseId },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
