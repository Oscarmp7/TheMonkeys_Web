import { notFound } from "next/navigation";

/** Catch-all for unknown paths inside a locale — renders [locale]/not-found.tsx. */
export default function CatchAllPage() {
  notFound();
}
