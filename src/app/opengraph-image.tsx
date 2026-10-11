import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage générée par requête (Open Graph / Twitter). */
export default async function OpengraphImage() {
  const t = await getTranslations("site");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e1b4b 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #38bdf8, #4f46e5)",
            }}
          >
            {/* Coche dessinée en SVG : évite de dépendre d'une police
                capable de rendre le caractère « ✓ ». */}
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#020617"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4 12 5 5L20 6" />
            </svg>
          </div>
          <span style={{ fontSize: 34, fontWeight: 600, color: "#f8fafc" }}>
            Card<span style={{ color: "#38bdf8" }}>Verify</span>
          </span>
        </div>

        <h1
          style={{
            marginTop: 48,
            fontSize: 68,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#f8fafc",
            maxWidth: 900,
          }}
        >
          {t("tagline")}
        </h1>

        <p style={{ marginTop: 28, fontSize: 30, color: "#94a3b8", maxWidth: 860 }}>
          {t("description")}
        </p>
      </div>
    ),
    size,
  );
}
