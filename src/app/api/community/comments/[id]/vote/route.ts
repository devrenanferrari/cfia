import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { value } = await req.json();
  if (value !== 1 && value !== -1) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  }

  const existing = await prisma.commentVote.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId: id } },
  });

  if (existing?.value === value) {
    await prisma.commentVote.delete({
      where: { userId_commentId: { userId: session.user.id, commentId: id } },
    });
    return NextResponse.json({ ok: true, action: "removed" });
  }

  await prisma.commentVote.upsert({
    where: { userId_commentId: { userId: session.user.id, commentId: id } },
    update: { value },
    create: { userId: session.user.id, commentId: id, value },
  });

  return NextResponse.json({ ok: true, action: "voted" });
}
