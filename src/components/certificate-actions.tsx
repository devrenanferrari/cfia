"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, ExternalLink, Link2, Loader2, Share2 } from "lucide-react";
import Link from "next/link";

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
  const [downloading, setDownloading] = useState(false);

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

  async function downloadPDF() {
    const element = document.getElementById("certificate");
    if (!element) {
      toast.error("Elemento do certificado não encontrado.");
      return;
    }

    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgHeight = pageWidth * imgRatio;

      if (imgHeight <= pageHeight) {
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", 0, yOffset, pageWidth, imgHeight);
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      }

      pdf.save(`certificado-cfia-${code}.pdf`);
      toast.success("Certificado baixado com sucesso.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid #c6c6c6",
    backgroundColor: "#ffffff",
    color: "#161616",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "background-color 0.15s ease",
    borderRadius: 0,
    outline: "none",
  };

  return (
    <div
      className="print:hidden"
      style={{ border: "1px solid #e0e0e0", backgroundColor: "#f4f4f4" }}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#0f62fe" }}
          >
            Certificado verificável
          </p>
          <p className="mt-1 text-sm" style={{ color: "#525252" }}>
            Código:{" "}
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                color: "#161616",
                letterSpacing: "0.06em",
              }}
            >
              {code.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {showDashboardLink && (
            <Link
              href="/dashboard/certificados"
              style={btnBase}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
            >
              Voltar
            </Link>
          )}

          <button
            onClick={downloadPDF}
            disabled={downloading}
            style={{
              ...btnBase,
              backgroundColor: "#0f62fe",
              color: "#ffffff",
              border: "none",
              opacity: downloading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!downloading)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0353e9";
            }}
            onMouseLeave={(e) => {
              if (!downloading)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0f62fe";
            }}
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Gerando PDF…" : "Baixar PDF"}
          </button>

          <button
            onClick={copyLink}
            style={btnBase}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <Link2 className="h-4 w-4" />
            Copiar link
          </button>

          <button
            onClick={shareLink}
            style={btnBase}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>

          <Link
            href={publicPath}
            style={btnBase}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e8e8e8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <ExternalLink className="h-4 w-4" />
            Link público
          </Link>
        </div>
      </div>
    </div>
  );
}
