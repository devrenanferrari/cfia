"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Heart, LogOut, User } from "lucide-react";

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
      if (!res.ok) { toast.error("Erro ao salvar perfil."); return; }
      await update({ name });
      toast.success("Perfil atualizado com sucesso.");
    } catch {
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!session) return null;

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="p-6 md:p-8 bg-white border border-[#e0e0e0] mb-px">
        <h1
          className="text-3xl font-light mb-1"
          style={{ color: "#161616", letterSpacing: "-0.01em" }}
        >
          Meu perfil
        </h1>
        <p
          className="text-xs uppercase"
          style={{ fontFamily: "var(--font-mono)", color: "#8d8d8d", letterSpacing: "0.14em" }}
        >
          Gerencie suas informações
        </p>
      </div>

      {/* Avatar + status */}
      <div className="p-6 bg-white border border-[#e0e0e0] border-t-0 flex items-center gap-5 mb-px">
        <Avatar className="h-16 w-16 flex-shrink-0">
          <AvatarImage src={session.user?.image ?? undefined} />
          <AvatarFallback
            className="text-lg font-semibold"
            style={{ backgroundColor: "#edf5ff", color: "#0f62fe" }}
          >
            {initials ?? <User className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate" style={{ color: "#161616" }}>
            {session.user?.name}
          </p>
          <p className="text-sm truncate mb-3" style={{ color: "#525252" }}>
            {session.user?.email}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}
            >
              {roleLabel[session.user?.role] ?? session.user?.role}
            </span>
            <span
              className="px-2.5 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "#f4f4f4",
                color: "#525252",
              }}
            >
              Projeto gratuito
            </span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form
        onSubmit={handleSave}
        className="p-6 bg-white border border-[#e0e0e0] border-t-0 mb-px"
      >
        <h2 className="font-semibold mb-6" style={{ color: "#161616" }}>
          Informações pessoais
        </h2>

        {/* Carbon bottom-border input */}
        <div className="mb-5">
          <label
            className="block text-xs uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}
          >
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full px-0 py-3 text-sm bg-transparent outline-none transition-colors"
            style={{
              color: "#161616",
              borderBottom: "1px solid #8d8d8d",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderBottom = "2px solid #0f62fe";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottom = "1px solid #8d8d8d";
            }}
          />
        </div>

        <div className="mb-5">
          <label
            className="block text-xs uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}
          >
            Email
          </label>
          <input
            type="email"
            value={session.user?.email ?? ""}
            disabled
            className="w-full px-0 py-3 text-sm bg-transparent outline-none cursor-not-allowed"
            style={{ color: "#8d8d8d", borderBottom: "1px solid #e0e0e0" }}
          />
          <p className="text-xs mt-1" style={{ color: "#8d8d8d" }}>
            O email não pode ser alterado.
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-xs uppercase mb-2"
            style={{ fontFamily: "var(--font-mono)", color: "#525252", letterSpacing: "0.1em" }}
          >
            Sobre você
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            rows={3}
            className="w-full px-0 py-3 text-sm bg-transparent outline-none resize-none transition-colors"
            style={{ color: "#161616", borderBottom: "1px solid #8d8d8d" }}
            onFocus={(e) => { e.currentTarget.style.borderBottom = "2px solid #0f62fe"; }}
            onBlur={(e) => { e.currentTarget.style.borderBottom = "1px solid #8d8d8d"; }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name}
          className="px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0353e9] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#0f62fe" }}
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <div className="p-6 bg-white border border-[#e0e0e0] border-t-0 mb-px">
        <h2 className="font-semibold mb-2" style={{ color: "#161616" }}>Apoie o projeto</h2>
        <p className="text-sm mb-5" style={{ color: "#525252", lineHeight: 1.6 }}>
          Os cursos do CFIA sao gratuitos. Se o projeto te ajudar, voce pode acompanhar novidades
          ou demonstrar interesse em apoiar a manutencao da plataforma.
        </p>
        <a
          href="/apoie"
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-[#0353e9]"
          style={{ backgroundColor: "#0f62fe" }}
        >
          <Heart className="h-4 w-4" />
          Apoiar o projeto
        </a>
      </div>

      {/* Sair */}
      <div className="p-6 bg-white border border-[#e0e0e0] border-t-0">
        <h2 className="font-semibold mb-2" style={{ color: "#161616" }}>Sair da conta</h2>
        <p className="text-sm mb-5" style={{ color: "#525252", lineHeight: 1.6 }}>
          Você será desconectado desta sessão.
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/home" })}
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm transition-colors border hover:bg-[#fff1f1]"
          style={{ color: "#da1e28", borderColor: "#ffd7d9", backgroundColor: "#fff" }}
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
