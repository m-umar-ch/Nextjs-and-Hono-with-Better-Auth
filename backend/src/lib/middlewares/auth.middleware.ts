import { createMiddleware } from "hono/factory";
import { auth } from "@/modules/auth/service/auth";
import type { PermissionsInput } from "@/modules/auth/service/permissions";
import type { AppMiddleware } from "../core/create-router";
import { HONO_ERROR } from "../utils";

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

  const publicRoutes = ["public"];

  if (publicRoutes.some((p) => path.startsWith(`/api/${p}`))) {
    await next();
    return;
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

/**
 * Middleware to ensure the user is authenticated and authorized.
 * Blocks access if there is no valid user or session.
 */
export const requireAuth: AppMiddleware = createMiddleware(async (c, next) => {
  if (!c.var.session || !c.var.user) {
    return HONO_ERROR(c, "FORBIDDEN", "Authentication required");
  }
  await next();
});

/**
 * Middleware factory that creates a middleware to check both authentication and permissions.
 * Combines requireAuth and permission checking into a single middleware.
 *
 * @param permissions - The permissions object to check (e.g., { order: ["create"] })
 * @returns A middleware that ensures the user is authenticated and has the required permissions
 *
 * @example
 * ```typescript
 * export const POST_Route = createRoute({
 *   // ...
 *   middleware: [requirePermission({ order: ["create"] })],
 * });
 * ```
 */
export function requirePermissions(
  permissions: PermissionsInput,
): AppMiddleware {
  return createMiddleware(async (c, next) => {
    if (!c.var.session || !c.var.user) {
      return HONO_ERROR(c, "FORBIDDEN", "Authentication required");
    }

    const hasPermission = await auth.api.userHasPermission({
      body: { userId: c.var.user.id, permissions },
    });

    if (!hasPermission.success) {
      return HONO_ERROR(
        c,
        "FORBIDDEN",
        "You don't have permission to perform this action",
      );
    }

    await next();
  });
}
