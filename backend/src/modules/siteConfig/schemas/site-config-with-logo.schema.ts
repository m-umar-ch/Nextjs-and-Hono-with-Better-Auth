import { z } from "@hono/zod-openapi";
import { fileSchema } from "@/db/schema";
import { SiteConfigSchema } from "../entity/siteConfig.entity";

/**
 * Site configuration schema with logo relation.
 *
 * Used for responses that include the site logo file information.
 */
export const siteConfigWithLogoSchema = SiteConfigSchema.and(
  z.object({
    siteLogo: fileSchema.nullable(),
  })
);
