import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          border: "1.5px solid rgba(255,255,255,0.28)",
          borderRadius: 7,
          fontSize: 19,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <span>A</span>
        <div
          style={{
            position: "absolute",
            right: 4,
            bottom: 4,
            width: 5,
            height: 5,
            borderRadius: 99,
            background: "#34d399",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
