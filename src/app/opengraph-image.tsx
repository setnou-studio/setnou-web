import { ImageResponse } from "next/og";

export const alt =
  "Setnou Studio — Diseño web, SEO y estrategia digital en Barcelona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen para compartir en redes (Open Graph / Twitter)
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAFAFF",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Cabecera: wordmark + paleta */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 800, color: "#1A1B25", letterSpacing: "0.04em" }}>
            SETN
            <span style={{ width: 26, height: 26, borderRadius: 999, background: "#FF4FD8", margin: "0 4px" }} />
            U STUDIO
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["#0075FF", "#00C0FF", "#FF4FD8", "#FFB703", "#1A1B25"].map((c) => (
              <div key={c} style={{ width: 28, height: 28, borderRadius: 6, background: c }} />
            ))}
          </div>
        </div>

        {/* Titular */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 800, color: "#1A1B25", lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 1000, display: "flex", flexWrap: "wrap" }}>
            Tu web debería trabajar&nbsp;
            <span style={{ background: "#FF4FD8", color: "#1A1B25", padding: "0 12px", borderRadius: 10 }}>
              tanto como tú.
            </span>
          </div>
          <div style={{ fontSize: 32, color: "#5B5C6B" }}>
            Diseño web · SEO · Estrategia digital — Barcelona
          </div>
        </div>

        {/* Pie */}
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#0075FF" }}>
          El diseño de tu web, gratis. Solo pagas si te gusta.
        </div>
      </div>
    ),
    { ...size }
  );
}
