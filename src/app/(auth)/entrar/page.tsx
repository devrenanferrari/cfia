"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

function getRedirectByRole(role?: string) {
  if (role === "ADMIN") return "/admin";
  if (role === "INSTRUCTOR") return "/instrutor";
  return "/dashboard";
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const explicitCallback = searchParams.get("callbackUrl");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Email ou senha incorretos.");
        return;
      }
      if (res?.ok) {
        if (explicitCallback) {
          router.push(explicitCallback);
          return;
        }
        const session = await getSession();
        router.push(getRedirectByRole(session?.user?.role));
      }
    } catch {
      toast.error("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-10">
        <h1
          className="text-2xl font-light mb-2"
          style={{ color: "#161616", letterSpacing: 0 }}
        >
          Entre na sua conta
        </h1>
        <p className="text-sm" style={{ color: "#525252" }}>
          Continue de onde parou. Todo seu progresso está aqui.
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#525252" }}
            >
              Senha
            </label>
            <Link
              href="/esqueci-senha"
              className="text-xs transition-colors hover:underline"
              style={{ color: "#0f62fe" }}
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full h-14 flex items-center justify-between px-6 font-semibold text-sm disabled:opacity-60"
            style={{
              backgroundColor: "#0f62fe",
              color: "#ffffff",
              border: "none",
              cursor: loading || !email || !password ? "not-allowed" : "pointer",
              letterSpacing: "0.01em",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading && email && password)
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
                <span>Entrar na plataforma</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t" style={{ borderColor: "#e0e0e0" }}>
        <p className="text-sm" style={{ color: "#525252" }}>
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium hover:underline transition-colors"
            style={{ color: "#0f62fe" }}
          >
            Criar conta <ArrowRight className="h-3 w-3 inline ml-0.5" />
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Acesso seguro"
      heading="Bem-vindo de volta."
      description="Retome de onde parou. Seu progresso e certificados estão salvos."
      features={[
        "Certificados de conclusão verificáveis",
        "Progresso salvo automaticamente",
        "Projeto de extensão universitária · Cursos gratuitos",
      ]}
    >
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center">
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: "#0f62fe" }}
            />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
