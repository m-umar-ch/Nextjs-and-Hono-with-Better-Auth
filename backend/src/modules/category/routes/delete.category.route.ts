import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { file } from "@/db/schema";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requireAuth } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE, slugify } from "@/lib/utils";
import { auth } from "@/modules/auth/service/auth";
import { deleteImage } from "@/modules/file/service/delete-image";
import { moduleTags } from "../../module.tags";
import { category, categorySchema } from "../entity/category.entity";

export const DELETE_Route = createRoute({
  path: "/category/{slug}",
  method: "delete",
  tags: moduleTags.category,
  request: {
    params: z.object({ slug: z.string().min(3) }),
  },
  middleware: [requireAuth],
  responses: {
    [HTTP.OK]: APISchema.response({
      data: categorySchema,
      statusCode: "OK",
      description: "OK - Category deleted successfully",
    }),
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const DELETE_Handler: AuthenticatedRouteHandler<
  typeof DELETE_Route
> = async (c) => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: c.var.user.id,
      permission: { category: ["delete"] },
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

  const { slug: slugParam } = c.req.valid("param");
  const slug = slugify(slugParam);

  const existingCategory = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });

  if (!existingCategory) {
    return c.json(
      HONO_ERROR("NOT_FOUND", "Category not found"),
      HTTP.NOT_FOUND
    );
  }

  let imageSlug: string | null = null;
  if (existingCategory.categoryImgID) {
    const categoryImage = await db.query.file.findFirst({
      where: eq(file.id, existingCategory.categoryImgID),
      columns: { slug: true },
    });
    if (categoryImage?.slug) {
      imageSlug = categoryImage.slug;
    }
  }

  // Delete the category
  const [deletedCategory] = await db
    .delete(category)
    .where(eq(category.id, existingCategory.id))
    .returning();

  if (!deletedCategory) {
    return c.json(
      HONO_ERROR("INTERNAL_SERVER_ERROR", "Failed to delete category"),
      HTTP.INTERNAL_SERVER_ERROR
    );
  }

  // Clean up associated image if it exists
  if (imageSlug) {
    const deleteResult = await deleteImage(imageSlug);
    if (!deleteResult.success) {
      HONO_LOGGER.error(
        `Failed to clean up image ${imageSlug} after category deletion`,
        { error: deleteResult.error }
      );
      // Don't fail the request, just log the error
    }
  }

  return c.json(
    HONO_RESPONSE({ data: deletedCategory, statusCode: "OK" }),
    HTTP.OK
  );
};
