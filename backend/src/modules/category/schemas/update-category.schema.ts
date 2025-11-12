import { z } from "@hono/zod-openapi";
import { optionalSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";

/**
 * Schema for updating a category.
 *
 * All fields are optional, but at least one field (name, slug, or image) must be provided.
 * Name and slug must be at least 3 characters if provided.
 *
 * @example
 * // Update name only
 * { name: "New Category Name" }
 *
 * // Update slug only
 * { slug: "new-category-slug" }
 *
 * // Update image only
 * { image: File }
 *
 * // Update multiple fields
 * { name: "New Name", slug: "new-slug", image: File }
 *
 * // Remove image
 * { image: null }
 */
export const updateCategorySchema = z
  .object({
    name: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    image: optionalSingleImageSchema(),
  })
  .superRefine(({ name, slug, image }, ctx) => {
    if (name && name.length < 3) {
      ctx.addIssue({
        code: "custom",
        message: "Name must be atleast 3 characters",
        path: ["name"],
      });
    }
    if (slug && slug.length < 3) {
      ctx.addIssue({
        code: "custom",
        message: "Slug must be atleast 3 characters",
        path: ["slug"],
      });
    }

    const hasName =
      name !== null && name !== undefined && name.trim().length > 0;
    const hasImage = image !== null && image !== undefined;
    const hasSlug =
      slug !== null && slug !== undefined && slug.trim().length > 0;

    if (!hasName && !hasImage && !hasSlug) {
      ctx.addIssue({
        code: "custom",
        message: "Change name, slug, or image to update",
      });
    }
  });
