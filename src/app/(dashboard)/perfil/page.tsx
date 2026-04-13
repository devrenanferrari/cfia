"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

export default function PerfilPage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabel: Record<string, string> = {
    STUDENT: "Aluno",
    INSTRUCTOR: "Instrutor",
    ADMIN: "Administrador",
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (!res.ok) {
        toast.error("Erro ao salvar perfil.");
        return;
      }
      await update({ name });
      toast.success("Perfil atualizado com sucesso.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) return null;

  const subStatus: Record<string, string> = {
    ACTIVE: "Assinatura ativa",
    INACTIVE: "Sem assinatura",
    TRIALING: "Trial",
    PAST_DUE: "Pagamento atrasado",
    CANCELLED: "Assinatura cancelada",
  };

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar + info */}
      <div className="bg-white border rounded-2xl p-6 flex items-center gap-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={session.user?.image ?? undefined} />
          <AvatarFallback style={{ backgroundColor: "#0052ff15", color: "#0052ff", fontSize: "1.25rem" }}>
            {initials ?? <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-lg">{session.user?.name}</p>
          <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#0052ff15", color: "#0052ff" }}
            >
              {roleLabel[session.user?.role] ?? session.user?.role}
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: session.user?.subscriptionStatus === "ACTIVE" ? "#05966915" : "#6b728015",
                color: session.user?.subscriptionStatus === "ACTIVE" ? "#059669" : "#6b7280",
              }}
            >
              {subStatus[session.user?.subscriptionStatus] ?? "Sem assinatura"}
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold mb-5">Editar informações</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome completo</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={session.user?.email ?? ""}
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
          </div>
          <div className="space-y-1.5">
            <Label>Sobre você</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            className="rounded-[56px] px-8"
            style={{ backgroundColor: "#0052ff" }}
            disabled={loading || !name}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </div>

      {/* Assinatura */}
      {session.user?.subscriptionStatus !== "ACTIVE" && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold mb-2">Assinatura</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Você não possui uma assinatura ativa. Assine para acessar todos os cursos.
          </p>
          <Button
            className="rounded-[56px] px-8"
            style={{ backgroundColor: "#0052ff" }}
            onClick={() => window.location.href = "/assinar"}
          >
            Ver planos
          </Button>
        </div>
      )}

      {/* Gerenciar assinatura */}
      {session.user?.subscriptionStatus === "ACTIVE" && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold mb-2">Assinatura ativa</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Gerencie seu plano, altere a forma de pagamento ou cancele pelo portal do cliente.
          </p>
          <Button
            variant="outline"
            className="rounded-[56px] px-8"
            onClick={async () => {
              const res = await fetch("/api/stripe/portal", { method: "POST" });
              const d = await res.json();
              if (d.url) window.location.href = d.url;
            }}
          >
            Gerenciar assinatura
          </Button>
        </div>
      )}

      {/* Sair */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold mb-2">Sair da conta</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Você será desconectado de todos os dispositivos.
        </p>
        <Button
          variant="outline"
          className="rounded-[56px] px-8 text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
