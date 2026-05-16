"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  subscriptionStatus: string;
  createdAt: string;
  _count: { enrollments: number; courses: number };
};

const SUB_LABELS: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  TRIALING: "Trial",
  PAST_DUE: "Atrasado",
  CANCELLED: "Cancelado",
};

const SUB_COLORS: Record<string, string> = {
  ACTIVE: "#059669",
  INACTIVE: "#6b7280",
  TRIALING: "#0891b2",
  PAST_DUE: "#d97706",
  CANCELLED: "#dc2626",
};

export default function AdminAlunosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?role=STUDENT&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">{total.toLocaleString("pt-BR")} alunos cadastrados</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#f7f8fa" }}>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Nome</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Apoio</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Matrículas</th>
              <th className="text-left px-6 py-4 font-semibold text-muted-foreground">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">Carregando...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">Nenhum aluno encontrado.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.name ?? "—"}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${SUB_COLORS[u.subscriptionStatus] ?? "#6b7280"}15`,
                        color: SUB_COLORS[u.subscriptionStatus] ?? "#6b7280",
                      }}
                    >
                      {SUB_LABELS[u.subscriptionStatus] ?? u.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u._count.enrollments}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Página {page} de {Math.ceil(total / 20)}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="px-3 py-1.5 text-sm rounded-lg border hover:bg-gray-50 disabled:opacity-40"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 20)}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
