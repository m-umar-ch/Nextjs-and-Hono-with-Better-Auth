import { createMiddleware } from "hono/factory";
import { auth } from "@/modules/auth/service/auth";

/**
 * Authentication middleware - verifies user session
 * Adds user and session to context if authenticated
 */
// export const authMiddleware = createMiddleware(async (c, next) => {
//   try {
//     // Get session from Better Auth
//     const session = await auth.api.getSession({
//       headers: c.req.raw.headers,
//     });

//     if (!session) {
//       throw new HTTPException(HTTP.UNAUTHORIZED, {
//         message: "Authentication required",
//       });
//     }

//     // Set user and session in context
//     c.set("user", session.user as AuthUser);
//     c.set("session", session.session as AuthSession);

//     await next();
//   } catch (error) {
//     if (error instanceof HTTPException) {
//       throw error;
//     }

//     throw new HTTPException(HTTP.UNAUTHORIZED, {
//       message: "Invalid or expired session",
//     });
//   }
// });

/**
 * Optional authentication middleware - adds user to context if authenticated
 * Does not throw error if not authenticated
 */
export const optionalAuthMiddleware = createMiddleware(async (c, next) => {
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
