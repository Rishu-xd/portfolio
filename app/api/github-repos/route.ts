import { NextResponse } from "next/server";

const username = "Rishu-xd";

export type GitHubRepoSummary = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  topics: string[];
};

export async function GET() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "thorfinn-portfolio-engine",
        },
        next: { revalidate: 1800 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "GitHub repositories temporarily unavailable." },
        { status: 502 }
      );
    }

    const raw = (await response.json()) as Array<{
      id: number;
      name: string;
      full_name: string;
      description: string | null;
      html_url: string;
      homepage: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
      topics?: string[];
      fork?: boolean;
    }>;

    const repos: GitHubRepoSummary[] = raw
      .filter((r) => !r.fork && r.name.toLowerCase() !== username.toLowerCase())
      .map((r) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        htmlUrl: r.html_url,
        homepage: r.homepage || null,
        language: r.language || "TypeScript",
        stargazersCount: r.stargazers_count,
        forksCount: r.forks_count,
        updatedAt: r.updated_at,
        topics: r.topics ?? [],
      }));

    return NextResponse.json({
      username,
      count: repos.length,
      repos,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories." },
      { status: 502 }
    );
  }
}
