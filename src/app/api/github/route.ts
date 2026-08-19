import { NextResponse } from "next/server";

// ISR: Cache for 24 hours at the Next.js server layer.
// Previously revalidate=0 + cache:"no-store" hit GitHub API on every page load,
// causing 500-1200ms TTFB and risking GitHub's unauthenticated 10 req/min
// search/commits rate limit. Now a cache hit returns in <15ms.
export const revalidate = 86400; // 24 hours

export async function GET() {
  let public_repos = 12;
  let created_year = 2024;
  let total_commits = 250;

  try {
    const userRes = await fetch("https://api.github.com/users/Hazy019", {
      headers: {
        "User-Agent": "HAZY-Portfolio-App",
        Accept: "application/vnd.github.v3+json",
      },
      // ISR cache: Next.js will revalidate this fetch every 24 hours
      next: { revalidate: 86400 },
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      public_repos = userData.public_repos ?? public_repos;
      if (userData.created_at) {
        created_year = new Date(userData.created_at).getFullYear();
      }
    }
  } catch (err) {
    console.error("Error fetching GitHub user data:", err);
  }

  try {
    const commitRes = await fetch(
      "https://api.github.com/search/commits?q=author:Hazy019",
      {
        headers: {
          "User-Agent": "HAZY-Portfolio-App",
          Accept: "application/vnd.github.cloak-preview+json",
        },
        // ISR cache: prevent rate-limit on the 10 req/min search/commits endpoint
        next: { revalidate: 86400 },
      }
    );

    if (commitRes.ok) {
      const commitData = await commitRes.json();
      if (typeof commitData.total_count === "number" && commitData.total_count > 0) {
        total_commits = commitData.total_count;
      }
    }
  } catch (err) {
    console.error("Error fetching GitHub commits data:", err);
  }

  return NextResponse.json(
    {
      public_repos,
      created_year,
      total_commits,
    },
    {
      headers: {
        // CDN + browser cache: serve from edge for 24h, stale-while-revalidate for 12h
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    }
  );
}
