"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getPusherClient } from "@/lib/pusher-client";
import { Send, Loader2 } from "lucide-react";

type Author = { id: string; name: string | null; image: string | null };

interface Message {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
  authorId: string;
}

interface ChatWindowProps {
  roomId: string;
  otherUser: { id: string; name: string | null };
}

function timeLabel(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatWindow({ roomId, otherUser }: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/chat/rooms/${roomId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roomId]);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`private-room-${roomId}`);
    channel.bind("new-message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => {
      pusher.unsubscribe(`private-room-${roomId}`);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });
      if (!res.ok) { toast.error("Erro ao enviar mensagem"); return; }
      setBody("");
    } catch {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#0f62fe" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border border-[#e0e0e0] bg-white">
      <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#f4f4f4]">
        <p className="text-sm font-semibold" style={{ color: "#161616" }}>
          {otherUser.name ?? "Usuário"}
        </p>
        <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "#8d8d8d" }}>
          Conversa privada
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-center pt-8" style={{ color: "#8d8d8d" }}>
            Nenhuma mensagem ainda. Diga olá!
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.authorId === session?.user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] px-4 py-2.5"
                style={{
                  backgroundColor: isMine ? "#0f62fe" : "#f4f4f4",
                  color: isMine ? "#ffffff" : "#161616",
                }}
              >
                {!isMine && (
                  <p className="text-[10px] font-semibold mb-1 uppercase tracking-widest" style={{ color: "#8d8d8d" }}>
                    {msg.author.name}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.body}</p>
                <p
                  className="text-[10px] mt-1 text-right"
                  style={{ color: isMine ? "rgba(255,255,255,0.6)" : "#8d8d8d" }}
                >
                  {timeLabel(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#e0e0e0] flex">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Escreva uma mensagem..."
          className="flex-1 h-12 px-4 text-sm focus:outline-none"
          style={{ color: "#161616", border: "none" }}
        />
        <button
          onClick={send}
          disabled={sending || !body.trim()}
          className="h-12 px-5 flex items-center justify-center transition-colors disabled:opacity-40"
          style={{ backgroundColor: "#0f62fe", color: "#ffffff" }}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
