import { createRoute, z } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { APISchema, createResponseSchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_ERROR, HONO_RESPONSE, slugify } from "@/lib/utils";
import { AppRouteHandler } from "@/lib/core/create-router";
import { getSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";
import { db } from "@/db";
import { category, categorySchema } from "../entity/category.entity";
import { eq, desc } from "drizzle-orm";
import { saveSingleImage } from "@/modules/file/service/save-single-img";
import { deleteImage } from "@/modules/file/service/delete-image";
import { HONO_LOGGER } from "@/lib/core/hono-logger";

export const POST_Route = createRoute({
  path: "/category",
  method: "post",
  tags: moduleTags.category,
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
  responses: {
    [HTTP.CREATED]: createResponseSchema({
      data: categorySchema,
      statusCode: "CREATED",
      description: "CREATED - category",
    }),
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const POST_Handler: AppRouteHandler<typeof POST_Route> = async (c) => {
  const { image, name, slug: unSlugifiedSlug } = c.req.valid("form");
  const slug = slugify(unSlugifiedSlug);

  const alreadyExists = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });
  if (alreadyExists) {
    return c.json(
      HONO_ERROR("UNPROCESSABLE_ENTITY", "Image Slug already exists"),
      HTTP.UNPROCESSABLE_ENTITY,
    );
  }

  const imageResponse = await saveSingleImage(image);
  if (imageResponse.error) {
    HONO_LOGGER.error(`Image upload failed for ${image.name}`);
    return c.json(
      HONO_ERROR(
        "INTERNAL_SERVER_ERROR",
        `Failed to upload image: ${imageResponse.error.message}`,
      ),
      HTTP.INTERNAL_SERVER_ERROR,
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
    if (imageResponse.data.slug) {
      const deleteResult = await deleteImage(imageResponse.data.slug);
      if (deleteResult.error) {
        HONO_LOGGER.error(
          `Failed to clean up image ${imageResponse.data.slug}:`,
          deleteResult.error,
        );
      }
    }
    return c.json(
      HONO_ERROR("INTERNAL_SERVER_ERROR", "Failed to create category record."),
      HTTP.INTERNAL_SERVER_ERROR,
    );
  }

  return c.json(
    HONO_RESPONSE({ data: categoryResponse, statusCode: "CREATED" }),
    HTTP.CREATED,
  );
};
