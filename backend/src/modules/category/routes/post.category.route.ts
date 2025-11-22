import { createRoute, z } from "@hono/zod-openapi";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE, slugify } from "@/lib/utils";
import { deleteImageByIdOrSlug } from "@/modules/file/service/delete-image";
import { getSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";
import { saveSingleImage } from "@/modules/file/service/save-single-img";
import { moduleTags } from "../../module.tags";
import { category, categorySchema } from "../entity/category.entity";

export const POST_Route = createRoute({
  path: "/category",
  method: "post",
  tags: moduleTags.category,
  summary: "Create a new category",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            name: z.string().min(3),
            slug: z.string().min(3),
            image: getSingleImageSchema(),
          }),
        },
      },
      required: true,
    },
  },
  middleware: [requirePermissions({ category: ["create"] })],
  responses: {
    [HTTP.CREATED]: APISchema.response({
      data: categorySchema,
      statusCode: "CREATED",
      description: "CREATED - category",
    }),
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const POST_Handler: AuthenticatedRouteHandler<
  typeof POST_Route
> = async (c) => {
  const { image, name, slug: unSlugifiedSlug } = c.req.valid("form");
  const slug = slugify(unSlugifiedSlug);

  const alreadyExists = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });
  if (alreadyExists) {
    return HONO_ERROR(
      c,
      "UNPROCESSABLE_ENTITY",
      "Category slug already exists",
    );
  }

  const imageResponse = await saveSingleImage(image);
  if (!imageResponse.success || !imageResponse.data) {
    HONO_LOGGER.error(`Image upload failed for ${image.name}`, {
      error: imageResponse.error,
    });
    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      `Failed to upload image: ${
        imageResponse.error?.message || "Unknown error"
      }`,
    );
  }

  const highestSortOrderCategory = await db.query.category.findFirst({
    orderBy: desc(category.sortOrder),
    columns: { sortOrder: true },
  });

  const nextSortOrder = highestSortOrderCategory
    ? highestSortOrderCategory.sortOrder + 1
    : 1;

  const [categoryResponse] = await db
    .insert(category)
    .values({
      name,
      slug,
      categoryImgID: imageResponse.data.id,
      sortOrder: nextSortOrder,
    })
    .returning();

  if (!categoryResponse) {
    // Clean up uploaded image if category creation fails
    if (imageResponse.data.slug) {
      await deleteImageByIdOrSlug(
        imageResponse.data.slug,
        "slug",
        "after category creation failure",
      );
    }
    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      "Failed to create category record",
    );
  }

  return HONO_RESPONSE(c, { data: categoryResponse, statusCode: "CREATED" });
};
