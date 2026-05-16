"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Check, Loader2 } from "lucide-react";

type ConnStatus = "none" | "pending" | "accepted";

export function ConnectButtonClient({
  toId,
  initialStatus = "none",
}: {
  toId: string;
  initialStatus?: ConnStatus;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "connected">(() => {
    if (initialStatus === "accepted") return "connected";
    if (initialStatus === "pending") return "sent";
    return "idle";
  });

  async function connect() {
    setStatus("loading");
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId }),
      });
      if (res.status === 409) { setStatus("sent"); return; }
      if (!res.ok) { toast.error("Erro ao enviar pedido"); setStatus("idle"); return; }
      toast.success("Pedido de conexão enviado!");
      setStatus("sent");
    } catch {
      toast.error("Erro ao conectar");
      setStatus("idle");
    }
  }

  if (status === "connected") {
    return (
      <div
        className="h-9 flex items-center justify-center gap-2 px-4 text-xs font-semibold border"
        style={{ borderColor: "#24a148", color: "#24a148" }}
      >
        <Check className="h-3.5 w-3.5" /> Conectado
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div
        className="h-9 flex items-center justify-center gap-2 px-4 text-xs font-semibold border"
        style={{ borderColor: "#c6c6c6", color: "#8d8d8d" }}
      >
        <Check className="h-3.5 w-3.5" /> Solicitado
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={status === "loading"}
      className="h-9 flex items-center justify-center gap-2 px-4 text-xs font-semibold border transition-colors hover:border-[#0f62fe] hover:text-[#0f62fe] disabled:opacity-50"
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
