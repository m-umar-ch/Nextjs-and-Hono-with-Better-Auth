import { resolve } from "path";
import { mkdir, unlink } from "fs/promises";
import { db } from "@/db";
import { file } from "@/modules/file/entity/file.entity";
import { tryCatch } from "@/lib/utils";
import { eq } from "drizzle-orm";
import {
  generateUniqueFilename,
  imagesDir,
  isValidImageType,
} from "./file-utils";

/**
 * Saves a single image file to disk and creates a database record.
 *
 * @param img - The File object to save
 * @returns A Result containing the file record or an error
 *
 * @example
 * ```ts
 * const result = await saveSingleImage(file);
 * if (result.success) {
 *   console.log("File saved:", result.data.slug);
 * } else {
 *   console.error("Error:", result.error);
 * }
 * ```
 */
export async function saveSingleImage(img: File, customImgSlug?: string) {
  // Validate file type
  if (!isValidImageType(img)) {
    return {
      data: null,
      error: new Error("Unsupported image format"),
      success: false,
    } as const;
  }

  const filename = generateUniqueFilename(customImgSlug || img.name);
  const filePath = resolve(imagesDir, filename);

  // Ensure images directory exists
  const { error: mkdirError } = await tryCatch(
    mkdir(imagesDir, { recursive: true })
  );
  if (mkdirError) {
    return {
      data: null,
      error: new Error(`Failed to create images directory: ${mkdirError}`),
      success: false,
    } as const;
  }

  // Save file to disk using Bun's file API
  const { error: writeError } = await tryCatch(Bun.write(filePath, img));
  if (writeError) {
    return {
      data: null,
      error: new Error(`Failed to save file: ${writeError}`),
      success: false,
    } as const;
  }

  // Check if slug already exists (shouldn't happen with nanoid, but safety check)
  const { data: existingFile } = await tryCatch(
    db.query.file.findFirst({
      where: eq(file.slug, filename),
    })
  );

  if (existingFile) {
    // If slug exists, generate a new one (very unlikely with nanoid)
    const newFilename = generateUniqueFilename(customImgSlug || img.name);
    const newFilePath = resolve(imagesDir, newFilename);

    // Move the file to the new filename
    const { error: renameError } = await tryCatch(Bun.write(newFilePath, img));

    if (renameError) {
      // Clean up the original file if rename fails
      const fileExists = await Bun.file(filePath).exists();
      if (fileExists) {
        await tryCatch(unlink(filePath));
      }
      return {
        data: null,
        error: new Error(`Failed to rename file: ${renameError}`),
        success: false,
      } as const;
    }

    // Delete the old file
    await tryCatch(unlink(filePath));

    // Insert with new filename
    const { data: fileRecord, error: insertError } = await tryCatch(
      db.insert(file).values({ slug: newFilename }).returning()
    );

    if (insertError || !fileRecord?.[0]) {
      // Clean up file if database insert fails
      await tryCatch(unlink(newFilePath));
      return {
        data: null,
        error: new Error(`Failed to create database record: ${insertError}`),
        success: false,
      } as const;
    }

    return {
      data: fileRecord[0],
      error: null,
      success: true,
    } as const;
  }

  // Insert file record into database
  const { data: fileRecord, error: insertError } = await tryCatch(
    db.insert(file).values({ slug: filename }).returning()
  );

  if (insertError || !fileRecord?.[0]) {
    // Clean up file if database insert fails
    await tryCatch(unlink(filePath));
    return {
      data: null,
      error: new Error(`Failed to create database record: ${insertError}`),
      success: false,
    } as const;
  }

  return {
    data: fileRecord[0],
    error: null,
    success: true,
  } as const;
}
