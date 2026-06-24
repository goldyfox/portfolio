import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lisa Aufox — Product Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const ETHOS_BLUE = "#1313ec";
const ETHOS_CREAM = "#fdfbf7";

export default async function OpengraphImage() {
  const [newsreaderItalic, inter] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/newsreader-500-italic.woff")),
    readFile(join(process.cwd(), "assets/fonts/inter-500.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: ETHOS_CREAM,
          backgroundImage:
            "radial-gradient(circle at 88% 12%, rgba(19,19,236,0.12), rgba(19,19,236,0) 42%)",
          padding: "84px 96px",
          fontFamily: "Inter",
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{ width: 64, height: 2, backgroundColor: ETHOS_BLUE, marginRight: 24 }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#111827",
            }}
          >
            Portfolio
          </div>
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Newsreader",
              fontStyle: "italic",
              fontSize: 150,
              lineHeight: 1,
              color: ETHOS_BLUE,
            }}
          >
            Lisa Aufox
          </div>
          <div
            style={{
              fontSize: 32,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#111827",
              marginTop: 28,
            }}
          >
            Product Design
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 26, color: "#4b5563" }}>
            AI · Monetization · Messaging — Meta
          </div>
          <div style={{ fontSize: 24, color: ETHOS_BLUE }}>lisaaufox.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: newsreaderItalic, style: "italic", weight: 500 },
        { name: "Inter", data: inter, style: "normal", weight: 500 },
      ],
    },
  );
}
