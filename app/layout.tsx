import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akhand Veer Singh (Rishu-xd) — Product & Systems Engineer",
  description:
    "Three-mode portfolio of Akhand Veer Singh (@Rishu-xd): Interactive Three.js & 2D Physics Studio, Zero-Scroll 1-Page Index, and Wikipedia-style LLM Scraper Corpus.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
