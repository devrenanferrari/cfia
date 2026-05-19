"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm mb-6" style={{ color: "#da1e28" }}>
          Link inválido ou expirado. Solicite um novo link de redefinição.
        </p>
        <Link
          href="/esqueci-senha"
          className="text-sm font-medium hover:underline"
          style={{ color: "#0f62fe" }}
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao redefinir senha.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/entrar"), 3000);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center mb-6"
          style={{
            width: 56,
            height: 56,
            backgroundColor: "#defbe6",
            border: "1px solid #198038",
          }}
        >
          <CheckCircle2 className="h-6 w-6" style={{ color: "#198038" }} />
        </div>
        <h2 className="text-xl font-light mb-3" style={{ color: "#161616" }}>
          Senha redefinida!
        </h2>
        <p className="text-sm leading-7 mb-6" style={{ color: "#525252" }}>
          Sua senha foi atualizada com sucesso. Redirecionando para o login…
        </p>
        <Link
          href="/entrar"
          className="text-sm font-medium hover:underline"
          style={{ color: "#0f62fe" }}
        >
          Ir para o login agora →
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl font-light mb-2" style={{ color: "#161616" }}>
          Nova senha
        </h1>
        <p className="text-sm" style={{ color: "#525252" }}>
          Escolha uma nova senha segura para sua conta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#525252" }}
          >
            Nova senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full h-12 px-4 pr-12"
              style={{ color: "#161616" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              style={{ color: "#8d8d8d", background: "transparent", border: "none" }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirm"
            className="block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#525252" }}
          >
            Confirmar senha
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            placeholder="Repita a nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
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
            disabled={loading || !password || !confirm}
            className="w-full h-14 flex items-center justify-between px-6 font-semibold text-sm disabled:opacity-60"
            style={{
              backgroundColor: "#0f62fe",
              color: "#ffffff",
              border: "none",
              cursor: loading || !password || !confirm ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading && password && confirm)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0353e9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0f62fe";
            }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              <>
                <span>Redefinir senha</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t" style={{ borderColor: "#e0e0e0" }}>
        <Link
          href="/entrar"
          className="text-sm font-medium hover:underline"
          style={{ color: "#0f62fe" }}
        >
          ← Voltar para o login
        </Link>
      </div>
    </>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <AuthShell
      eyebrow="Segurança da conta"
      heading="Redefinir senha."
      description="Crie uma nova senha segura para recuperar o acesso à sua conta."
    >
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
