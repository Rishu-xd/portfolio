import type { Metadata } from "next";
import { SITE_SEO } from "../lib/seo";

export const metadata: Metadata = {
  title: "Encyclopedic Corpus & LLM Profile",
  description:
    "Structured Wikipedia-style technical biography, project citations, and machine-readable engineering corpus for Akhand Veer Singh (@Rishu-xd).",
  alternates: {
    canonical: "/llm",
  },
  openGraph: {
    title: `Encyclopedic Corpus — ${SITE_SEO.name}`,
    description:
      "Plain-text Wikipedia-style biography, inline citation graph, and structured engineering dossier for Akhand Veer Singh (@Rishu-xd).",
    url: "/llm",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `Encyclopedic Corpus — ${SITE_SEO.name}`,
    description:
      "Plain-text Wikipedia-style biography and structured engineering dossier for Akhand Veer Singh (@Rishu-xd).",
  },
};

export default function LlmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
