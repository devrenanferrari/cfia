import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";

export const runtime = "nodejs";

const STATUS_MAP: Record<string, SubscriptionStatus> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELLED",
  unpaid: "PAST_DUE",
  paused: "PAST_DUE",
  incomplete: "PAST_DUE",
  incomplete_expired: "CANCELLED",
};

function getSubPeriodEnd(sub: Stripe.Subscription): Date | null {
  // In Stripe API 2026+, current_period_end lives on the SubscriptionItem
  const item = sub.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Assinatura inválida:", err);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const cs = event.data.object as Stripe.Checkout.Session;
        if (cs.mode !== "subscription") break;
        const userId = cs.metadata?.userId;
        const plan = cs.metadata?.plan as "MONTHLY" | "ANNUAL" | undefined;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionId: cs.subscription as string,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionPlan: plan ?? "MONTHLY",
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe API 2026+, subscription is accessed via invoice.parent.subscription_details
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId, { expand: ["items"] });
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: SubscriptionStatus.ACTIVE,
            subscriptionEndsAt: getSubPeriodEnd(sub),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: STATUS_MAP[sub.status] ?? SubscriptionStatus.INACTIVE,
            subscriptionEndsAt: getSubPeriodEnd(sub),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: SubscriptionStatus.CANCELLED,
            subscriptionId: null,
            subscriptionPlan: null,
            subscriptionEndsAt: null,
          },
        });
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] Erro ao processar evento:", event.type, err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
