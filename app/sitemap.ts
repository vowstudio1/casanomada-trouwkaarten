import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://casanomada-trouwkaarten.netlify.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: base + "/templates", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: base + "/login", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/register", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
