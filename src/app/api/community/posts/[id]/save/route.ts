import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const existing = await prisma.savedPost.findUnique({
    where: { userId_postId: { userId: session.user.id, postId: id } },
  });

  if (existing) {
    await prisma.savedPost.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedPost.create({ data: { userId: session.user.id, postId: id } });
  return NextResponse.json({ saved: true });
}
