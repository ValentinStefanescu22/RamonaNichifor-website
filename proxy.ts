import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // everything except API routes, Next internals, the generated opengraph-image routes (no extension in their URL; a /ro/…
  // one must not be redirected to /…) and files with an extension
  matcher: "/((?!admin|api|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
