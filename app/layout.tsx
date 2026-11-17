import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSiteUrl, SITE_SEO } from "./lib/seo";
import { PROFILE, PROJECTS, SKILLS } from "./data/portfolio";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_SEO.title,
    template: SITE_SEO.titleTemplate,
  },
  description: SITE_SEO.description,
  keywords: SITE_SEO.keywords,
  authors: [{ name: PROFILE.name, url: PROFILE.github }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  applicationName: `${SITE_SEO.shortName} Portfolio`,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: `${SITE_SEO.name} (${SITE_SEO.handle})`,
    title: SITE_SEO.title,
    description: SITE_SEO.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE_SEO.handle,
    title: SITE_SEO.title,
    description: SITE_SEO.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: ["/icon"],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_SEO.title,
        description: SITE_SEO.description,
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: PROFILE.name,
        alternateName: ["Rishu-xd", "Thorfinn", "Rishu"],
        jobTitle: PROFILE.role,
        description: PROFILE.summaryShort,
        url: siteUrl,
        image: `${siteUrl}/images/hero.jpg`,
        email: `mailto:${PROFILE.email}`,
        nationality: "Indian",
        homeLocation: {
          "@type": "Place",
          name: PROFILE.location,
        },
        sameAs: [PROFILE.github, PROFILE.linkedin, PROFILE.twitter],
        knowsAbout: SKILLS.map((s) => s.name),
      },
      {
        "@type": "ItemList",
        name: "Selected Engineering Projects",
        itemListElement: PROJECTS.map((p, index) => ({
          "@type": "SoftwareSourceCode",
          position: index + 1,
          name: p.title,
          description: p.description,
          codeRepository: p.repoHref,
          url: p.href,
          programmingLanguage: p.stack.join(", "),
        })),
      },
    ],
  };

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
