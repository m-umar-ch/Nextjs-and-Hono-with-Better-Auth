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

// Create Better Auth client for client-side usage
export const auth = createAuthClient({
  baseURL: `${env.BACKEND_BASE_URL}/api/better-auth`,
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
