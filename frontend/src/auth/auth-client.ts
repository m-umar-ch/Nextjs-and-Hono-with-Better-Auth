import { createAuthClient } from "better-auth/client";
import {
  ac,
  admin,
  contentEditor,
  customer,
  salesManager,
  superAdmin,
  vendor,
} from "./permissions";
import { adminClient, emailOTPClient } from "better-auth/client/plugins";
import { env } from "@/env";

/**
 * @Imp
 * In server components, you have to use like this:
 *
 * ```ts
 * const session = await authClient.getSession({
 *   fetchOptions: {
 *     headers: await headers()
 *   },
 * });
 * ```
 */

export const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/better-auth`,
  fetchOptions: { credentials: "include" },
  plugins: [
    adminClient({
      ac,
      roles: {
        superAdmin,
        admin,
        vendor,
        salesManager,
        contentEditor,
        customer,
      },
    }),
    emailOTPClient(),
  ],
});
