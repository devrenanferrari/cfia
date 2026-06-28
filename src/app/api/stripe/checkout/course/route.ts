import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { courseId } = await req.json() as { courseId: string };
  if (!courseId) {
    return NextResponse.json({ error: "courseId é obrigatório." }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
    select: { id: true, title: true, slug: true, price: true, isFree: true, thumbnail: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });
  }

  if (course.isFree || course.price === 0) {
    return NextResponse.json({ error: "Este curso é gratuito — use a matrícula direta." }, { status: 400 });
  }

  const existingPurchase = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId } },
  });
  if (existingPurchase) {
    return NextResponse.json({ error: "Você já adquiriu este curso." }, { status: 409 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const amountInCents = Math.round(course.price * 100);
  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: course.title,
            ...(course.thumbnail ? { images: [course.thumbnail] } : {}),
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    metadata: { userId: user.id, courseId },
    success_url: `${origin}/compra/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cursos/${course.slug}`,
    locale: "pt-BR",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
