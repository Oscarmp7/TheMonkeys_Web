import {
  TrendingUp, FileText, Search, Globe, Users, Megaphone, Camera,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Single source of truth for service keys. */
export const SERVICE_KEYS = [
  "inbound", "contenidos", "seo", "web", "influencers", "ads", "foto_video",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_ICONS: Record<ServiceKey, LucideIcon> = {
  inbound: TrendingUp,
  contenidos: FileText,
  seo: Search,
  web: Globe,
  influencers: Users,
  ads: Megaphone,
  foto_video: Camera,
};
