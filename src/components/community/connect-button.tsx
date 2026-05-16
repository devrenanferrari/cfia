"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Check, Loader2 } from "lucide-react";

export function ConnectButtonClient({ toId }: { toId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");

  async function connect() {
    setStatus("loading");
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId }),
      });
      if (res.status === 409) {
        toast.info("Pedido de conexão já enviado");
        setStatus("sent");
        return;
      }
      if (!res.ok) {
        toast.error("Erro ao enviar pedido");
        setStatus("idle");
        return;
      }
      toast.success("Pedido de conexão enviado!");
      setStatus("sent");
    } catch {
      toast.error("Erro ao conectar");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="w-full h-9 flex items-center justify-center gap-2 text-xs font-semibold border"
        style={{ borderColor: "#24a148", color: "#24a148" }}
      >
        <Check className="h-3.5 w-3.5" /> Pedido enviado
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={status === "loading"}
      className="w-full h-9 flex items-center justify-center gap-2 text-xs font-semibold border transition-colors hover:border-[#0f62fe] hover:text-[#0f62fe] disabled:opacity-50"
      style={{ borderColor: "#e0e0e0", color: "#525252" }}
    >
      {status === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <><UserPlus className="h-3.5 w-3.5" /> Conectar</>
      )}
    </button>
  );
}
