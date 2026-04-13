"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simula envio — em produção integrar com email provider
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border p-8 shadow-sm text-center">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#0052ff15" }}
          >
            <CheckCircle2 className="h-7 w-7" style={{ color: "#0052ff" }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: "#0a0b0d" }}>
            Verifique seu email
          </h1>
          <p className="text-sm mb-6" style={{ color: "#5b616e" }}>
            Se existir uma conta com <strong>{email}</strong>, você receberá instruções para redefinir sua senha em breve.
          </p>
          <Link
            href="/entrar"
            className="text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "#0052ff" }}
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl border p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#0a0b0d" }}>
          Esqueci minha senha
        </h1>
        <p className="text-sm mb-7" style={{ color: "#5b616e" }}>
          Informe seu email e enviaremos instruções para redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#0a0b0d" }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-xl border-[#e4e7ec] bg-[#f7f8fa] focus:bg-white"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-[56px] font-semibold text-sm"
            style={{ backgroundColor: "#0052ff" }}
            disabled={loading || !email}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar instruções"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm mt-5">
        <Link
          href="/entrar"
          className="font-semibold hover:opacity-80 transition-opacity"
          style={{ color: "#0052ff" }}
        >
          ← Voltar para o login
        </Link>
      </p>
    </div>
  );
}
