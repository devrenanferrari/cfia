"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";

type Notification = {
  id: string;
  type: string;
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d atrás`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function NotificationBell() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setNotifications(data); })
      .catch(() => {});
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`private-user-${session.user.id}`);
    channel.bind("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev].slice(0, 30));
    });
    return () => {
      channel.unbind("notification");
      pusher.unsubscribe(`private-user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function markRead(ids?: string[]) {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: ids ?? [] }),
    }).catch(() => {});
    setNotifications((prev) =>
      prev.map((n) => (ids ? (ids.includes(n.id) ? { ...n, read: true } : n) : { ...n, read: true }))
    );
  }

  async function handleNotificationClick(n: Notification) {
    if (!n.read) await markRead([n.id]);
    setOpen(false);
    if (n.link) router.push(n.link);
  }

  if (!session) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-12 w-10 items-center justify-center transition-colors hover:text-white"
        style={{ color: "#8d8d8d", backgroundColor: "transparent" }}
        aria-label="Notificações"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span
            className="absolute top-2 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
            style={{ backgroundColor: "#da1e28" }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-80 max-w-[calc(100vw-1rem)] rounded border shadow-lg z-50"
          style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#e0e0e0" }}>
            <span className="text-sm font-semibold" style={{ color: "#161616" }}>Notificações</span>
            {unread > 0 && (
              <button
                onClick={() => markRead()}
                className="text-xs font-medium hover:underline"
                style={{ color: "#0f62fe" }}
              >
                Marcar tudo como lido
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm" style={{ color: "#8d8d8d" }}>
                Nenhuma notificação
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-[#f4f4f4] flex items-start gap-3"
                  style={{ borderColor: "#f4f4f4", backgroundColor: n.read ? "transparent" : "#edf5ff" }}
                >
                  {!n.read && (
                    <span
                      className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: "#0f62fe" }}
                    />
                  )}
                  <div style={{ marginLeft: n.read ? "1rem" : undefined }}>
                    <p className="text-sm leading-snug" style={{ color: "#161616" }}>{n.message}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#8d8d8d" }}>{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
