import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  if (user.role === "INSTRUCTOR") {
    return NextResponse.json({ error: "Você já é instrutor." }, { status: 409 });
  }


  if (user.instructorStatus === "PENDING") {
    return NextResponse.json({ error: "Candidatura já enviada. Aguarde a análise." }, { status: 409 });
  }

  const { bio, linkedin, expertise, courseIdea, name } = await req.json();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: name || user.name,
  
      instructorStatus: "PENDING",
      instructorBio: `${bio}\n\nEspecialização: ${expertise}\nIdeia de curso: ${courseIdea}`,
      instructorLinkedin: linkedin || null,
    },
  });

  return NextResponse.json({ ok: true });
}
