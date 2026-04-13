"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, ExternalLink, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  instructorStatus: string;
  instructorBio: string | null;
  instructorLinkedin: string | null;
  createdAt: string;
};

export default function AdminInstrutoresPage() {
  const [tab, setTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  async function load(status: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/users?instructorStatus=${status}`);
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }

  useEffect(() => { load(tab); }, [tab]);

  async function action(userId: string, act: string) {
    setActing(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: act }),
    });
    if (res.ok) {
      toast.success("Ação realizada com sucesso.");
      load(tab);
    } else {
      toast.error("Erro ao realizar ação.");
    }
    setActing(null);
  }

  const tabs = [
    { key: "PENDING" as const, label: "Pendentes", icon: Clock },
    { key: "APPROVED" as const, label: "Aprovados", icon: CheckCircle2 },
    { key: "REJECTED" as const, label: "Rejeitados", icon: XCircle },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Instrutores</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie candidaturas e instrutores ativos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === key
                ? "text-white"
                : "bg-white border text-muted-foreground hover:text-foreground"
            }`}
            style={tab === key ? { backgroundColor: "#0052ff" } : {}}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm py-10 text-center">Carregando...</div>
      ) : users.length === 0 ? (
        <div className="text-muted-foreground text-sm py-10 text-center bg-white rounded-2xl border">
          Nenhum registro nesta categoria.
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl border p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{u.name ?? "Sem nome"}</h3>
                    {u.instructorLinkedin && (
                      <a
                        href={u.instructorLinkedin.startsWith("http") ? u.instructorLinkedin : `https://${u.instructorLinkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 text-[#0052ff] hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{u.email}</p>
                  {u.instructorBio && (
                    <p className="text-sm leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">{u.instructorBio}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Candidatura em {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {tab === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="rounded-[56px] gap-1.5 font-semibold"
                        style={{ backgroundColor: "#059669" }}
                        onClick={() => action(u.id, "approve_instructor")}
                        disabled={acting === u.id}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-[56px] gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => action(u.id, "reject_instructor")}
                        disabled={acting === u.id}
                      >
                        <UserX className="h-3.5 w-3.5" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  {tab === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-[56px] gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => action(u.id, "remove_instructor")}
                      disabled={acting === u.id}
                    >
                      <UserX className="h-3.5 w-3.5" />
                      Remover
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
