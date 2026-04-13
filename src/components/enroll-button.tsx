"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";

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

      toast.success("Matrícula realizada com sucesso!");
      router.push(`/dashboard/cursos/${courseSlug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao matricular");
    } finally {
      setLoading(false);
    }
  }

  // Already enrolled
  if (isEnrolled) {
    return (
      <Button
        className="w-full h-12 rounded-[56px] font-semibold text-sm"
        style={{ backgroundColor: "#0052ff" }}
        asChild
      >
        <a href={`/dashboard/cursos/${courseSlug}`}>Continuar aprendendo</a>
      </Button>
    );
  }

  // Paid course — not subscribed
  if (!isFree && !isSubscribed) {
    return (
      <div className="space-y-3">
        <Button
          className="w-full h-12 rounded-[56px] font-bold text-sm gap-2"
          style={{ backgroundColor: "#0052ff" }}
          asChild
        >
          <Link href={isLoggedIn ? "/assinar" : `/entrar?callbackUrl=/assinar`}>
            <Lock className="h-4 w-4" />
            Assinar para acessar
          </Link>
        </Button>
        <p className="text-center text-xs" style={{ color: "#5b616e" }}>
          A partir de R$99,90/mês · Cancele quando quiser
        </p>
      </div>
    );
  }

  // Free course OR subscribed user — can enroll
  return (
    <Button
      className="w-full h-12 rounded-[56px] font-semibold text-sm"
      style={{ backgroundColor: "#0052ff" }}
      onClick={handleEnroll}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFree ? (
        "Matricular-se grátis"
      ) : (
        "Começar agora"
      )}
    </Button>
  );
}
