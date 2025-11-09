import { unlink } from "fs/promises";
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
export async function deleteImage(imageSlug: string) {
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
