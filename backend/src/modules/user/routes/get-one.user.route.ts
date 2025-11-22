import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { auth } from "@/modules/auth/service/auth";
import { moduleTags } from "../../module.tags";
import { UserSchema, user } from "../entity/user.entity";

export const GET_ONE_Route = createRoute({
  path: "/user/{email}",
  method: "get",
  tags: moduleTags.user,
  summary: "Get a single user by email",
  request: {
    params: z.object({
      email: z.email(),
    }),
  },
  middleware: [requirePermissions({ user: ["read"] })],
  responses: {
    [HTTP.OK]: APISchema.response({
      data: UserSchema,
      description: "OK - User retrieved successfully",
      statusCode: "OK",
    }),
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const GET_ONE_Handler: AuthenticatedRouteHandler<
  typeof GET_ONE_Route
> = async (c) => {
  const { email } = c.req.valid("param");

  try {
    const { success: canListUsers } = await auth.api.userHasPermission({
      body: { userId: c.var.user.id, permissions: { user: ["list"] } },
    });

    const isOwnUser = email === c.var.user.email;

    if (!canListUsers && !isOwnUser) {
      return HONO_ERROR(
        c,
        "FORBIDDEN",
        "You don't have permission to view this user"
      );
    }

    const userResponse = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userResponse) {
      return HONO_ERROR(c, "NOT_FOUND", "User not found");
    }

    return HONO_RESPONSE(c, { data: userResponse });
  } catch (error) {
    HONO_LOGGER.error("Failed to retrieve user", {
      error,
      email,
      userId: c.var.user.id,
    });

    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      "Failed to retrieve user. Please try again.",
      { error }
    );
  }
};
