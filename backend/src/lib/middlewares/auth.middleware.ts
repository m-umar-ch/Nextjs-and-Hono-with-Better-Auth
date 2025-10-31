import { createMiddleware } from "hono/factory";
import { auth } from "@/modules/auth/service/auth";

/**
 * Middleware for authentication handling in the application.
 *
 * This middleware performs the following:
 * 1. Checks if the requested path is in public routes
 * 2. Retrieves user session from authentication headers
 * 3. Sets user and session information in the context
 *
 * @param c - The context object containing request and response information
 * @param next - The function to call the next middleware in the chain
 *
 * @example
 * ```typescript
 * app.use(authMiddleware);
 * ```
 *
 * @returns {Promise<void>} A promise that resolves when the middleware completes
 */
export const authMiddleware = createMiddleware(async (c, next) => {
  const path = c.req.path;

  const publicRoutes = ["/public"];

  if (publicRoutes.some((p) => path.startsWith(p))) {
    await next();
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});
