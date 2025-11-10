import { extname, relative, resolve } from "node:path";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";

export const imagesDir = resolve(process.cwd(), "public", "image");

// Allowed image extensions and their MIME types
export const IMAGE_MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
} as const;

/**
 * Sanitizes the file path to prevent directory traversal attacks.
 * Ensures the resolved path is within the allowed directory.
 */
export function sanitizeFilePath(slug: string): string | null {
  const removedPathTraversal = slug.replace(/\.\./g, "").replace(/\/+/g, "/");
  const requestedPath = resolve(imagesDir, removedPathTraversal);

  // Ensure the resolved path is within the images directory
  const relativePath = relative(imagesDir, requestedPath);

  // If the relative path contains '..', it means we're outside the directory
  if (relativePath.startsWith("..") || relativePath.includes("..")) {
    return null;
  }

  return requestedPath;
}

/**
 * Gets the content type for a file based on its extension.
 */
export function getContentType(filename: string): string {
  const extension = extname(filename).toLowerCase();
  return IMAGE_MIME_TYPES[extension] || "application/octet-stream";
}

/**
 * Validates if the file is a supported image type
 */
export function isValidImageType(file: File): boolean {
  const extension = extname(file.name).toLowerCase();
  return extension in IMAGE_MIME_TYPES;
}

/**
 * Generates a unique filename for the image
 */
export function generateUniqueFilename(originalName: string): string {
  const extension = extname(originalName).toLowerCase();
  const uniqueId = nanoid(7); // Generate a 12-character unique ID
  return `${slugify(originalName)}_id_${uniqueId}${extension}`;
}
