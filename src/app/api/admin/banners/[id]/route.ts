import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const banner = await prisma.banner.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle || null }),
      ...(body.ctaText !== undefined && { ctaText: body.ctaText || null }),
      ...(body.ctaUrl !== undefined && { ctaUrl: body.ctaUrl }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
      ...(body.bgColor !== undefined && { bgColor: body.bgColor }),
      ...(body.textColor !== undefined && { textColor: body.textColor }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.position !== undefined && { position: body.position }),
    },
  });

  return NextResponse.json(banner);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
