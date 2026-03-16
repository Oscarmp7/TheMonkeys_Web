/**
 * i18n routing middleware (Next.js App Router).
 * Intercepts all non-asset, non-API requests and applies next-intl locale routing.
 * Redirects bare paths (e.g. /) to the default locale (/es).
 * Excluded: /api/*, /_next/*, /_vercel/*, and file extensions.
 */
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
