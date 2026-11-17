import type { MetadataRoute } from "next";
import { SITE_SEO } from "./lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_SEO.title,
    short_name: SITE_SEO.shortName,
    description: SITE_SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
