import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { title, courseId, order } = await req.json();
  if (!title || !courseId) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || (course.instructorId !== session.user.id && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const module = await prisma.module.create({
    data: { title, courseId, order: order ?? 1 },
  });

  return NextResponse.json(module, { status: 201 });
}
