import {
  type Hook,
  OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
} from "@hono/zod-openapi";
import type { Context, MiddlewareHandler, Schema } from "hono";
import type { authClient } from "@/modules/auth/service/auth-client";
import { UNPROCESSABLE_ENTITY } from "../http/status-codes";
import { HONO_ERROR } from "../utils/response-utils";

/**
 * Configuration options for creating a router instance
 */
export interface RouterConfig {
  /** Whether to use strict mode for OpenAPI validation (default: false) */
  strict?: boolean;
  /** Custom hook for handling validation errors */
  defaultHook?: Hook<any, any, any, any>;
  /** Whether to include detailed error information in responses (default: true) */
  includeErrorDetails?: boolean;
}

/**
 * Enhanced default hook for handling Zod validation errors
 * Provides standardized error responses with detailed validation information
 */
const createDefaultHook = (
  includeErrorDetails = true
): Hook<any, any, any, any> => {
  return (result, c: Context) => {
    if (!result.success) {
      const requestId = c.get("requestId");

      // Extract detailed validation errors from Zod
      const issues =
        includeErrorDetails && "error" in result && result.error?.issues
          ? result.error.issues.map((issue) => ({
              path: issue.path.join(".") || undefined,
              message: issue.message,
              code: issue.code || undefined,
            }))
          : [{ message: "Validation failed" }];
      const errorResponse = HONO_ERROR(
        "UNPROCESSABLE_ENTITY",
        "Request validation failed",
        {
          issues: issues.length > 0 ? issues : undefined,
          requestId,
          timestamp: true,
        }
      );

      return c.json(errorResponse, UNPROCESSABLE_ENTITY);
    }
  };
};

/**
 * Creates a configured OpenAPI Hono router instance with enhanced error handling
 *
 * @param config - Optional configuration for the router
 * @returns Configured OpenAPIHono instance
 *
 * @example
 * ```typescript
 * // Basic usage
 * const router = createRouter();
 *
 * // With custom configuration
 * const router = createRouter({
 *   strict: true,
 *   includeErrorDetails: false
 * });
 *
 * // With custom hook
 * const router = createRouter({
 *   defaultHook: (result, c) => {
 *     // Custom validation error handling
 *   }
 * });
 * ```
 */

export interface AppBindings {
  Variables: {
    user: typeof authClient.$Infer.Session.user | null;
    session: typeof authClient.$Infer.Session.session | null;
  };
}

/**
 * Bindings where user and session are guaranteed to be non-null
 * (e.g., after requireAuth middleware)
 */
export interface AuthenticatedAppBindings {
  Variables: {
    user: typeof authClient.$Infer.Session.user;
    session: typeof authClient.$Infer.Session.session;
  };
}

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

/**
 * Route handler type for routes with requireAuth middleware
 * User and session are guaranteed to be non-null
 */
export type AuthenticatedRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AuthenticatedAppBindings
>;

export type AppMiddleware = MiddlewareHandler<AppBindings>;

export const createRouter = (config: RouterConfig = {}): AppOpenAPI => {
  const { strict = false, defaultHook, includeErrorDetails = true } = config;

  const hook = defaultHook || createDefaultHook(includeErrorDetails);

  return new OpenAPIHono({
    strict,
    defaultHook: hook,
  });
};
