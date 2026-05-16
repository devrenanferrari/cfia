"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isFree: boolean;
  isLoggedIn: boolean;
  isSubscribed: boolean;
}

export function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  isFree,
  isLoggedIn,
  isSubscribed,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEnroll() {
    if (!isLoggedIn) {
      router.push(`/entrar?callbackUrl=/cursos/${courseSlug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao matricular");
      }

      toast.success("Matricula realizada com sucesso.");
      router.push(`/dashboard/cursos/${courseSlug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao matricular");
    } finally {
      setLoading(false);
    }
  }

  if (isEnrolled) {
    return (
      <Button className="h-12 w-full rounded-[56px] text-sm font-semibold" style={{ backgroundColor: "#0052ff" }} asChild>
        <a href={`/dashboard/cursos/${courseSlug}`}>Continuar aprendendo</a>
      </Button>
    );
  }

  if (!isFree && !isSubscribed) {
    return (
      <div className="space-y-3">
        <Button className="h-12 w-full gap-2 rounded-[56px] text-sm font-bold" style={{ backgroundColor: "#0052ff" }} asChild>
          <Link href="/apoie">
            <Mail className="h-4 w-4" />
            Entrar na lista de interesse
          </Link>
        </Button>
        <p className="text-center text-xs" style={{ color: "#5b616e" }}>
          Este curso ainda nao esta com acesso gratuito liberado.
        </p>
      </div>
    );
  }

  return (
    <Button
      className="h-12 w-full rounded-[56px] text-sm font-semibold"
      style={{ backgroundColor: "#0052ff" }}
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFree ? (
        "Matricular-se gratis"
      ) : (
        "Comecar agora"
      )}
    </Button>
  );
}
