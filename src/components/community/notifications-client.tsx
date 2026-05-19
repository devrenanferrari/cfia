"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Bell, Check, Trash2, UserPlus, MessageSquare, Heart, Zap } from "lucide-react";

type NotifType = "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "POST_COMMENT" | "POST_LIKE" | "NEW_MESSAGE";

interface Notif {
  id: string;
  type: NotifType;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

function NotifIcon({ type }: { type: NotifType }) {
  const props = { className: "h-4 w-4 shrink-0" };
  if (type === "CONNECTION_REQUEST" || type === "CONNECTION_ACCEPTED") return <UserPlus {...props} style={{ color: "#0f62fe" }} />;
  if (type === "POST_COMMENT") return <MessageSquare {...props} style={{ color: "#0f62fe" }} />;
  if (type === "POST_LIKE") return <Heart {...props} style={{ color: "#da1e28" }} />;
  return <Zap {...props} style={{ color: "#f1c21b" }} />;
}

export function NotificationsClient({ initialNotifications }: { initialNotifications: Notif[] }) {
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifications);
  const unread = notifs.filter((n) => !n.read).length;

  async function markAllRead() {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    toast.success("Todas marcadas como lidas");
  }

  async function markRead(id: string) {
    await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [id] }) });
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifs((p) => p.filter((n) => n.id !== id));
  }

  if (notifs.length === 0) {
    return (
      <div className="bg-white border border-[#e0e0e0] p-12 text-center">
        <Bell className="h-10 w-10 mx-auto mb-3" style={{ color: "#c6c6c6" }} />
        <p className="text-base font-bold mb-1" style={{ color: "#161616" }}>Tudo em dia!</p>
        <p className="text-sm" style={{ color: "#8d8d8d" }}>Nenhuma notificação por enquanto.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        {unread > 0 && (
          <span className="text-xs font-mono px-2.5 py-1" style={{ backgroundColor: "#edf5ff", color: "#0043ce" }}>
            {unread} não lida{unread !== 1 ? "s" : ""}
          </span>
        )}
        {unread > 0 && (
          <button onClick={markAllRead} className="ml-auto flex items-center gap-1.5 text-xs font-bold hover:underline" style={{ color: "#0f62fe" }}>
            <Check className="h-3.5 w-3.5" /> Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {notifs.map((n) => {
          const inner = (
            <div
              key={n.id}
              className="flex items-start gap-3 px-4 py-3 border border-[#e0e0e0] transition-colors hover:bg-[#f4f4f4] group"
              style={{ backgroundColor: n.read ? "#fff" : "#edf5ff", borderLeft: n.read ? "3px solid transparent" : "3px solid #0f62fe" }}
            >
              <div className="mt-0.5"><NotifIcon type={n.type} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug" style={{ color: n.read ? "#525252" : "#161616", fontWeight: n.read ? 400 : 500 }}>
                  {n.message}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "#a8a8a8" }}>{timeAgo(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.read && (
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead(n.id); }}
                    className="p-1.5 hover:bg-[#e0e0e0] transition-colors rounded" title="Marcar como lida">
                    <Check className="h-3.5 w-3.5" style={{ color: "#0f62fe" }} />
                  </button>
                )}
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss(n.id); }}
                  className="p-1.5 hover:bg-[#e0e0e0] transition-colors rounded" title="Dispensar">
                  <Trash2 className="h-3.5 w-3.5" style={{ color: "#8d8d8d" }} />
                </button>
              </div>
            </div>
          );

          return n.link ? (
            <Link key={n.id} href={n.link} onClick={() => !n.read && markRead(n.id)}>{inner}</Link>
          ) : (
            <div key={n.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
