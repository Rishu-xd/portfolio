export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    process.env.SITE_URL ||
    "https://thorfinn.antideploy.app";
  return raw.replace(/\/+$/, "");
}

export const SITE_SEO = {
  name: "Akhand Veer Singh",
  shortName: "Thorfinn",
  handle: "@rishu_xd",
  githubHandle: "Rishu-xd",
  title: "Akhand Veer Singh (Rishu-xd) — Product & Systems Engineer",
  titleTemplate: "%s | Akhand Veer Singh",
  description:
    "Portfolio of Akhand Veer Singh (@Rishu-xd), a Product & Systems Engineer in India building real-time web apps, spatial canvases, and automation tools with TypeScript, Next.js, Python, and C++.",
  keywords: [
    "Akhand Veer Singh",
    "Rishu-xd",
    "Thorfinn",
    "Product Engineer",
    "Systems Engineer",
    "Full-Stack Developer",
    "TypeScript",
    "Next.js",
    "Three.js",
    "Python",
    "Betterclock",
    "DoLog",
    "Qflow",
    "ARC",
    "BirdWiki",
    "India Software Engineer",
  ],
};
