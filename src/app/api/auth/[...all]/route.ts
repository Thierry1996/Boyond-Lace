import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth catch-all handler. App Router equivalent of the docs' pages-router
 * `toNodeHandler` snippet — `toNextJsHandler` returns App Router GET/POST, and
 * Next does not body-parse route handlers, so no bodyParser config is needed.
 */
export const { POST, GET } = toNextJsHandler(auth);
