"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { Mail, FlaskConical } from "lucide-react";
import { useRouter } from "next/navigation";

const TEST_USERS = [
  { label: "Aluno", email: "aluno@cfia.com.br" },
  { label: "Instrutor", email: "instrutor@cfia.com.br" },
  { label: "Admin", email: "admin@cfia.com.br" },
];

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const router = useRouter();

  async function handleDevLogin(testEmail: string) {
    setLoading(true);
    const res = await signIn("dev-login", {
      email: testEmail,
      callbackUrl,
      redirect: false,
    });
    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      toast.error("Erro no login de teste");
      setLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("email", {
        email,
        callbackUrl,
        redirect: false,
      });
      if (res?.error) throw new Error("Erro ao enviar email");
      setSent(true);
      toast.success("Email enviado! Verifique sua caixa de entrada.");
    } catch {
      toast.error("Não foi possível enviar o email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verifique seu email</CardTitle>
          <CardDescription>
            Enviamos um link de acesso para <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>Clique no link no email para entrar. O link expira em 24 horas.</p>
          <Button variant="ghost" className="mt-4" onClick={() => setSent(false)}>
            Tentar outro email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Bem-vindo de volta</CardTitle>
        <CardDescription>Entre na sua conta cfia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">ou</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !email}>
            {loading ? "Enviando..." : "Entrar com email"}
          </Button>
        </form>


        {/* Logins de teste — apenas em desenvolvimento */}
        <div className="rounded-lg border border-dashed border-yellow-400 bg-yellow-50 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-yellow-700 mb-2">
            <FlaskConical className="h-3.5 w-3.5" />
            Logins de teste (dev)
          </p>
          <div className="flex gap-2 flex-wrap">
            {TEST_USERS.map((u) => (
              <Button
                key={u.email}
                type="button"
                size="sm"
                variant="outline"
                className="text-xs border-yellow-400 text-yellow-800 hover:bg-yellow-100"
                onClick={() => handleDevLogin(u.email)}
                disabled={loading}
              >
                {u.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-primary font-medium ml-1 hover:underline">
          Cadastre-se grátis
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md">
        <CardContent className="py-12 text-center text-muted-foreground">Carregando...</CardContent>
      </Card>
    }>
      <LoginForm />
    </Suspense>
  );
}
