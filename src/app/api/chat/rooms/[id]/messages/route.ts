import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const member = await prisma.chatMember.findUnique({
    where: { roomId_userId: { roomId: id, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const messages = await prisma.chatMessage.findMany({
    where: { roomId: id },
    orderBy: { createdAt: "asc" },
    take: 50,
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const member = await prisma.chatMember.findUnique({
    where: { roomId_userId: { roomId: id, userId: session.user.id } },
  });
  if (!member) return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const { body } = await req.json();
  if (!body?.trim()) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });

  const message = await prisma.chatMessage.create({
    data: { body: body.trim(), roomId: id, authorId: session.user.id },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  await pusherServer.trigger(`private-room-${id}`, "new-message", message);

  return NextResponse.json(message, { status: 201 });
}
