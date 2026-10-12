import { MetadataRoute } from "next";

/**
 * Next.js App Router sitemap generator.
 * Automatically served at /sitemap.xml with the correct
 * application/xml Content-Type header — no static file needed.
 *
 * IMPORTANT: lastmod must be a truthful date of last content change.
 * Using new Date() teaches Google the page changes every request,
 * so it ignores the signal. Update this date when content changes.
 *
 * TODO(owner): Update LAST_CONTENT_CHANGE when you publish new content.
 */
const LAST_CONTENT_CHANGE = "2026-10-12";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hazy.cosedevs.com";

  return [
    {
      url: baseUrl,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
