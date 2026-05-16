import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { status } = await req.json();
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const conn = await prisma.connection.findUnique({ where: { id } });
  if (!conn) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (conn.toId !== session.user.id) {
    return NextResponse.json({ error: "Proibido" }, { status: 403 });
  }

  const updated = await prisma.connection.update({ where: { id }, data: { status } });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const conn = await prisma.connection.findUnique({ where: { id } });
  if (!conn) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (conn.fromId !== session.user.id && conn.toId !== session.user.id) {
    return NextResponse.json({ error: "Proibido" }, { status: 403 });
  }

  await prisma.connection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
