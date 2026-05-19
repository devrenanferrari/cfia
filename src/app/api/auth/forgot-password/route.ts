import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { passwordResetEmail } from "@/lib/email-templates";
import { BASE_URL } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email obrigatório." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return 200 to prevent user enumeration
    if (!user || !user.name) {
      return NextResponse.json({ ok: true });
    }

    // Delete any existing token for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    const resetUrl = `${BASE_URL}/redefinir-senha?token=${token}`;
    const { subject, html } = passwordResetEmail(user.name, resetUrl);

    await sendMail({ to: email, subject, html });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
