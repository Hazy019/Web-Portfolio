import { MetadataRoute } from "next";

/**
 * Next.js App Router sitemap generator.
 * Automatically served at /sitemap.xml with the correct
 * application/xml Content-Type header.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hazy.cosedevs.com";
  // Canonical deployment timestamp for sitemap freshness
  const lastModified = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}

