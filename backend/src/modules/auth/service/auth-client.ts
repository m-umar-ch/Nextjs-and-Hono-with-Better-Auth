import { createAuthClient } from "better-auth/client";
import env from "@/env";
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

// Create Better Auth client for client-side usage
export const authClient = createAuthClient({
  baseURL: env.BACKEND_BASE_URL,
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
