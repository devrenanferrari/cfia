"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const PLAN_FEATURES = [
  "Acesso ilimitado a todos os cursos",
  "Novos cursos toda semana",
  "Certificados de conclusão",
  "Suporte por email prioritário",
  "Comunidade exclusiva de alunos",
  "Downloads para assistir offline",
];

export default function AssinarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<"MONTHLY" | "ANNUAL" | null>(null);

  const isActive = session?.user?.subscriptionStatus === "ACTIVE";

  async function handleSubscribe(plan: "MONTHLY" | "ANNUAL") {
    if (status === "unauthenticated") {
      router.push("/entrar?callbackUrl=/assinar");
      return;
    }

    setLoading(plan);
    try {
      if (isActive) {
        const res = await fetch("/api/stripe/portal", { method: "POST" });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao iniciar pagamento.");
        return;
      }
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error("Erro. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-white py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "#0052ff15", color: "#0052ff" }}
          >
            <Zap className="h-3.5 w-3.5" />
            Planos de assinatura
          </span>
          <h1
            className="font-bold mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: "1.08" }}
          >
            Um preço simples,
            <br />acesso total
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Sem cursos avulsos. Assine e acesse todo o catálogo de IA sem limites.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-4" style={{ backgroundColor: "#f7f8fa" }}>
        <div className="mx-auto max-w-3xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mensal */}
            <div className="bg-white rounded-3xl border-2 p-8 flex flex-col">
              <div>
                <p className="text-xs font-bold tracking-widest text-muted-foreground mb-4">MENSAL</p>
                <div className="mb-1">
                  <span className="text-5xl font-bold">R$99</span>
                  <span className="text-muted-foreground text-lg">,90</span>
                </div>
                <p className="text-sm text-muted-foreground mb-8">por mês, cancele quando quiser</p>
                <ul className="space-y-3 mb-8">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="mt-auto w-full py-4 rounded-[56px] font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
                style={{ borderColor: "#0052ff", color: "#0052ff" }}
                onClick={() => handleSubscribe("MONTHLY")}
                disabled={loading !== null}
              >
                {loading === "MONTHLY" ? "Redirecionando..." : isActive ? "Gerenciar assinatura" : "Assinar mensalmente"}
              </button>
            </div>

            {/* Anual */}
            <div className="rounded-3xl p-8 flex flex-col relative" style={{ backgroundColor: "#0052ff" }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-green-400 text-green-950 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  MAIS POPULAR — ECONOMIZE 33%
                </span>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-white/60 mb-4">ANUAL</p>
                <div className="mb-1">
                  <span className="text-5xl font-bold text-white">R$799</span>
                  <span className="text-white/70 text-lg">,90</span>
                </div>
                <p className="text-sm text-white/60 mb-1">por ano — R$66,66/mês</p>
                <p className="text-xs text-white/50 mb-8">economize R$399,90 em relação ao plano mensal</p>
                <ul className="space-y-3 mb-8">
                  {PLAN_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                      <CheckCircle2 className="h-4 w-4 text-white/80 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className="mt-auto w-full py-4 rounded-[56px] font-semibold text-sm bg-white transition-colors hover:bg-white/90"
                style={{ color: "#0052ff" }}
                onClick={() => handleSubscribe("ANNUAL")}
                disabled={loading !== null}
              >
                {loading === "ANNUAL" ? "Redirecionando..." : isActive ? "Gerenciar assinatura" : "Assinar anualmente"}
              </button>
            </div>
          </div>

          {/* Trust */}
          <div className="text-center mt-10 space-y-2">
            <p className="text-sm text-muted-foreground">
              Pagamento seguro via Stripe. Cancele a qualquer momento, sem burocracia.
            </p>
            {!session && (
              <p className="text-sm text-muted-foreground">
                Já assina?{" "}
                <Link href="/entrar" style={{ color: "#0052ff" }} className="font-semibold hover:underline">
                  Entre na sua conta
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ simplificado */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-10">Perguntas frequentes</h2>
          <div className="space-y-6">
            {[
              { q: "Posso cancelar a qualquer momento?", a: "Sim. Você pode cancelar quando quiser pelo portal do cliente Stripe. Seu acesso continua até o fim do período pago." },
              { q: "O plano dá acesso a todos os cursos?", a: "Sim. Um único plano dá acesso ilimitado a todo o catálogo de cursos, incluindo os que forem adicionados durante sua assinatura." },
              { q: "Posso mudar de plano mensal para anual?", a: "Sim. Acesse o portal do cliente para ajustar seu plano. O valor é calculado proporcionalmente." },
              { q: "Quais formas de pagamento são aceitas?", a: "Aceitamos todos os cartões de crédito principais (Visa, Mastercard, Amex). O pagamento é processado com segurança pelo Stripe." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b pb-6 last:border-0">
                <h3 className="font-semibold mb-2">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center" style={{ backgroundColor: "#0052ff" }}>
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para começar?</h2>
          <p className="text-white/80 mb-8">Junte-se a milhares de profissionais aprendendo IA com o cfia.</p>
          <button
            className="px-10 py-4 rounded-[56px] font-semibold text-sm bg-white hover:bg-white/90 transition-colors inline-flex items-center gap-2"
            style={{ color: "#0052ff" }}
            onClick={() => handleSubscribe("ANNUAL")}
            disabled={loading !== null}
          >
            Assinar agora
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
