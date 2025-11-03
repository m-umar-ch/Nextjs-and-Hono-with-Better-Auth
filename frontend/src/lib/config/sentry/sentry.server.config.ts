// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from "@/env";
import * as Sentry from "@sentry/nextjs";

if (env.NODE_ENV === "production") {
  Sentry.init({
    dsn: env.SENTRY_DNS,

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Enable sending user PII (Personally Identifiable Information)
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    enabled: env.NODE_ENV === "production",

    environment: env.NODE_ENV,
  });
}
