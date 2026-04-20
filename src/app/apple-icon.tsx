import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(86,148,189,0.35), transparent 60%), linear-gradient(135deg, #2a2e5e, #3e6493)",
          color: "white",
          fontSize: 110,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          borderRadius: 40,
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
