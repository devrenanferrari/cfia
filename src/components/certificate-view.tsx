"use client";

import { useEffect, useRef, useState } from "react";
import { Award, ShieldCheck } from "lucide-react";
import { CertificateActions } from "@/components/certificate-actions";
import {
  formatCourseDuration,
  getCourseDurationMinutes,
  toCamelCase,
} from "@/lib/certificates";

interface CertificateViewProps {
  certificate: {
    code: string;
    issuedAt: Date;
    finalScore: number | null;
    user: { name: string | null; email: string | null };
    course: {
      title: string;
      duration: number | null;
      instructor: { name: string | null };
      modules?: Array<{ lessons?: Array<{ duration: number | null }> }>;
    };
  };
  showDashboardLink?: boolean;
}

const CERT_W = 1060;
const CERT_H = 750;

function CornerOrnament({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      style={{ display: "block", transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M2,40 L2,2 L40,2"
        fill="none"
        stroke="#C9A227"
        strokeWidth="1.5"
      />
      <path
        d="M7,34 L7,7 L34,7"
        fill="none"
        stroke="#C9A227"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle cx="2" cy="2" r="2.5" fill="#C9A227" />
    </svg>
  );
}

function Seal() {
  return (
    <div style={{ position: "relative", width: 100, height: 100 }}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0 }}
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke="#C9A227" strokeWidth="2" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#C9A227" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#C9A227"
          strokeWidth="0.8"
          strokeDasharray="3 2.5"
          opacity="0.7"
        />
        <circle cx="50" cy="50" r="30" fill="#edf5ff" />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <Award width={22} height={22} color="#0f62fe" />
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#0f62fe",
            letterSpacing: "0.22em",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          CFIA
        </span>
      </div>
    </div>
  );
}

export function CertificateView({
  certificate,
  showDashboardLink = false,
}: CertificateViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setScale(Math.min(1, (w - 2) / CERT_W));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const studentName = toCamelCase(
    certificate.user.name ||
      certificate.user.email?.split("@")[0] ||
      "Aluno CFIA"
  );
  const workload = formatCourseDuration(
    getCourseDurationMinutes(certificate.course)
  );
  const publicPath = `/certificados/${certificate.code}`;

  const d = new Date(certificate.issuedAt);
  const months = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez",
  ];
  const issueDate = `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]}. ${d.getFullYear()}`;

  const score =
    certificate.finalScore !== null ? `${certificate.finalScore}%` : "100%";
  const instructorName = toCamelCase(
    certificate.course.instructor.name || "Equipe CFIA"
  );
  const nameFontSize =
    studentName.length > 32 ? 30 : studentName.length > 24 ? 38 : 46;

  const stats = [
    { label: "Carga horária", value: workload },
    { label: "Instrutor", value: instructorName },
    { label: "Emissão", value: issueDate },
    { label: "Resultado", value: score, highlight: true },
  ];

  const s = scale ?? 1;

  return (
    <div className="space-y-4">
      <CertificateActions
        code={certificate.code}
        publicPath={publicPath}
        showDashboardLink={showDashboardLink}
      />

      {/* Responsive scale wrapper */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: scale === null ? 0 : s * CERT_H }}
      >
        <div
          id="certificate"
          style={{
            width: CERT_W,
            height: CERT_H,
            transformOrigin: "top left",
            transform: `scale(${s})`,
            position: "relative",
            backgroundColor: "#ffffff",
            overflow: "hidden",
            opacity: scale === null ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          {/* Subtle background gradients */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 8% 8%, rgba(201,162,39,0.07) 0%, transparent 40%), " +
                "radial-gradient(ellipse at 92% 92%, rgba(15,98,254,0.05) 0%, transparent 40%)",
              pointerEvents: "none",
            }}
          />

          {/* Outer gold border */}
          <div
            style={{
              position: "absolute",
              inset: 16,
              border: "2px solid #C9A227",
              pointerEvents: "none",
            }}
          />
          {/* Inner gold border */}
          <div
            style={{
              position: "absolute",
              inset: 24,
              border: "1px solid rgba(201,162,39,0.4)",
              pointerEvents: "none",
            }}
          />

          {/* Corner ornaments */}
          <div style={{ position: "absolute", top: 24, left: 24 }}>
            <CornerOrnament rotate={0} />
          </div>
          <div style={{ position: "absolute", top: 24, right: 24 }}>
            <CornerOrnament rotate={90} />
          </div>
          <div style={{ position: "absolute", bottom: 24, left: 24 }}>
            <CornerOrnament rotate={270} />
          </div>
          <div style={{ position: "absolute", bottom: 24, right: 24 }}>
            <CornerOrnament rotate={180} />
          </div>

          {/* Content (inside inner border) */}
          <div
            style={{
              position: "absolute",
              inset: 26,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── Blue header bar ── */}
            <div
              style={{
                height: 64,
                backgroundColor: "#0f62fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 36px",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                CFIA
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                Certificado de Conclusão
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {d.getFullYear()}
              </span>
            </div>

            {/* Gold shimmer line */}
            <div
              style={{
                height: 2,
                background:
                  "linear-gradient(90deg, transparent 0%, #8B6914 5%, #C9A227 25%, #E8C84A 50%, #C9A227 75%, #8B6914 95%, transparent 100%)",
                flexShrink: 0,
              }}
            />

            {/* ── Body ── */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Left: main content */}
              <div
                style={{
                  flex: 1,
                  padding: "32px 28px 28px 40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-mono, monospace)",
                      color: "#B8940A",
                      textTransform: "uppercase",
                      letterSpacing: "0.34em",
                      marginBottom: 10,
                    }}
                  >
                    Certificamos que
                  </p>

                  <h1
                    style={{
                      fontSize: nameFontSize,
                      fontFamily: "var(--font-serif, Georgia, serif)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      color: "#0a0a1a",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                      marginBottom: 18,
                    }}
                  >
                    {studentName}
                  </h1>

                  <p
                    style={{
                      fontSize: 13,
                      color: "#525252",
                      lineHeight: 1.75,
                      maxWidth: 500,
                      marginBottom: 10,
                    }}
                  >
                    concluiu integralmente a formação e cumpriu todos os
                    requisitos acadêmicos, incluindo avaliações obrigatórias e
                    prova final quando aplicável, do curso
                  </p>

                  <h2
                    style={{
                      fontSize: certificate.course.title.length > 55 ? 15 : 19,
                      fontWeight: 600,
                      color: "#0f62fe",
                      lineHeight: 1.35,
                      maxWidth: 500,
                    }}
                  >
                    {certificate.course.title}
                  </h2>
                </div>

                {/* Signature */}
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      borderBottom: "1px solid #C9A227",
                      paddingBottom: 4,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily:
                          '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive',
                        fontSize: 28,
                        color: "#0a0a1a",
                      }}
                    >
                      Renan Ferrari
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 9,
                      fontFamily: "var(--font-mono, monospace)",
                      color: "#6f6f6f",
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                    }}
                  >
                    Renan Ferrari — Reitor do CFIA
                  </p>
                </div>
              </div>

              {/* Gold vertical divider */}
              <div
                style={{
                  width: 1,
                  background:
                    "linear-gradient(180deg, transparent 0%, #C9A227 15%, #C9A227 85%, transparent 100%)",
                  flexShrink: 0,
                  margin: "18px 0",
                }}
              />

              {/* Right: seal + stats */}
              <div
                style={{
                  width: 250,
                  padding: "24px 32px 24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  flexShrink: 0,
                }}
              >
                <Seal />

                {/* Stats */}
                <div style={{ width: "100%" }}>
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: "10px 0",
                        borderBottom:
                          i < stats.length - 1
                            ? "1px solid rgba(201,162,39,0.22)"
                            : "none",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 9,
                          fontFamily: "var(--font-mono, monospace)",
                          color: "#B8940A",
                          textTransform: "uppercase",
                          letterSpacing: "0.28em",
                          marginBottom: 3,
                        }}
                      >
                        {stat.label}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: stat.highlight ? "#0f62fe" : "#0a0a1a",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Verification box */}
                <div
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    backgroundColor: "rgba(201,162,39,0.06)",
                    border: "1px solid rgba(201,162,39,0.3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 5,
                    }}
                  >
                    <ShieldCheck width={10} height={10} color="#B8940A" />
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "var(--font-mono, monospace)",
                        color: "#B8940A",
                        textTransform: "uppercase",
                        letterSpacing: "0.24em",
                      }}
                    >
                      Verificação
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 9,
                      fontFamily: "var(--font-mono, monospace)",
                      color: "#0a0a1a",
                      letterSpacing: "0.06em",
                      wordBreak: "break-all",
                      lineHeight: 1.6,
                    }}
                  >
                    {certificate.code.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
