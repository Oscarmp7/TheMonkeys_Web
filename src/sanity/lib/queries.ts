import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, slug, mainImage, gallery, description, services, featured
  }
`;

export const clientLogosQuery = groq`
  *[_type == "clientLogo"] | order(order asc) {
    _id, name, logo, url
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]
`;
