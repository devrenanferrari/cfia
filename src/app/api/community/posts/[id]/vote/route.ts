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

  const existing = await prisma.postVote.findUnique({
    where: { userId_postId: { userId: session.user.id, postId: id } },
  });

  if (existing?.value === value) {
    await prisma.postVote.delete({
      where: { userId_postId: { userId: session.user.id, postId: id } },
    });
    return NextResponse.json({ ok: true, action: "removed" });
  }

  await prisma.postVote.upsert({
    where: { userId_postId: { userId: session.user.id, postId: id } },
    update: { value },
    create: { userId: session.user.id, postId: id, value },
  });

  return NextResponse.json({ ok: true, action: "voted" });
}
