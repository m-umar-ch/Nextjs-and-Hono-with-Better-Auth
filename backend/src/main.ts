import { initializeSentry } from "./lib/core/sentry";

initializeSentry();

import { serve } from "bun";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import env from "./env";
import { createRouter } from "./lib/core/create-router";
import { logger as HonoLogger } from "./lib/core/hono-logger";
import configureOpenAPI from "./lib/core/open-api.config";
import { HTTP } from "./lib/http/status-codes";
import { authMiddleware } from "./lib/middlewares/auth.middleware";
import { Auth_CORS_Middleware } from "./lib/middlewares/cors.middleware";
import { faviconMiddleware } from "./lib/middlewares/favicon-middleware";
import { createNotFoundHandler } from "./lib/middlewares/not-found-middleware";
import { onError } from "./lib/middlewares/on-error.middleware";
import {
  sentryErrorHandler,
  sentryMiddleware,
} from "./lib/middlewares/sentry.middleware";
import { APISchema } from "./lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "./lib/utils";
import { auth } from "./modules/auth/service/auth";
import { categoryController } from "./modules/category/controller/category.controller";
import { fileController } from "./modules/file/controller/file.controller";
import { mailerController } from "./modules/mailer/controller/mailer.controller";

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
  },
  (c) => {
    if (!c.var.session) {
      return c.json(HONO_ERROR("UNAUTHORIZED"), HTTP.UNAUTHORIZED);
    }

    return c.json(HONO_RESPONSE({ message: "Yollo Bozo" }), HTTP.OK);
  }
);

// app.openapi(
//   {
//     path: "/static",
//     method: "get",
//     tags: ["Base"],
//     responses: {
//       [HTTP.NO_CONTENT]: APISchema.NO_CONTENT,
//       // [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
//       // [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
//     },
//   },
//   serveStatic({
//     onNotFound: (path, c) => {
//       console.log(`${path} is not found, you access ${c.req.path}`);
//     },
//     onFound(path, c) {
//       console.log(`${path} is found, you access ${c.req.path}`);
//     },
//     path: "./public/image/m_umar_ch.png",
//   })
//   // return c.json(HONO_RESPONSE({ message: "Yollo Bozo" }), HTTP.OK);
// );

// app.get(
//   "/static",
//   serveStatic({
//     onNotFound: (path, c) => {
//       console.log(`${path} is not found, you access ${c.req.path}`);
//     },
//     onFound(path, c) {
//       console.log(`${path} is found, you access ${c.req.path}`);
//     },
//     path: "./public/image/m_umar_ch.png",
//   })
// );

// app.use("/img", (c) => {
//   serveStatic({ path: "./public/image/m_umar_ch.png" });
//   return c.json({}, 200);
// });

const controllers = [
  mailerController,
  categoryController,
  fileController,
] as const;

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
