import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const tag = searchParams.get("tag");
  const limit = 20;

  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    where: tag ? { tags: { has: tag } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, votes: true } },
      votes: { select: { value: true, userId: true } },
    },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, limit) : posts;

  return NextResponse.json({
    posts: items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { title, body, type, tags } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      body: body?.trim() || null,
      type: type ?? "TEXT",
      tags: Array.isArray(tags) ? tags : [],
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true, votes: true } },
      votes: true,
    },
  });

  await awardXP(session.user.id, 10);

  return NextResponse.json(post, { status: 201 });
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
