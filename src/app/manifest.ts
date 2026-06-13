import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Setnou Studio",
    short_name: "Setnou",
    description:
      "Estudio de diseño web, SEO y estrategia digital en Barcelona.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFF",
    theme_color: "#FAFAFF",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
