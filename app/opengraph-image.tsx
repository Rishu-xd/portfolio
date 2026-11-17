import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Akhand Veer Singh (Rishu-xd) — Product & Systems Engineer Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  let avatarDataUri = "";
  try {
    const buf = await readFile(join(process.cwd(), "public/images/hero.jpg"));
    avatarDataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    avatarDataUri = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#ffffff",
          padding: "48px 56px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top telemetry header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            paddingBottom: "20px",
            fontSize: 18,
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 99,
                background: "#34d399",
              }}
            />
            <span>SYS.PORTFOLIO // @RISHU-XD</span>
          </div>
          <span>INDIA · 26.85°N 80.95°E</span>
        </div>

        {/* Center Identity Block */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginTop: 12,
          }}
        >
          {avatarDataUri ? (
            <img
              src={avatarDataUri}
              width={184}
              height={184}
              alt="Akhand Veer Singh"
              style={{
                borderRadius: 10,
                border: "2px solid rgba(255,255,255,0.28)",
                objectFit: "cover",
              }}
            />
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontFamily: "monospace",
                color: "#34d399",
                letterSpacing: "0.14em",
                marginBottom: 10,
              }}
            >
              PRODUCT &amp; SYSTEMS ENGINEER
            </div>
            <div
              style={{
                fontSize: 64,
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#ffffff",
              }}
            >
              Akhand Veer Singh
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 22,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
                maxWidth: 780,
              }}
            >
              Real-time web apps, spatial canvases, 8K Three.js topologies, and
              deterministic backend systems in TypeScript, Next.js, Python &amp;
              C++.
            </div>
          </div>
        </div>

        {/* Bottom Footer Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "22px",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {["Betterclock", "ARC", "DoLog", "Qflow", "BirdWiki"].map(
              (proj) => (
                <div
                  key={proj}
                  style={{
                    border: "1px solid rgba(255,255,255,0.26)",
                    borderRadius: 4,
                    padding: "6px 14px",
                    fontSize: 16,
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.9)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  {proj}
                </div>
              )
            )}
          </div>
          <div
            style={{
              fontSize: 16,
              fontFamily: "monospace",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            01 LAB · 02 MIN · 03 LLM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
