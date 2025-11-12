import { z } from "@hono/zod-openapi";
import { optionalSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";

/**
 * Schema for creating site configuration.
 *
 * Store name is required. All other fields are optional.
 * Logo can be uploaded as an image file.
 *
 * @example
 * {
 *   storeName: "My Store",
 *   storeAddress: "123 Main St",
 *   storeContactEmail: "contact@store.com",
 *   siteLogo: File
 * }
 */
export const createSiteConfigSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  storeContactEmail: z.email("Invalid email format"),
  siteOwnerEmail: z.email("Invalid email format"),
  storeAddress: z.string().nullable().optional(),
  storeGoogleMapUrl: z.url().nullable().optional(),
  storeGoogleMapIframeUrl: z.url().nullable().optional(),
  facebookUrl: z.url().nullable().optional(),
  instagramUrl: z.url().nullable().optional(),
  linkedinUrl: z.url().nullable().optional(),
  tiktokUrl: z.url().nullable().optional(),
  youtubeUrl: z.url().nullable().optional(),
  storeContactWhatsappNumber: z.string().nullable().optional(),
  footerDescription: z.string().optional(),
  siteLogo: optionalSingleImageSchema(),
});
