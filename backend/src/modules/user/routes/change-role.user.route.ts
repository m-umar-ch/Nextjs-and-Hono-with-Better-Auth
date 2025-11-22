import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { Roles } from "@/modules/auth/service/permissions";
import { moduleTags } from "../../module.tags";
import { UserSchema, user } from "../entity/user.entity";

export const CHANGE_ROLE_Route = createRoute({
  path: "/user/{email}/change-role/{role}",
  method: "post",
  tags: moduleTags.user,
  summary: "Change user role",
  request: {
    params: z.object({
      email: z.email(),
      role: z.enum(Roles),
    }),
  },
  middleware: [requirePermissions({ user: ["change_role"] })],
  responses: {
    [HTTP.OK]: APISchema.response({
      data: UserSchema,
      description: "OK - User role updated successfully",
      statusCode: "OK",
    }),
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const CHANGE_ROLE_Handler: AuthenticatedRouteHandler<
  typeof CHANGE_ROLE_Route
> = async (c) => {
  const { email, role } = c.req.valid("param");

  try {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!existingUser) {
      return HONO_ERROR(c, "NOT_FOUND", "User not found");
    }

    if (existingUser.role === role) {
      return HONO_RESPONSE(c, {
        data: existingUser,
        message: "User role updated successfully",
      });
    }

    const [updatedUser] = await db
      .update(user)
      .set({ role })
      .where(eq(user.email, email))
      .returning();

    if (!updatedUser) {
      return HONO_ERROR(
        c,
        "INTERNAL_SERVER_ERROR",
        "Failed to update user role"
      );
    }

    return HONO_RESPONSE(c, {
      data: updatedUser,
      message: "User role updated successfully",
    });
  } catch (error) {
    HONO_LOGGER.error("Failed to update user role", {
      error,
      email,
      requestedRole: role,
      userId: c.var.user.id,
    });

    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      "Failed to update user role. Please try again.",
      { error }
    );
  }
};
