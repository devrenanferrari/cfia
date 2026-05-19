"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao enviar email.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Suporte ao acesso"
      heading="Recuperar acesso."
      description="Enviaremos um link de redefinição diretamente para o seu email em segundos."
    >
      {sent ? (
        <div className="text-center">
          <div
            className="inline-flex items-center justify-center mb-6"
            style={{
              width: 56,
              height: 56,
              backgroundColor: "#edf5ff",
              border: "1px solid #0f62fe",
            }}
          >
            <CheckCircle2 className="h-6 w-6" style={{ color: "#0f62fe" }} />
          </div>
          <h2
            className="text-xl font-light mb-3"
            style={{ color: "#161616", letterSpacing: 0 }}
          >
            Email enviado!
          </h2>
          <p className="text-sm leading-7 mb-8" style={{ color: "#525252" }}>
            Se existe uma conta associada a{" "}
            <span className="font-medium" style={{ color: "#161616" }}>
              {email}
            </span>
            , você receberá as instruções em breve. Verifique também a caixa de
            spam.
          </p>
          <Link
            href="/entrar"
            className="text-sm font-medium hover:underline transition-colors"
            style={{ color: "#0f62fe" }}
          >
            ← Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h1
              className="text-2xl font-light mb-2"
              style={{ color: "#161616", letterSpacing: 0 }}
            >
              Redefinir senha
            </h1>
            <p className="text-sm" style={{ color: "#525252" }}>
              Informe seu email e enviaremos o link de acesso.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-[0.16em]"
                style={{ color: "#525252" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-12 px-4"
                style={{ color: "#161616" }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#da1e28" }}>
                {error}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full h-14 flex items-center justify-between px-6 font-semibold text-sm disabled:opacity-60"
                style={{
                  backgroundColor: "#0f62fe",
                  color: "#ffffff",
                  border: "none",
                  cursor: loading || !email ? "not-allowed" : "pointer",
                  letterSpacing: "0.01em",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!loading && email)
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "#0353e9";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#0f62fe";
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <>
                    <span>Enviar instruções</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: "#e0e0e0" }}>
            <Link
              href="/entrar"
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: "#0f62fe" }}
            >
              ← Voltar para o login
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
