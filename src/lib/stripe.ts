import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const PLANS = {
  MONTHLY: {
    label: "Mensal",
    price: 9990, // centavos (R$99,90)
    interval: "month" as const,
    description: "Acesso a todos os cursos por 1 mês",
  },
  ANNUAL: {
    label: "Anual",
    price: 79990, // centavos (R$799,90)
    interval: "year" as const,
    description: "Acesso a todos os cursos por 1 ano — economize 33%",
  },
} as const;
