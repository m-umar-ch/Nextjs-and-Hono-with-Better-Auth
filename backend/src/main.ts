import { initializeSentry } from "./lib/core/sentry";
initializeSentry();

import { createRouter } from "./lib/core/create-router";
import { requestId } from "hono/request-id";
import { logger } from "hono/logger";
import { logger as HonoLogger } from "./lib/core/hono-logger";
import { onError } from "./lib/middlewares/on-error.middleware";
import {
  sentryMiddleware,
  sentryErrorHandler,
} from "./lib/middlewares/sentry.middleware";
import configureOpenAPI from "./lib/core/open-api.config";
import env from "./env";
import { serve } from "bun";
import { createNotFoundHandler } from "./lib/middlewares/not-found-middleware";
import { faviconMiddleware } from "./lib/middlewares/favicon-middleware";
import { HTTP } from "./lib/http/status-codes";
import { APISchema } from "./lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "./lib/utils";
import { mailerController } from "./modules/mailer/controller/mailer.controller";
import { auth } from "./modules/auth/service/auth";
import { authMiddleware } from "./lib/middlewares/auth.middleware";
import { Auth_CORS_Middleware } from "./lib/middlewares/cors.middleware";

const createApp = () => {
  const app = createRouter().basePath("/api");

  app.use(requestId()).use(faviconMiddleware("📝"));
  app.use(logger(HonoLogger));

  // app.use("*", CORS_Middleware);

  app.use("/better-auth/*", Auth_CORS_Middleware);
  app.use("*", Auth_CORS_Middleware);

  // Sentry middleware for request tracking
  app.use("*", sentryMiddleware);

  app.use("*", authMiddleware);

  app.notFound(createNotFoundHandler());
  app.onError(sentryErrorHandler(onError));

  return app;
};

export const app = createApp();
configureOpenAPI(app);

// Mount Better Auth handler
app.on(["POST", "GET"], "/better-auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// base route
app.openapi(
  {
    path: "/",
    method: "get",
    tags: ["Base"],
    responses: {
      [HTTP.OK]: APISchema.OK,
      [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
      [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    },
    middleware: [],
  },
  (c) => {
    if (!c.var.session) {
      return c.json(HONO_ERROR("UNAUTHORIZED"), HTTP.UNAUTHORIZED);
    }

    return c.json(HONO_RESPONSE({ message: "Yollo Bozo" }), HTTP.OK);
  }
);

const controllers = [mailerController] as const;

for (const controller of controllers) {
  app.route("/", controller);
}

serve({
  port: env.PORT,
  fetch: app.fetch,
  // tls: {}, // for certbot certificate files
});

HonoLogger(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
HonoLogger(
  `📚 Scalar API documentation available at: http://localhost:${env.PORT}/api/reference`
);

// export type AppType = (typeof controllers)[number];
// export const client = hc<AppType>("http://localhost:8787/");
/**
 * const requestId = c.get("requestId")
 */
