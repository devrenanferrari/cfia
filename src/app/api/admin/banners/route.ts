import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const banners = await prisma.banner.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { title, subtitle, ctaText, ctaUrl, imageUrl, bgColor, textColor, isActive, position } = body;

  if (!title) return NextResponse.json({ error: "Título é obrigatório." }, { status: 400 });

  const banner = await prisma.banner.create({
    data: {
      title,
      subtitle: subtitle || null,
      ctaText: ctaText || null,
      ctaUrl: ctaUrl || "/cursos",
      imageUrl: imageUrl || null,
      bgColor: bgColor || "#edf5ff",
      textColor: textColor || "#161616",
      isActive: isActive ?? true,
      position: position ?? 0,
    },
  });

  return NextResponse.json(banner, { status: 201 });
}
