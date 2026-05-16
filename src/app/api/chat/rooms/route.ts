import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const rooms = await prisma.chatRoom.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { author: { select: { id: true, name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rooms);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { toId } = await req.json();
  if (!toId || toId === session.user.id) {
    return NextResponse.json({ error: "Usuário inválido" }, { status: 400 });
  }

  // Find existing DM room between these two users
  const existing = await prisma.chatRoom.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId: session.user.id } } },
        { members: { some: { userId: toId } } },
      ],
    },
  });

  if (existing) return NextResponse.json(existing);

  const room = await prisma.chatRoom.create({
    data: {
      isGroup: false,
      members: {
        create: [{ userId: session.user.id }, { userId: toId }],
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  return NextResponse.json(room, { status: 201 });
}
