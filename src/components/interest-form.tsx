"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InterestFormProps {
  source: string;
  cta?: string;
  placeholder?: string;
  compact?: boolean;
}

export function InterestForm({
  source,
  cta = "Quero ser avisado",
  placeholder = "Seu email",
  compact = false,
}: InterestFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Nao foi possivel salvar seu email.");
        return;
      }

      setEmail("");
      toast.success("Pronto. Vou te avisar quando houver novidades.");
    } catch {
      toast.error("Nao foi possivel salvar seu email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "flex flex-col sm:flex-row gap-2" : "flex flex-col sm:flex-row gap-3"}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 flex-1 px-4 text-sm"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #8d8d8d",
          color: "#161616",
        }}
      />
      <button
        type="submit"
        disabled={loading}
        className="min-h-12 inline-flex items-center justify-center gap-2 px-5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        style={{ backgroundColor: "#0f62fe" }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : cta}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
