import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

type Route = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

const routes: Route[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/verifier", changeFrequency: "monthly", priority: 0.9 },
  { path: "/verification", changeFrequency: "monthly", priority: 0.9 },
  { path: "/algorithme", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: new URL(route.path, siteConfig.url).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
