import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function AppleIcon() {
  const iconSvg = await readFile(join(process.cwd(), "app/icon.svg"), "utf8");
  const iconDataUri = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fdfbf7",
        }}
      >
        <img src={iconDataUri} width={180} height={180} alt="" />
      </div>
    ),
    { ...size },
  );
}
