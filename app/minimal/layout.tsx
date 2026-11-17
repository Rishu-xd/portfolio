import type { Metadata } from "next";
import { SITE_SEO } from "../lib/seo";

export const metadata: Metadata = {
  title: "Minimal 1-Page Index",
  description:
    "Zero-scroll single-screen engineering index of Akhand Veer Singh (@Rishu-xd): all 7 featured projects, live links, tech stack, and direct contact channels.",
  alternates: {
    canonical: "/minimal",
  },
  openGraph: {
    title: `Minimal 1-Page Index — ${SITE_SEO.name}`,
    description:
      "Zero-scroll single-screen engineering index of Akhand Veer Singh (@Rishu-xd): Betterclock, ARC, DoLog, Qflow, BirdWiki, SaavnPlay, and PinFetch.",
    url: "/minimal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Minimal 1-Page Index — ${SITE_SEO.name}`,
    description:
      "Zero-scroll single-screen engineering index of Akhand Veer Singh (@Rishu-xd).",
  },
};

export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
