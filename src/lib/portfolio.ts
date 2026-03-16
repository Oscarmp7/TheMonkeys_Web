export interface Project {
  slug: string;
  client: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  services: string[];
  coverImage: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: "jimetor",
    client: "Jimetor",
    titleEs: "Identidad digital & SEO",
    titleEn: "Digital identity & SEO",
    descriptionEs: "Fotografía, video, manejo de redes sociales y posicionamiento SEO para Jimetor.",
    descriptionEn: "Photography, video, social media management and SEO positioning for Jimetor.",
    services: ["foto_video", "seo", "contenidos"],
    coverImage: "/portfolio/jimetor-logo.jpeg",
    featured: true,
  },
];
