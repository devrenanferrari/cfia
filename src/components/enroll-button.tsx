"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  isFree: boolean;
  price: number;
  isLoggedIn: boolean;
}

function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function EnrollButton({
  courseId,
  courseSlug,
  isEnrolled,
  isFree,
  price,
  isLoggedIn,
}: EnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleFreeEnroll() {
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

      toast.success("Matrícula realizada com sucesso.");
      router.push(`/dashboard/cursos/${courseSlug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao matricular");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuy() {
    if (!isLoggedIn) {
      router.push(`/entrar?callbackUrl=/cursos/${courseSlug}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao iniciar pagamento");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar pagamento");
      setLoading(false);
    }
  }

  if (isEnrolled) {
    return (
      <Button
        className="h-12 w-full text-sm font-semibold"
        style={{ backgroundColor: "#0f62fe", color: "#ffffff", borderRadius: 0 }}
        asChild
      >
        <a href={`/dashboard/cursos/${courseSlug}`}>Continuar aprendendo</a>
      </Button>
    );
  }

  if (isFree || price === 0) {
    return (
      <Button
        className="h-12 w-full text-sm font-semibold"
        style={{ backgroundColor: "#0f62fe", color: "#ffffff", borderRadius: 0 }}
        onClick={handleFreeEnroll}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Matricular-se grátis"}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        className="h-12 w-full gap-2 text-sm font-bold"
        style={{ backgroundColor: "#0f62fe", color: "#ffffff", borderRadius: 0 }}
        onClick={handleBuy}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            Comprar — {formatPrice(price)}
          </>
        )}
      </Button>
      <p className="text-center text-xs" style={{ color: "#525252" }}>
        Acesso vitalício · Certificado incluso
      </p>
    </div>
  );
}
