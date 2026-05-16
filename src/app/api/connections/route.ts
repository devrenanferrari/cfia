import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const connections = await prisma.connection.findMany({
    where: {
      OR: [{ fromId: session.user.id }, { toId: session.user.id }],
    },
    include: {
      from: { select: { id: true, name: true, image: true } },
      to: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(connections);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { toId } = await req.json();
  if (!toId || toId === session.user.id) {
    return NextResponse.json({ error: "Usuário inválido" }, { status: 400 });
  }

  const existing = await prisma.connection.findFirst({
    where: {
      OR: [
        { fromId: session.user.id, toId },
        { fromId: toId, toId: session.user.id },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Conexão já existe" }, { status: 409 });
  }

  const connection = await prisma.connection.create({
    data: { fromId: session.user.id, toId, status: "PENDING" },
    include: {
      from: { select: { id: true, name: true, image: true } },
      to: { select: { id: true, name: true, image: true } },
    },
  });

  await notify(
    toId,
    "CONNECTION_REQUEST",
    `${session.user.name ?? "Alguém"} quer se conectar com você`,
    "/comunidade"
  );

  return NextResponse.json(connection, { status: 201 });
}
