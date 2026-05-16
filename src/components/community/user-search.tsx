"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, Check, Loader2, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";

type ConnStatus = "none" | "pending" | "accepted";

type UserResult = {
  id: string;
  name: string | null;
  role: string;
  connectionStatus: ConnStatus;
};

function UserRow({ user }: { user: UserResult }) {
  const router = useRouter();
  const [connStatus, setConnStatus] = useState<ConnStatus>(user.connectionStatus);
  const [connLoading, setConnLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  async function connect() {
    setConnLoading(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId: user.id }),
      });
      if (res.ok) {
        setConnStatus("pending");
        toast.success(`Pedido enviado para ${user.name?.split(" ")[0]}`);
      } else if (res.status === 409) {
        setConnStatus("pending");
      } else {
        toast.error("Não foi possível enviar o pedido");
      }
    } finally {
      setConnLoading(false);
    }
  }

  async function openChat() {
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId: user.id }),
      });
      if (!res.ok) { toast.error("Erro ao abrir chat"); return; }
      const room = await res.json();
      router.push(`/comunidade/chat/${room.id}`);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0" style={{ borderColor: "#f4f4f4" }}>
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{ backgroundColor: "#edf5ff", color: "#0f62fe" }}
      >
        {user.name?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "#161616" }}>{user.name ?? "Usuário"}</p>
        <p className="text-[11px]" style={{ color: "#8d8d8d" }}>
          {user.role === "INSTRUCTOR" ? "Instrutor" : "Estudante"}
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={openChat}
          disabled={chatLoading}
          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 h-7 border transition-colors hover:border-[#0f62fe] hover:text-[#0f62fe] disabled:opacity-50"
          style={{ borderColor: "#e0e0e0", color: "#525252" }}
          title="Enviar mensagem"
        >
          {chatLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
        </button>

        {connStatus === "accepted" ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 h-7" style={{ color: "#24a148" }}>
            <Check className="h-3 w-3" /> Conectado
          </span>
        ) : connStatus === "pending" ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 h-7" style={{ color: "#8d8d8d" }}>
            <Check className="h-3 w-3" /> Solicitado
          </span>
        ) : (
          <button
            onClick={connect}
            disabled={connLoading}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 h-7 border transition-colors disabled:opacity-50"
            style={{ borderColor: "#0f62fe", color: "#0f62fe" }}
          >
            {connLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><UserPlus className="h-3 w-3" /> Conectar</>}
          </button>
        )}
      </div>
    </div>
  );
}

export function UserSearchBox() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  if (!session) return null;

  return (
    <div className="bg-white border border-[#e0e0e0]">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "#e0e0e0" }}>
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" style={{ color: "#8d8d8d" }} />
        ) : (
          <Search className="h-3.5 w-3.5 shrink-0" style={{ color: "#8d8d8d" }} />
        )}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar pessoas..."
          className="flex-1 text-xs bg-transparent focus:outline-none"
          style={{ color: "#161616" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setSearched(false); }}>
            <X className="h-3.5 w-3.5" style={{ color: "#8d8d8d" }} />
          </button>
        )}
      </div>

      {searched && (
        <div className="px-3">
          {results.length === 0 ? (
            <p className="py-4 text-xs text-center" style={{ color: "#8d8d8d" }}>
              Nenhum usuário encontrado
            </p>
          ) : (
            results.map((u) => <UserRow key={u.id} user={u} />)
          )}
        </div>
      )}
    </div>
  );
}
