import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { file } from "@/db/schema";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE, slugify } from "@/lib/utils";
import { deleteImageByIdOrSlug } from "@/modules/file/service/delete-image";
import { moduleTags } from "../../module.tags";
import { category, categorySchema } from "../entity/category.entity";

export const DELETE_Route = createRoute({
  path: "/category/{slug}",
  method: "delete",
  tags: moduleTags.category,
  summary: "Delete a category by slug",
  request: {
    params: z.object({ slug: z.string().min(3) }),
  },
  middleware: [requirePermissions({ category: ["delete"] })],
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
  const { slug: slugParam } = c.req.valid("param");
  const slug = slugify(slugParam);

  const existingCategory = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });

  if (!existingCategory) {
    return HONO_ERROR(c, "NOT_FOUND", "Category not found");
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
    return HONO_ERROR(c, "INTERNAL_SERVER_ERROR", "Failed to delete category");
  }

  // Clean up associated image if it exists
  if (imageSlug) {
    await deleteImageByIdOrSlug(imageSlug, "slug", "after category deletion");
    // Don't fail the request, just log the error
  }

  return HONO_RESPONSE(c, { data: deletedCategory, statusCode: "OK" });
};
