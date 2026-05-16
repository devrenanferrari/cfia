import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { body, parentId } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Comentário vazio" }, { status: 400 });

  const comment = await prisma.postComment.create({
    data: {
      body: body.trim(),
      authorId: session.user.id,
      postId: id,
      parentId: parentId ?? null,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      votes: { select: { value: true, userId: true } },
    },
  });

  await awardXP(session.user.id, 5);

  return NextResponse.json(comment, { status: 201 });
}

async function awardXP(userId: string, amount: number) {
  const xpRecord = await prisma.userXP.upsert({
    where: { userId },
    update: { xp: { increment: amount } },
    create: { userId, xp: amount, level: 1 },
  });
  const newLevel = Math.floor(xpRecord.xp / 100) + 1;
  if (newLevel !== xpRecord.level) {
    await prisma.userXP.update({ where: { userId }, data: { level: newLevel } });
  }
}
