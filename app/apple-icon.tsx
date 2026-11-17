import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          border: "4px solid rgba(255,255,255,0.2)",
          borderRadius: 38,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          AV
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            fontFamily: "monospace",
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.65)",
          }}
        >
          RISHU-XD
        </div>
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 22,
            width: 14,
            height: 14,
            borderRadius: 99,
            background: "#34d399",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
