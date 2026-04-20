import { ImageResponse } from "next/og";

export const alt = "Portfolio ROI — Études de cas orientées résultats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(86,148,189,0.35), transparent 55%), radial-gradient(ellipse at 90% 80%, rgba(86,148,189,0.22), transparent 60%), linear-gradient(135deg, #1a1e45, #2a2e5e)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#5694bd",
              color: "#0b1020",
              fontSize: 26,
              fontWeight: 900,
              borderRadius: 12,
            }}
          >
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.2 }}>
              Portfolio ROI
            </span>
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.6)",
                marginTop: 4,
              }}
            >
              Performance mesurée
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#5694bd",
            }}
          >
            Études de cas · ROI mesuré
          </span>
          <span
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Chaque euro investi laisse une trace.
          </span>
          <span
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 720,
            }}
          >
            Bibliothèque d&apos;études de cas mesurées : stratégie, exécution,
            ROI encaissé.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            portfolio-roi
          </span>
          <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              ROI moyen
            </span>
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "#5694bd",
              }}
            >
              ×10+
            </span>
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
