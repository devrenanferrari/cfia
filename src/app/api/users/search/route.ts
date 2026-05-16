import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user.id },
      name: { contains: q, mode: "insensitive" },
    },
    take: 10,
    select: { id: true, name: true, role: true, image: true },
  });

  if (users.length === 0) return NextResponse.json([]);

  const userIds = users.map((u) => u.id);
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { fromId: session.user.id, toId: { in: userIds } },
        { fromId: { in: userIds }, toId: session.user.id },
      ],
    },
    select: { fromId: true, toId: true, status: true },
  });

  const connMap = new Map<string, "pending" | "accepted">();
  for (const c of connections) {
    const otherId = c.fromId === session.user.id ? c.toId : c.fromId;
    connMap.set(otherId, c.status === "ACCEPTED" ? "accepted" : "pending");
  }

  const result = users.map((u) => ({
    ...u,
    connectionStatus: connMap.get(u.id) ?? "none",
  }));

  return NextResponse.json(result);
}
