"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
