import { createRoute, z } from "@hono/zod-openapi";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";
import { category } from "../entity/category.entity";

export const SORT_Route = createRoute({
  path: "/category/sort",
  method: "post",
  tags: moduleTags.category,
  summary: "Update category sort order",
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
              }),
            )
            .min(1, "At least one category must be provided"),
        },
      },
      required: true,
    },
  },
  middleware: [requirePermissions({ category: ["update"] })],
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
    return HONO_ERROR(
      c,
      "BAD_REQUEST",
      `Invalid category IDs: ${invalidIds.join(", ")}`,
    );
  }

  try {
    await db.transaction(async (tx) => {
      await Promise.all(
        categoriesToUpdate.map((item) =>
          tx
            .update(category)
            .set({ sortOrder: item.sortOrder })
            .where(eq(category.id, item.id)),
        ),
      );
    });

    return HONO_RESPONSE(c, {
      message: "Category sort order updated successfully",
    });
  } catch (error) {
    HONO_LOGGER.error("Failed to update category sort order", {
      error,
      categoryIds,
    });
    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      "Failed to update category sort order",
    );
  }
};
