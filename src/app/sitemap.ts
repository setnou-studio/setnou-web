import type { MetadataRoute } from "next";

const SITE_URL = "https://setnoustudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Web de una sola página: se indexa la home (los #fragmentos no cuentan como URLs).
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
  ];
}
