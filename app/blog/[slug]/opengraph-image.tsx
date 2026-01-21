import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const alt = "Blog post image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Note: We can't use the full posts library here because OG images use Edge runtime
// Instead, we pass the title via searchParams or use a simpler approach
export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Convert slug to readable title (fallback when we can't read the file)
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#fafaf9",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#0d9488",
          }}
        />

        {/* Site name */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "80px",
            fontSize: "24px",
            fontWeight: 500,
            color: "#78716c",
          }}
        >
          {siteConfig.name}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#1c1917",
            lineHeight: 1.2,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Read more prompt */}
        <div
          style={{
            fontSize: "24px",
            color: "#0d9488",
            fontWeight: 500,
          }}
        >
          Read more →
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
