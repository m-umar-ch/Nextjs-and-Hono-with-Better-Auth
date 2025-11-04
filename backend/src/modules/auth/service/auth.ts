import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import env from "@/env";
import {
  sendEmailVerificationOTP,
  sendPasswordResetOTP,
  sendSigninOTP,
} from "@/modules/mailer";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import {
  admin as adminPlugin,
  emailOTP,
  openAPI,
  username,
} from "better-auth/plugins";
import {
  ac,
  admin,
  contentEditor,
  customer,
  Roles,
  salesManager,
  superAdmin,
  vendor,
} from "./permissions";
import { tryCatch } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  secret: env.BETTER_AUTH_SECRET,
  basePath: "/api/better-auth",
  plugins: [
    adminPlugin({
      ac,
      roles: {
        superAdmin,
        admin,
        vendor,
        salesManager,
        contentEditor,
        customer,
      },
      defaultRole: Roles.DEFAULT,
      adminRoles: [Roles.SUPER_ADMIN, Roles.ADMIN],
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        try {
          // Try to get user information for personalized emails
          let userName: string | undefined;

          const { data, error } = await tryCatch(
            db.query.user.findFirst({
              where: eq(user.email, email),
              columns: { name: true },
            })
          );
          userName = data?.name;
          if (error) {
            HONO_LOGGER.warn("Could not fetch user info for OTP email", {
              email,
              error,
            });
          }

          if (type === "email-verification") {
            await sendEmailVerificationOTP(email, otp, userName);
            HONO_LOGGER.info("Email verification OTP sent", { email, type });
          } else if (type === "forget-password") {
            await sendPasswordResetOTP(email, otp, userName);
            HONO_LOGGER.info("Password reset OTP sent", { email, type });
          } else {
            await sendSigninOTP(email, otp, userName);
            HONO_LOGGER.info("Sign-in OTP sent", { email, type });
          }
        } catch (error) {
          HONO_LOGGER.error("Failed to send OTP email", { email, type, error });
          HONO_LOGGER.sentry.captureException(error, {
            tags: {
              operation: "send_otp_email",
              email_type: type,
            },
            extra: {
              email,
              type,
              error: error instanceof Error ? error.message : String(error),
            },
          });
          throw error; // Re-throw to let better-auth handle the error
        }
      },
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
    }),
    openAPI({ disableDefaultReference: true }),
  ],

  // Debug logging
  logger: {
    level: "debug",
    disabled: false,
  },

  // Social providers configuration
  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
            // redirectURI: `${env.FRONTEND_BASE_URL}/api/better-auth/callback/google`,
          },
        }
      : {},

  // Session configuration
  // session: {
  //   expiresIn: 60 * 60 * 24 * 7, // 7 days
  //   updateAge: 60 * 60 * 24, // 1 day
  // },

  // Advanced configuration
  advanced: {
    // Cookie configuration for cross-origin requests
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: false,
          // partitioned: true,
          // httpOnly: true,
        },
      },
    },
  },

  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 100, // 100 requests per minute
  },

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:9999",
    // "https://*.example.com"
  ],
});
