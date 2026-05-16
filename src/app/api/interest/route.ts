import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const source = String(body.source ?? "site").trim();
    const message = String(body.message ?? "").trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um email valido." }, { status: 400 });
    }

    await prisma.interestLead.upsert({
      where: { email },
      create: {
        email,
        name: name || null,
        source: source || "site",
        message: message || null,
      },
      update: {
        name: name || undefined,
        source: source || undefined,
        message: message || undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[interest]", error);
    return NextResponse.json({ error: "Nao foi possivel salvar seu email." }, { status: 500 });
  }
}
