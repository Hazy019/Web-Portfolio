import { MetadataRoute } from "next";

/**
 * Next.js App Router sitemap generator.
 * Automatically served at /sitemap.xml with the correct
 * application/xml Content-Type header — no static file needed.
 *
 * Google Search Console previously reported "Couldn't fetch" because
 * the sitemap.xml was at the project root (never served), not in /public
 * and not wired through App Router conventions.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hazy.cosedevs.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
