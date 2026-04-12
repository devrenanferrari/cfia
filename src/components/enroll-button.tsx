"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isFree: boolean;
  isLoggedIn: boolean;
}

export function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  isFree,
  isLoggedIn,
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

  if (isEnrolled) {
    return (
      <Button className="w-full" asChild>
        <a href={`/dashboard/cursos/${courseSlug}`}>Continuar aprendendo</a>
      </Button>
    );
  }

  return (
    <Button className="w-full" onClick={handleEnroll} disabled={loading}>
      {loading ? "Processando..." : isFree ? "Matricular-se grátis" : "Comprar curso"}
    </Button>
  );
}
