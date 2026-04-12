import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (session.user.role === "STUDENT") {
    return NextResponse.json({ error: "Apenas instrutores podem criar cursos" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, level, price, isFree, categoryId } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const course = await prisma.course.create({
    data: {
      title: title.trim(),
      slug,
      description: description?.trim() || null,
      level: level ?? "BEGINNER",
      price: isFree ? 0 : (parseFloat(price) || 0),
      isFree: isFree ?? true,
      instructorId: session.user.id,
      categoryId: categoryId || null,
    },
  });

  return NextResponse.json(course, { status: 201 });
}
