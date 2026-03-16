import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { PROJECTS } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/en`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/servicios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/en/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/portafolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/en/portfolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.flatMap((p) => [
    { url: `${base}/portafolio/${p.slug}`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/en/portfolio/${p.slug}`, lastModified: new Date(), priority: 0.6 },
  ]);

  return [...staticRoutes, ...projectRoutes];
}
