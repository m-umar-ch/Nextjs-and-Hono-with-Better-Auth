import { unlink } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { file } from "@/db/schema";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { tryCatch } from "@/lib/utils";
import { sanitizeFilePath } from "./file-utils";

/**
 * Deletes an image file from the filesystem.
 *
 * @param imageSlug - The slug/filename of the image to delete
 * @returns A Result indicating success or failure
 *
 * @example
 * ```ts
 * const result = await deleteImage("image_slug_id_123.png");
 * if (result.error) {
 *   console.error("Failed to delete image:", result.error);
 * }
 * ```
 */
async function deleteImage(imageSlug: string) {
  // Sanitize the file path to prevent directory traversal attacks
  const filePath = sanitizeFilePath(imageSlug);
  if (!filePath) {
    return {
      data: null,
      error: new Error("Invalid file path"),
      success: false,
    } as const;
  }

  const { error } = await tryCatch(unlink(filePath));

  if (error) {
    return {
      data: null,
      error: new Error(`Failed to delete image: ${error}`),
      success: false,
    } as const;
  }

  return {
    data: { deleted: true },
    error: null,
    success: true,
  } as const;
}

/**
 * Deletes an image file by either its database ID (UUID) or slug.
 * Errors are logged but don't fail the request (useful for cleanup operations).
 *
 * @param identifier - Either a file UUID or image slug/filename
 * @param type - Explicitly specify whether identifier is "id" or "slug"
 * @param context - Optional context string for error logging (e.g., "after category creation failure")
 * @returns A Result indicating success or failure (errors are logged, not thrown)
 *
 * @example
 * ```ts
 * // With file ID (UUID)
 * await deleteImageByIdOrSlug(siteLogoId, "id", "after site config creation failure");
 *
 * // With slug
 * await deleteImageByIdOrSlug(oldLogoSlug, "slug", "after site config update");
 * ```
 */
export async function deleteImageByIdOrSlug(
  identifier: string,
  type: "id" | "slug",
  context?: string
) {
  if (!identifier) {
    if (context) {
      HONO_LOGGER.warn(
        `Skipping image cleanup: Identifier is required ${context}`
      );
    }
    return {
      data: { deleted: false },
      error: null,
      success: true,
    } as const;
  }

  let imageSlug: string;

  if (type === "id") {
    // It's a UUID - fetch the file record to get the slug
    const fileRecord = await db.query.file.findFirst({
      where: eq(file.id, identifier),
      columns: { slug: true },
    });

    if (!fileRecord?.slug) {
      const errorMsg = `File with ID ${identifier} not found${
        context ? ` ${context}` : ""
      }`;
      if (context) {
        HONO_LOGGER.warn(errorMsg);
      }
      // Don't fail - just return success since file doesn't exist anyway
      return {
        data: { deleted: false },
        error: null,
        success: true,
      } as const;
    }

    imageSlug = fileRecord.slug;
  } else {
    // It's a slug - use it directly
    imageSlug = identifier;
  }

  const result = await deleteImage(imageSlug);

  if (!result.success) {
    if (context) {
      HONO_LOGGER.error(`Failed to clean up image ${imageSlug} ${context}`, {
        error: result.error,
        identifier,
        type,
      });
    }
    // Don't fail - return success even if cleanup failed
    return {
      data: { deleted: false },
      error: null,
      success: true,
    } as const;
  }

  return result;
}
