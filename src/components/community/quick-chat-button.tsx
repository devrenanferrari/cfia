"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";

export function QuickChatButton({ toId }: { toId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function openChat() {
    if (!session) { router.push("/entrar"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toId }),
      });
      if (!res.ok) return;
      const room = await res.json();
      router.push(`/comunidade/chat/${room.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={openChat}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 h-7 border transition-colors hover:bg-[#0f62fe] hover:text-white hover:border-[#0f62fe] disabled:opacity-50"
      style={{ borderColor: "#e0e0e0", color: "#525252" }}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <><MessageSquare className="h-3 w-3" /> Mensagem</>}
    </button>
  );
}
