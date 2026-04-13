import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { plan } = await req.json() as { plan: "MONTHLY" | "ANNUAL" };
  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  // Garante que o cliente existe no Stripe
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

  const planConfig = PLANS[plan];
  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `cfia — Plano ${planConfig.label}`,
            description: planConfig.description,
          },
          unit_amount: planConfig.price,
          recurring: { interval: planConfig.interval },
        },
        quantity: 1,
      },
    ],
    metadata: { userId: user.id, plan },
    subscription_data: { metadata: { userId: user.id, plan } },
    success_url: `${origin}/assinar/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/assinar`,
    locale: "pt-BR",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
