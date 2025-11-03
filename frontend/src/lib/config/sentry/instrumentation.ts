import { env } from "@/env";
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && env.NODE_ENV === "production") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge" && env.NODE_ENV === "production") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
