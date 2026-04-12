import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: { include: { course: { select: { instructorId: true } } } } },
  });

  if (!lesson) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (lesson.module.course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, content, videoUrl, duration, isFree, type, order } = body;

  const updated = await prisma.lesson.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(duration !== undefined && { duration }),
      ...(isFree !== undefined && { isFree }),
      ...(type !== undefined && { type }),
      ...(order !== undefined && { order }),
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
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: { include: { course: { select: { instructorId: true } } } } },
  });

  if (!lesson) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (lesson.module.course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
