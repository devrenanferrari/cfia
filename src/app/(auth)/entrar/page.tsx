"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

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
    <div className="w-full max-w-[480px]">
      <div className="mb-12">
        <h1 className="text-4xl font-light mb-4" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
          Acesso à plataforma
        </h1>
        <p className="text-base" style={{ color: "var(--cds-text-secondary)" }}>
          Entre com suas credenciais para continuar recebendo conhecimento avançado na CFIA.
        </p>
      </div>

      <div 
        className="bg-white p-8 md:p-10 border" 
        style={{ borderColor: "var(--cds-border-subtle)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
              Endereço de Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full h-12 px-4 transition-colors focus:outline-none"
              style={{ 
                backgroundColor: "var(--cds-field)", 
                borderBottom: "1px solid var(--cds-border-strong)",
                color: "var(--cds-text-primary)"
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
                Senha de Acesso
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-12 px-4 pr-12 transition-colors focus:outline-none"
                style={{ 
                  backgroundColor: "var(--cds-field)", 
                  borderBottom: "1px solid var(--cds-border-strong)",
                  color: "var(--cds-text-primary)"
                }}
              />
              <button
                type="button"
                className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center transition-colors hover:bg-[var(--cds-layer-02)]"
                style={{ color: "var(--cds-text-secondary)" }}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="pt-2">
              <Link
                href="/esqueci-senha"
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "var(--cds-interactive)" }}
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 rounded-none font-semibold text-base flex justify-between px-6 transition-colors"
              style={{
                backgroundColor: "var(--cds-interactive)",
                color: "#ffffff"
              }}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                <>
                  <span>Entrar no sistema</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--cds-border-subtle)" }}>
          <p className="text-sm" style={{ color: "var(--cds-text-secondary)" }}>
            Ainda não possui credenciais ativas?{" "}
            <Link
              href="/cadastro"
              className="font-medium hover:underline transition-colors block mt-2"
              style={{ color: "var(--cds-interactive)" }}
            >
              Criar uma nova conta <ArrowRight className="h-3 w-3 inline ml-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--cds-layer-01)" }}
    >
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl" style={{ color: "var(--cds-text-primary)" }}>
          <span className="tracking-tight leading-none" style={{ letterSpacing: "0" }}>CFIA</span>
        </Link>
      </div>
      
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center w-full max-w-[480px]">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--cds-interactive)" }} />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
