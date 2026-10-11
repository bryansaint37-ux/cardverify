import type { MetadataRoute } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = await getLocale();
  const t = await getTranslations("site");

  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: t("description"),
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: siteConfig.themeColor,
    lang: locale,
    categories: ["education", "developer"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
