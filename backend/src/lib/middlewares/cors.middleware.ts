import env from "@/env";
import { cors } from "hono/cors";

export const CORS_Middleware = cors({
  origin:
    env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://localhost:9999"]
      : [env.BETTER_AUTH_URL],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
});

export const Auth_CORS_Middleware = cors({
  origin: ["http://localhost:3000", "http://localhost:9999"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
});
