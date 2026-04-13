import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { name, bio } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      bio: bio?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
