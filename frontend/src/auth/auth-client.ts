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
