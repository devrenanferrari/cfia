"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const { update, data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    async function refresh() {
      if (sessionId) {
        await update();
        setRefreshed(true);
      } else {
        setRefreshed(true);
      }
    }
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = session?.user?.subscriptionStatus === "ACTIVE";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f7f8fa" }}>
      <div className="w-full max-w-md">
        {/* Success card */}
        <div className="bg-white rounded-3xl border p-10 text-center shadow-sm">
          {/* Icon */}
          <div className="relative mx-auto mb-6 h-20 w-20">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#05966920" }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: "#059669" }} />
            </div>
            {/* Confetti dots */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full" style={{ backgroundColor: "#0052ff" }} />
            <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            <span className="absolute top-2 -left-3 h-2 w-2 rounded-full" style={{ backgroundColor: "#059669" }} />
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ color: "#0a0b0d" }}>
            Assinatura ativada!
          </h1>
          <p className="mb-2 font-semibold" style={{ color: "#0052ff" }}>
            Bem-vindo à cfia Premium
          </p>
          <p className="text-sm mb-8" style={{ color: "#5b616e" }}>
            Você agora tem acesso ilimitado a todos os cursos de Inteligência Artificial.
            Aproveite ao máximo sua assinatura!
          </p>

          {/* Benefits */}
          <div className="space-y-2 mb-8 text-left">
            {[
              "Acesso a mais de 50 cursos de IA",
              "Certificados de conclusão ilimitados",
              "Novos cursos adicionados toda semana",
              "Suporte por email prioritário",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2.5 text-sm" style={{ color: "#5b616e" }}>
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#059669" }} />
                {benefit}
              </div>
            ))}
          </div>

          {!refreshed ? (
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: "#5b616e" }}>
              <Loader2 className="h-4 w-4 animate-spin" />
              Ativando sua conta...
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                className="w-full h-12 rounded-[56px] font-bold gap-2"
                style={{ backgroundColor: "#0052ff" }}
                onClick={() => router.push("/cursos")}
              >
                <BookOpen className="h-4 w-4" />
                Explorar cursos
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-[56px] font-semibold gap-2 border-[#e4e7ec]"
                onClick={() => router.push("/dashboard")}
              >
                Ir para meu painel
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6" style={{ color: "#9ca3af" }}>
          Você pode gerenciar sua assinatura a qualquer momento em{" "}
          <Link href="/perfil" className="underline hover:opacity-80" style={{ color: "#5b616e" }}>
            Perfil
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f7f8fa" }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#5b616e" }}>
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#0052ff" }} />
            Confirmando pagamento...
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
