import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, level, price, isFree, isPublished, categoryId, thumbnail, duration } = body;

  const updated = await prisma.course.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(level !== undefined && { level }),
      ...(price !== undefined && { price }),
      ...(isFree !== undefined && { isFree }),
      ...(isPublished !== undefined && { isPublished }),
      ...(categoryId !== undefined && { categoryId }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(duration !== undefined && { duration }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course) return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
  if (course.instructorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
