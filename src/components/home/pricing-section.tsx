"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Zap, ArrowRight, Star, Shield } from "lucide-react";

const FEATURES = [
  "Acesso ilimitado a todos os cursos",
  "Novos cursos adicionados toda semana",
  "Certificados de conclusão ilimitados",
  "Projetos práticos com feedback",
  "Comunidade exclusiva de alunos",
  "Suporte por email prioritário",
  "Download para assistir offline",
  "Acesso vitalício ao conteúdo adquirido",
];

export function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubscribe(plan: "MONTHLY" | "ANNUAL") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        router.push(`/entrar?callbackUrl=/assinar`);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }

  const isAnnual = billing === "annual";

  return (
    <section className="py-28 px-4 bg-white">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: "#0052ff10", color: "#0052ff" }}
          >
            Planos
          </span>
          <h2 className="text-4xl font-black mb-4" style={{ color: "#06070a", letterSpacing: "-0.03em" }}>
            Um preço simples, acesso total
          </h2>
          <p className="text-muted-foreground mb-8">
            Sem taxa de adesão. Cancele quando quiser.
          </p>

          {/* Toggle */}
          <div
            className="inline-flex items-center p-1 rounded-full"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="relative px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  billing === b
                    ? { backgroundColor: "white", color: "#0a0b0d", boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }
                    : { color: "#6b7280" }
                }
              >
                {b === "monthly" ? "Mensal" : "Anual"}
                {b === "annual" && (
                  <span
                    className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: "#05966920", color: "#059669" }}
                  >
                    -33%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start max-w-3xl mx-auto">
          {/* Free card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-8"
            style={{ border: "2px solid #f0f0f0" }}
          >
            <p className="text-xs font-bold tracking-widest text-muted-foreground mb-4">GRATUITO</p>
            <div className="mb-1">
              <span className="text-5xl font-black" style={{ color: "#0a0b0d" }}>R$0</span>
            </div>
            <p className="text-sm text-muted-foreground mb-7">Para sempre, sem cartão de crédito</p>
            <ul className="space-y-3 mb-8">
              {[
                "Acesso a cursos gratuitos",
                "Certificados de cursos grátis",
                "Comunidade de alunos",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#4b5563" }}>
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
              {["Cursos pagos bloqueados", "Sem suporte prioritário"].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground/50">
                  <span className="h-4 w-4 shrink-0 flex items-center justify-center text-muted-foreground/30 font-bold">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-3.5 rounded-xl font-semibold text-sm border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
              onClick={() => router.push("/cadastro")}
            >
              Criar conta grátis
            </button>
          </motion.div>

          {/* Premium card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl p-8 relative"
            style={{
              background: "linear-gradient(145deg, #0047e1 0%, #0052ff 60%, #1a6bff 100%)",
              boxShadow: "0 20px 60px rgba(0,82,255,0.35), 0 4px 14px rgba(0,82,255,0.2)",
            }}
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                <Star className="h-3 w-3 fill-current" />
                MAIS POPULAR
              </span>
            </div>

            {/* Background decoration */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-bold tracking-widest text-white/60">PREMIUM</p>
                <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="mb-1">
                {isAnnual ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white">R$66</span>
                      <span className="text-white/60 text-lg">,66/mês</span>
                    </div>
                    <p className="text-sm text-white/50 mt-0.5">
                      Cobrado anualmente — R$799,90/ano
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-black text-white">R$99</span>
                    <span className="text-white/60 text-lg">,90/mês</span>
                  </>
                )}
              </div>
              <p className="text-sm text-white/50 mb-7">Cancele quando quiser</p>

              <ul className="space-y-3 mb-8">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 text-white/60 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-4 rounded-xl font-bold text-sm bg-white hover:bg-white/90 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                style={{ color: "#0052ff", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
                onClick={() => handleSubscribe(isAnnual ? "ANNUAL" : "MONTHLY")}
                disabled={loading}
              >
                {loading ? "Redirecionando..." : (
                  <>
                    {isAnnual ? "Assinar anualmente" : "Assinar mensalmente"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-white/40">
                <Shield className="h-3 w-3" />
                Pagamento seguro via Stripe
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
