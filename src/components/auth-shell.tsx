import Link from "next/link";

interface AuthShellProps {
  eyebrow: string;
  heading: string;
  description: string;
  features?: string[];
  children: React.ReactNode;
}

export function AuthShell({
  eyebrow,
  heading,
  description,
  features,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: dark brand panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 flex-shrink-0"
        style={{
          width: 400,
          backgroundColor: "#161616",
          borderRight: "1px solid #262626",
        }}
      >
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight"
          style={{ color: "#ffffff" }}
        >
          CFIA
        </Link>

        <div>
          <p
            className="text-[11px] uppercase tracking-[0.32em] mb-5"
            style={{
              color: "#4589ff",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {eyebrow}
          </p>
          <h2
            className="text-3xl font-light leading-snug mb-5"
            style={{
              color: "#f4f4f4",
              letterSpacing: 0,
              fontFamily: "var(--font-serif, Georgia, serif)",
              fontStyle: "italic",
            }}
          >
            {heading}
          </h2>
          <p className="text-sm leading-7" style={{ color: "#a8a8a8" }}>
            {description}
          </p>

          {features && features.length > 0 && (
            <div className="mt-8 space-y-3.5">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div
                    className="h-px w-4 flex-shrink-0"
                    style={{ backgroundColor: "#4589ff" }}
                  />
                  <p className="text-sm" style={{ color: "#8d8d8d" }}>
                    {f}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs" style={{ color: "#525252" }}>
          © {new Date().getFullYear()} CFIA. Todos os direitos reservados.
        </p>
      </div>

      {/* Right: white form panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center px-6 h-14 flex-shrink-0"
          style={{
            borderBottom: "1px solid #e0e0e0",
            borderTop: "3px solid #0f62fe",
          }}
        >
          <Link
            href="/"
            className="text-base font-semibold tracking-tight"
            style={{ color: "#161616" }}
          >
            CFIA
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
