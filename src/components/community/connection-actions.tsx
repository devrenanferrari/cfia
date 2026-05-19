"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2, UserMinus } from "lucide-react";

export function ConnectionActions({
  connectionId,
  type,
}: {
  connectionId: string;
  type: "accepted" | "received" | "sent";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function accept() {
    setLoading("accept");
    const res = await fetch(`/api/connections/${connectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED" }),
    });
    if (res.ok) { toast.success("Conexão aceita!"); router.refresh(); }
    else toast.error("Erro ao aceitar");
    setLoading(null);
  }

  async function reject() {
    setLoading("reject");
    const res = await fetch(`/api/connections/${connectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });
    if (res.ok) { toast.success("Pedido recusado"); router.refresh(); }
    else toast.error("Erro ao recusar");
    setLoading(null);
  }

  async function remove() {
    if (!confirm("Remover esta conexão?")) return;
    setLoading("remove");
    const res = await fetch(`/api/connections/${connectionId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Conexão removida"); router.refresh(); }
    else toast.error("Erro ao remover");
    setLoading(null);
  }

  if (type === "received") {
    return (
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={accept} disabled={!!loading}
          className="flex items-center gap-1 text-xs font-bold px-3 h-7 transition-colors hover:bg-[#0353e9] disabled:opacity-50"
          style={{ backgroundColor: "#0f62fe", color: "#fff" }}>
          {loading === "accept" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Check className="h-3 w-3" /> Aceitar</>}
        </button>
        <button onClick={reject} disabled={!!loading}
          className="flex items-center gap-1 text-xs font-bold px-3 h-7 border transition-colors hover:bg-[#fff1f1] disabled:opacity-50"
          style={{ borderColor: "#da1e28", color: "#da1e28" }}>
          {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><X className="h-3 w-3" /> Recusar</>}
        </button>
      </div>
    );
  }

  return (
    <button onClick={remove} disabled={!!loading}
      className="flex items-center gap-1 text-xs font-semibold px-3 h-7 border transition-colors hover:bg-[#fff1f1] hover:border-[#da1e28] hover:text-[#da1e28] disabled:opacity-50 shrink-0"
      style={{ borderColor: "#e0e0e0", color: "#8d8d8d" }}>
      {loading === "remove" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><UserMinus className="h-3 w-3" /> {type === "sent" ? "Cancelar" : "Remover"}</>}
    </button>
  );
}
