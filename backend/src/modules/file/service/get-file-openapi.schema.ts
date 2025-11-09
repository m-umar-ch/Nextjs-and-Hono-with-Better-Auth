import { z } from "@hono/zod-openapi";

/**
 * 4MB
 */
const defaultMaxFileSize = 1024 * 1024 * 4;

export function getSingleImageSchema(
  { maxFileSize = defaultMaxFileSize }: { maxFileSize?: number } = {
    maxFileSize: defaultMaxFileSize,
  }
) {
  const maxMB = Math.floor(maxFileSize / (1024 * 1024));

  return z
    .instanceof(File)
    .refine((file) => file.size < maxFileSize, `Max image size is ${maxMB}MB`)
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/avif",
        ].includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .avif formats are supported"
    )
    .openapi({
      type: "string",
      format: "binary",
    });
}
