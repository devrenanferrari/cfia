import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const instructorStatus = searchParams.get("instructorStatus");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 20;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (instructorStatus) where.instructorStatus = instructorStatus;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
    
        instructorStatus: true,
        instructorBio: true,
        instructorLinkedin: true,
        createdAt: true,
        _count: { select: { enrollments: true, courses: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { userId, action } = await req.json();
  if (!userId || !action) {
    return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
  }

  if (action === "approve_instructor") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "INSTRUCTOR",
    
        instructorStatus: "APPROVED",
      },
    });
  } else if (action === "reject_instructor") {
    await prisma.user.update({
      where: { id: userId },
      data: {
    
        instructorStatus: "REJECTED",
      },
    });
  } else if (action === "remove_instructor") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "STUDENT",
    
        instructorStatus: "NONE",
      },
    });
  } else {
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
