import { NextResponse } from "next/server";

export const revalidate = 0; // Disable static caching for live stats

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
      cache: "no-store",
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
        cache: "no-store",
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
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
