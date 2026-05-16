"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao criar conta.");
        return;
      }
      toast.success("Conta criada! Faça login para continuar.");
      router.push("/entrar");
    } catch {
      toast.error("Erro ao processar sua requisição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;

  const strengthColors = [
    "#e0e0e0",
    "var(--cds-support-error)",
    "var(--cds-support-warning)",
    "var(--cds-support-success)",
  ];
  const strengthLabels = ["", "Vulnerável", "Razoável", "Segura"];

  const canSubmit = !loading && !!name && !!email && !!password && !!confirm;

  return (
    <AuthShell
      eyebrow="Nova conta"
      heading="Comece a aprender."
      description="Crie sua conta e acesse cursos livres e gratuitos em programação e inteligência artificial."
      features={[
        "Cursos livres e gratuitos",
        "Certificado de conclusão verificável",
        "Conteúdo criado com cuidado por quem está aprendendo",
      ]}
    >
      <div className="mb-8">
        <h1
          className="text-2xl font-light mb-2"
          style={{ color: "#161616", letterSpacing: 0 }}
        >
          Crie sua conta
        </h1>
        <p className="text-sm" style={{ color: "#525252" }}>
          Preencha os dados abaixo para começar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#525252" }}
          >
            Nome Completo
          </label>
          <input
            id="name"
            placeholder="Ex: Alan Turing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full h-12 px-4"
            style={{ color: "#161616" }}
          />
        </div>

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

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#525252" }}
          >
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full h-12 px-4 pr-12"
              style={{ color: "#161616" }}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center transition-colors hover:bg-[#f4f4f4]"
              style={{
                color: "#8d8d8d",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {password.length > 0 && (
            <div className="pt-1">
              <div className="flex gap-1 mb-1.5" style={{ height: 3 }}>
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className="flex-1 transition-colors duration-300"
                    style={{
                      backgroundColor:
                        strength >= level
                          ? strengthColors[strength]
                          : "#e0e0e0",
                    }}
                  />
                ))}
              </div>
              <p
                className="text-[11px] uppercase tracking-[0.24em]"
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  color: strengthColors[strength],
                }}
              >
                {strengthLabels[strength]}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirm"
            className="block text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "#525252" }}
          >
            Confirmar Senha
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            placeholder="Repita a senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full h-12 px-4"
            style={{ color: "#161616" }}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-14 flex items-center justify-between px-6 font-semibold text-sm disabled:opacity-60"
            style={{
              backgroundColor: "#0f62fe",
              color: "#ffffff",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              letterSpacing: "0.01em",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (canSubmit)
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
                <span>Criar conta</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t" style={{ borderColor: "#e0e0e0" }}>
        <p className="text-sm" style={{ color: "#525252" }}>
          Já tem uma conta?{" "}
          <Link
            href="/entrar"
            className="font-medium hover:underline transition-colors"
            style={{ color: "#0f62fe" }}
          >
            Fazer login <ArrowRight className="h-3 w-3 inline ml-0.5" />
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
