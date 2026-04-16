"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Download, ExternalLink, Link2, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CertificateActionsProps {
  code: string;
  publicPath: string;
  showDashboardLink?: boolean;
}

export function CertificateActions({
  code,
  publicPath,
  showDashboardLink = false,
}: CertificateActionsProps) {
  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") return publicPath;
    return `${window.location.origin}${publicPath}`;
  }, [publicPath]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Link do certificado copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  async function shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Certificado CFIA",
          text: "Veja meu certificado de conclusão.",
          url: publicUrl,
        });
        return;
      } catch {
        return;
      }
    }

    await copyLink();
  }

  function printCertificate() {
    window.print();
  }

  return (
    <div className="print:hidden rounded-[24px] border bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0052ff]">Certificado verificável</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Código: <span className="font-mono text-foreground">{code.toUpperCase()}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {showDashboardLink && (
            <Button variant="outline" asChild>
              <Link href="/dashboard/certificados">Voltar</Link>
            </Button>
          )}
          <Button variant="outline" onClick={printCertificate}>
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
          <Button variant="outline" onClick={copyLink}>
            <Link2 className="mr-2 h-4 w-4" />
            Copiar link
          </Button>
          <Button variant="outline" onClick={shareLink}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button variant="outline" asChild>
            <Link href={publicPath}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Link público
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
