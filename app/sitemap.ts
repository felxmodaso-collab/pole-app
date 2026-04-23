import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = "https://pole.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`,          lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/privacy`,   lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/terms`,     lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
  ];
}
