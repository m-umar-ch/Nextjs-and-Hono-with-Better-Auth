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
import { saveSingleImage } from "@/modules/file/service/save-single-img";
import { moduleTags } from "../../module.tags";
import { category, categorySchema } from "../entity/category.entity";
import { updateCategorySchema } from "../schemas/update-category.schema";

export const PATCH_Route = createRoute({
  path: "/category/{slug}",
  method: "patch",
  tags: moduleTags.category,
  request: {
    params: z.object({ slug: z.string().min(3) }),
    body: {
      content: {
        "multipart/form-data": {
          schema: updateCategorySchema,
        },
      },
      required: true,
    },
  },
  middleware: [requireAuth],
  responses: {
    [HTTP.OK]: APISchema.response({
      data: categorySchema,
      statusCode: "OK",
      description: "OK - Category updated successfully",
    }),
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const PATCH_Handler: AuthenticatedRouteHandler<
  typeof PATCH_Route
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

  const { slug: currentSlugParam } = c.req.valid("param");
  const currentSlug = slugify(currentSlugParam);

  const { slug: newSlugUnSlugified, name, image } = c.req.valid("form");
  const newSlug = newSlugUnSlugified ? slugify(newSlugUnSlugified) : null;

  // confirm current slug exists
  const existingCategory = await db.query.category.findFirst({
    where: eq(category.slug, currentSlug),
  });

  if (!existingCategory) {
    return c.json(
      HONO_ERROR("NOT_FOUND", "Category not found"),
      HTTP.NOT_FOUND
    );
  }

  const updateData: {
    name?: string;
    slug?: string;
    categoryImgID?: string | null;
  } = {};

  if (newSlug && newSlug !== currentSlug) {
    const slugExists = await db.query.category.findFirst({
      where: eq(category.slug, newSlug),
    });

    if (slugExists) {
      return c.json(
        HONO_ERROR("UNPROCESSABLE_ENTITY", "Category slug already exists"),
        HTTP.UNPROCESSABLE_ENTITY
      );
    }

    updateData.slug = newSlug;
  }

  let oldImageSlug: string | null = null;

  // Check if image is being explicitly set to null (to remove it)
  if (image === null) {
    // Get old image slug for cleanup before removing
    if (existingCategory.categoryImgID) {
      const oldImage = await db.query.file.findFirst({
        where: eq(file.id, existingCategory.categoryImgID),
        columns: { slug: true },
      });
      if (oldImage?.slug) {
        oldImageSlug = oldImage.slug;
      }
    }
    updateData.categoryImgID = null;
  } else if (image && image instanceof File) {
    // Get old image slug for cleanup
    if (existingCategory.categoryImgID) {
      const oldImage = await db.query.file.findFirst({
        where: eq(file.id, existingCategory.categoryImgID),
        columns: { slug: true },
      });
      if (oldImage?.slug) {
        oldImageSlug = oldImage.slug;
      }
    }

    // Save new image
    const imageResponse = await saveSingleImage(image);
    if (!imageResponse.success || !imageResponse.data) {
      HONO_LOGGER.error(`Image upload failed for ${image.name}`, {
        error: imageResponse.error,
      });
      return c.json(
        HONO_ERROR(
          "INTERNAL_SERVER_ERROR",
          `Failed to upload image: ${
            imageResponse.error?.message || "Unknown error"
          }`
        ),
        HTTP.INTERNAL_SERVER_ERROR
      );
    }

    updateData.categoryImgID = imageResponse.data.id;
  }

  // Handle name update if provided (not null and not empty)
  if (name !== null && name !== undefined && name.trim().length > 0) {
    updateData.name = name.trim();
  }

  // Ensure at least one field is being updated
  if (Object.keys(updateData).length === 0) {
    return c.json(
      HONO_ERROR(
        "BAD_REQUEST",
        "At least one field (name, slug, or image) must be provided for update"
      ),
      HTTP.BAD_REQUEST
    );
  }

  const [updatedCategory] = await db
    .update(category)
    .set(updateData)
    .where(eq(category.id, existingCategory.id))
    .returning();

  if (!updatedCategory) {
    // If update failed and we uploaded a new image, clean it up
    if (image && image instanceof File && updateData.categoryImgID) {
      const imageToDelete = await db.query.file.findFirst({
        where: eq(file.id, updateData.categoryImgID),
        columns: { slug: true },
      });
      if (imageToDelete?.slug) {
        const deleteResult = await deleteImage(imageToDelete.slug);
        if (!deleteResult.success) {
          HONO_LOGGER.error(
            `Failed to clean up new image ${imageToDelete.slug} after category update failure`,
            { error: deleteResult.error }
          );
        }
      }
    }
    return c.json(
      HONO_ERROR("INTERNAL_SERVER_ERROR", "Failed to update category"),
      HTTP.INTERNAL_SERVER_ERROR
    );
  }

  // Clean up old image if it was replaced or removed
  if (oldImageSlug) {
    const deleteResult = await deleteImage(oldImageSlug);
    if (!deleteResult.success) {
      HONO_LOGGER.error(
        `Failed to clean up old image ${oldImageSlug} after category update`,
        { error: deleteResult.error }
      );
      // Don't fail the request, just log the error
    }
  }

  return c.json(
    HONO_RESPONSE({ data: updatedCategory, statusCode: "OK" }),
    HTTP.OK
  );
};
