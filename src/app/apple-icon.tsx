import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icono para iPhone/iPad (apple-touch-icon): wordmark "S" + punto magenta.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1B25",
          color: "#FAFAFF",
          fontSize: 118,
          fontWeight: 800,
          fontFamily: "sans-serif",
          letterSpacing: "-0.05em",
        }}
      >
        S
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 999,
            background: "#FF4FD8",
            marginLeft: 6,
            marginTop: 44,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
