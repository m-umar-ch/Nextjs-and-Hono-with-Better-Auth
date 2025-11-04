import { authClient } from "@/auth/auth-client";
import { tryCatch } from "@/lib/utils";
import { headers } from "next/headers";

/**
 * Get session in server components with error handling
 * @returns Session data with user and session info, or null if not authenticated
 *
 * @example
 * ```ts
 * const session = await getSession();
 * if (!session?.user) {
 *   redirect("/login");
 * }
 * ```
 */
export async function getSession() {
  const sessionResult = await tryCatch(
    authClient.getSession({
      fetchOptions: { headers: await headers() },
    })
  );

  if (!sessionResult.success) return null;

  return sessionResult.data?.data || null;
}

/**
 * Get user from session in server components with error handling
 * @returns User object if authenticated, or null if not
 *
 * @example
 * ```ts
 * const user = await getUser();
 * if (!user) redirect("/login");
 * ```
 */
export async function getUser() {
  const sessionResult = await tryCatch(
    authClient.getSession({
      fetchOptions: { headers: await headers() },
    })
  );

  if (!sessionResult.success) return null;

  return sessionResult.data?.data?.user || null;
}
