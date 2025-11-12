import { z } from "@hono/zod-openapi";
import { optionalSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";

/**
 * Schema for updating site configuration.
 *
 * All fields are optional, but at least one field must be provided for update.
 * Store name must be at least 3 characters if provided.
 *
 * @example
 * // Update store name only
 * { storeName: "New Store Name" }
 *
 * // Update multiple fields
 * { storeName: "New Name", storeAddress: "New Address", siteLogo: File }
 *
 * // Remove logo
 * { siteLogo: null }
 */
export const updateSiteConfigSchema = z
  .object({
    storeName: z.string().min(3).optional(),
    storeAddress: z.string().nullable().optional(),
    storeGoogleMapUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    storeGoogleMapIframeUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    facebookUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    instagramUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    linkedinUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    tiktokUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    youtubeUrl: z
      .string()
      .refine(
        (val) =>
          val === null ||
          val === undefined ||
          val === "#" ||
          z.string().url().safeParse(val).success,
        "Invalid URL format"
      )
      .nullable()
      .optional(),
    storeContactEmail: z
      .string()
      .email("Invalid email format")
      .nullable()
      .optional(),
    storeContactWhatsappNumber: z.string().nullable().optional(),
    footerDescription: z.string().nullable().optional(),
    siteOwnerEmail: z
      .string()
      .email("Invalid email format")
      .nullable()
      .optional(),
    siteLogo: optionalSingleImageSchema(),
  })
  .superRefine((data, ctx) => {
    // Check if at least one field is provided
    const hasAnyField = Object.values(data).some(
      (value) => value !== null && value !== undefined
    );

    if (!hasAnyField) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field must be provided for update",
      });
    }

    // Validate store name length if provided
    if (data.storeName && data.storeName.length < 3) {
      ctx.addIssue({
        code: "custom",
        message: "Store name must be at least 3 characters",
        path: ["storeName"],
      });
    }
  });
