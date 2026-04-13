"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

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
        body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao criar conta.");
        return;
      }
      toast.success("Conta criada! Faça login para iniciar sua sessão.");
      router.push("/entrar");
    } catch {
      toast.error("Erro ao processar sua requisição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  // Carbon colors for strength: Weak (Error), Medium (Warning), Strong (Success)
  const strengthColors = ["var(--cds-layer-02)", "var(--cds-support-error)", "var(--cds-support-warning)", "var(--cds-support-success)"];
  const strengthLabels = ["", "Vulnerável", "Razoável", "Segura"];

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: "var(--cds-layer-01)" }}
    >
      {/* Left panel - Branding/Info */}
      <div
        className="hidden md:flex flex-col justify-between p-12 w-1/3 min-w-[400px] border-r"
        style={{ borderColor: "var(--cds-border-subtle)", backgroundColor: "var(--cds-text-primary)" }}
      >
        <Link href="/" className="inline-block text-2xl font-semibold mb-12" style={{ color: "#ffffff" }}>
          CFIA
        </Link>
        <div>
          <h2 className="text-4xl font-light mb-6 leading-tight" style={{ color: "#ffffff", letterSpacing: "0" }}>
            Conhecimento avançado, acessível para você.
          </h2>
          <p className="text-base" style={{ color: "var(--cds-text-secondary)", lineHeight: "1.6" }}>
            Acesso a centenas de horas de aulas teóricas e práticas. Torne-se um especialista com a plataforma oficial de IA do Brasil.
          </p>
        </div>
        <div className="pt-12 text-sm" style={{ color: "var(--cds-text-helper)" }}>
          © {new Date().getFullYear()} CFIA. Todos os direitos reservados.
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 md:p-24 bg-white relative">
        <div className="md:hidden absolute top-6 flex w-full left-6">
          <Link href="/" className="font-semibold text-lg" style={{ color: "var(--cds-text-primary)" }}>
            CFIA
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto md:mx-0 pt-16 md:pt-0">
          <div className="mb-10">
            <h1 className="text-[32px] font-light mb-2 leading-tight" style={{ color: "var(--cds-text-primary)", letterSpacing: "0" }}>
              Credenciamento
            </h1>
            <p className="text-sm" style={{ color: "var(--cds-text-secondary)" }}>
              Preencha o formulário abaixo para registrar-se no sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
                Nome Completo
              </label>
              <input
                id="name"
                placeholder="Ex: Alan Turing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-12 px-4 transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--cds-field)",
                  borderBottom: "1px solid var(--cds-border-strong)",
                  color: "var(--cds-text-primary)"
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
                Endereço de Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--cds-field)",
                  borderBottom: "1px solid var(--cds-border-strong)",
                  color: "var(--cds-text-primary)"
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Selecione uma senha segura"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              {/* Carbon Password Strength indicator */}
              {password.length > 0 && (
                <div className="pt-2">
                  <div className="flex gap-1 h-1.5 mb-2">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className="flex-1 transition-colors duration-300"
                        style={{
                          backgroundColor:
                            passwordStrength >= level
                              ? strengthColors[passwordStrength]
                              : "var(--cds-layer-02)",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs font-mono tracking-widest uppercase transition-colors"
                    style={{ color: strengthColors[passwordStrength] }}
                  >
                    Status: {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm" className="text-xs font-semibold" style={{ color: "var(--cds-text-secondary)" }}>
                Confirmação de Senha
              </label>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="Repita sua senha"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full h-12 px-4 transition-colors focus:outline-none"
                style={{
                  backgroundColor: "var(--cds-field)",
                  borderBottom: "1px solid var(--cds-border-strong)",
                  color: "var(--cds-text-primary)"
                }}
              />
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-14 rounded-none font-semibold text-base flex justify-between px-6 transition-colors"
                style={{
                  backgroundColor: "var(--cds-interactive)",
                  color: "#ffffff"
                }}
                disabled={loading || !name || !email || !password || !confirm}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <>
                    <span>Confirmar Cadastro</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t" style={{ borderColor: "var(--cds-border-subtle)" }}>
            <p className="text-sm" style={{ color: "var(--cds-text-secondary)" }}>
              Já possui conta?{" "}
              <Link
                href="/entrar"
                className="font-medium hover:underline transition-colors mt-2 block"
                style={{ color: "var(--cds-interactive)" }}
              >
                Faça Login <ArrowRight className="h-3 w-3 inline ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
