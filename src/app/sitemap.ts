import type { MetadataRoute } from "next";

const SITE_URL = "https://setnou.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Single-page: las secciones se indexan vía anclas de la home.
  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/#servicios`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/#portfolio`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/#nosotros`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
