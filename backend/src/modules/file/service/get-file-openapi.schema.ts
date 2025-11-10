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

export function optionalSingleImageSchema(
  { maxFileSize = defaultMaxFileSize }: { maxFileSize?: number } = {
    maxFileSize: defaultMaxFileSize,
  }
) {
  const maxMB = Math.floor(maxFileSize / (1024 * 1024));

  return z
    .any()
    .transform((file, ctx) => {
      if (!file) return null;

      if (!(file instanceof File)) {
        ctx.addIssue({
          code: "custom",
          message: "Expected a File",
          path: ["image"],
        });
      }

      if (file.size > maxFileSize) {
        ctx.addIssue({
          code: "custom",
          message: `Max image size is ${maxMB}MB`,
          path: ["image"],
        });
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: "custom",
          message:
            "Only .jpg, .jpeg, .png, .webp and .avif formats are supported",
          path: ["image"],
        });
      }

      return file;
    })
    .nullable()
    .optional()
    .openapi({
      type: "string",
      format: "binary",
    });
}
