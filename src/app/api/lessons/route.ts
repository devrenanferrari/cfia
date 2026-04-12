import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { title, moduleId, type, order } = await req.json();
  if (!title || !moduleId) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { course: { select: { instructorId: true } } },
  });

  if (!module || (module.course.instructorId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      moduleId,
      type: type ?? "VIDEO",
      order: order ?? 1,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
