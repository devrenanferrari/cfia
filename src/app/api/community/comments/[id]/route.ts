import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const comment = await prisma.postComment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (comment.authorId !== session.user.id) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });

  const updated = await prisma.postComment.update({
    where: { id },
    data: { body: body.trim() },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const comment = await prisma.postComment.findUnique({ where: { id } });
  if (!comment) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Proibido" }, { status: 403 });
  }

  await prisma.postComment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
