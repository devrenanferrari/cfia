import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161616",
          color: "#ffffff",
          padding: 64,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>CFIA</div>
          <div style={{ color: "#78a9ff", fontSize: 20 }}>Projeto de extensao</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#78a9ff", fontSize: 24, marginBottom: 22 }}>
            Cursos livres e gratuitos
          </div>
          <div style={{ fontSize: 72, lineHeight: 1.02, maxWidth: 900, fontWeight: 300 }}>
            Programacao e inteligencia artificial para quem esta comecando.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, color: "#c6c6c6", fontSize: 24 }}>
          <span>100% gratuito</span>
          <span>-</span>
          <span>certificado verificavel</span>
          <span>-</span>
          <span>pt-BR</span>
        </div>
      </div>
    ),
    size
  );
}
