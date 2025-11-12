import { createRoute, z } from "@hono/zod-openapi";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requireAuth } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { auth } from "@/modules/auth/service/auth";
import { moduleTags } from "../../module.tags";
import { category } from "../entity/category.entity";

export const SORT_Route = createRoute({
  path: "/category/sort",
  method: "post",
  tags: moduleTags.category,
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .array(
              z.object({
                id: z.uuid("Invalid category ID format"),
                sortOrder: z.coerce
                  .number()
                  .int()
                  .min(0, "Sort order must be non-negative"),
              })
            )
            .min(1, "At least one category must be provided"),
        },
      },
      required: true,
    },
  },
  middleware: [requireAuth],
  responses: {
    [HTTP.OK]: APISchema.OK,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const SORT_Handler: AuthenticatedRouteHandler<
  typeof SORT_Route
> = async (c) => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: c.var.user.id,
      permission: { category: ["update"] },
    },
  });

  if (!hasPermission.success) {
    return c.json(
      HONO_ERROR(
        "FORBIDDEN",
        "You don't have permission to perform this action"
      ),
      HTTP.FORBIDDEN
    );
  }

  const categoriesToUpdate = c.req.valid("json");

  // Validate that all category IDs exist
  const categoryIds = categoriesToUpdate.map((item) => item.id);
  const existingCategories = await db.query.category.findMany({
    where: inArray(category.id, categoryIds),
    columns: { id: true },
  });

  const existingIds = new Set(existingCategories.map((cat) => cat.id));
  const invalidIds = categoryIds.filter((id) => !existingIds.has(id));

  if (invalidIds.length > 0) {
    return c.json(
      HONO_ERROR(
        "BAD_REQUEST",
        `Invalid category IDs: ${invalidIds.join(", ")}`
      ),
      HTTP.BAD_REQUEST
    );
  }

  try {
    await db.transaction(async (tx) => {
      await Promise.all(
        categoriesToUpdate.map((item) =>
          tx
            .update(category)
            .set({ sortOrder: item.sortOrder })
            .where(eq(category.id, item.id))
        )
      );
    });

    return c.json(
      HONO_RESPONSE({
        message: "Category sort order updated successfully",
      }),
      HTTP.OK
    );
  } catch (error) {
    HONO_LOGGER.error("Failed to update category sort order", {
      error,
      categoryIds,
    });
    return c.json(
      HONO_ERROR(
        "INTERNAL_SERVER_ERROR",
        "Failed to update category sort order"
      ),
      HTTP.INTERNAL_SERVER_ERROR
    );
  }
};
