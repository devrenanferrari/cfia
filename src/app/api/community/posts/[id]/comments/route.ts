import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comments = await prisma.postComment.findMany({
    where: { postId: id, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      votes: { select: { value: true, userId: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          votes: { select: { value: true, userId: true } },
        },
      },
    },
  });
  return NextResponse.json(
    comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      replies: c.replies.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    }))
  );
}

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

  // Notificar o autor do post se for outra pessoa
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true, title: true } });
  if (post && post.authorId !== session.user.id) {
    await notify(
      post.authorId,
      "POST_COMMENT",
      `${session.user.name ?? "Alguém"} comentou no seu post "${post.title.slice(0, 40)}${post.title.length > 40 ? "…" : ""}"`,
      `/comunidade/${id}`
    );
  }

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
