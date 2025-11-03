import { cors } from "hono/cors";

export const Auth_CORS_Middleware = cors({
  origin: ["http://localhost:3000", "http://localhost:9999"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
});
