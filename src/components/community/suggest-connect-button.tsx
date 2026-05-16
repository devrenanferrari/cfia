"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserPlus, Check, Loader2 } from "lucide-react";

export function SuggestConnectButtonClient({ toId }: { toId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function connect() {
    if (!session) { router.push("/entrar"); return; }
    setStatus("loading");
    const res = await fetch("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toId }),
    });
    setStatus(res.ok || res.status === 409 ? "done" : "idle");
  }

  if (status === "done") {
    return (
      <span className="text-[10px] font-semibold flex items-center gap-0.5" style={{ color: "#24a148" }}>
        <Check className="h-3 w-3" /> Enviado
      </span>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={status === "loading"}
      className="text-[10px] font-semibold flex items-center gap-1 px-2 h-6 border transition-colors hover:border-[#0f62fe] hover:text-[#0f62fe] disabled:opacity-50"
      style={{ borderColor: "#e0e0e0", color: "#525252" }}
    >
      {status === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : <><UserPlus className="h-3 w-3" /> Conectar</>}
    </button>
  );
}
