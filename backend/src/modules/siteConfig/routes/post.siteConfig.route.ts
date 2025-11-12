import { createRoute } from "@hono/zod-openapi";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requireAuth } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { auth } from "@/modules/auth/service/auth";
import { deleteImageByIdOrSlug } from "@/modules/file/service/delete-image";
import { saveSingleImage } from "@/modules/file/service/save-single-img";
import { moduleTags } from "../../module.tags";
import { SiteConfigSchema, siteConfig } from "../entity/siteConfig.entity";
import { createSiteConfigSchema } from "../schemas/create-site-config.schema";

export const POST_Route = createRoute({
  path: "/site-config",
  method: "post",
  tags: moduleTags.siteConfig,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: createSiteConfigSchema,
        },
      },
      required: true,
    },
  },
  middleware: [requireAuth],
  responses: {
    [HTTP.CREATED]: APISchema.response({
      data: SiteConfigSchema,
      statusCode: "CREATED",
      description: "CREATED - Site configuration created successfully",
    }),
    [HTTP.CONFLICT]: APISchema.CONFLICT,
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const POST_Handler: AuthenticatedRouteHandler<
  typeof POST_Route
> = async (c) => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: c.var.user.id,
      permission: { siteConfig: ["create"] },
    },
  });

  if (!hasPermission.success) {
    return c.json(
      HONO_ERROR(
        "FORBIDDEN",
        "You don't have permission to perform this action"
      ),
      HTTP.FORBIDDEN
    );
  }

  // Check if site config already exists (singleton)
  const existingConfig = await db.query.siteConfig.findFirst();
  if (existingConfig) {
    return c.json(
      HONO_ERROR("CONFLICT", "Site configuration already exists"),
      HTTP.CONFLICT
    );
  }

  const formData = c.req.valid("form");
  const {
    storeName,
    storeContactEmail,
    siteOwnerEmail,
    storeAddress,
    storeGoogleMapUrl,
    storeGoogleMapIframeUrl,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    tiktokUrl,
    youtubeUrl,
    storeContactWhatsappNumber,
    footerDescription,
    siteLogo,
  } = formData;

  let siteLogoId: string | null = null;

  // Handle logo upload if provided
  if (siteLogo && siteLogo instanceof File) {
    const imageResponse = await saveSingleImage(siteLogo);
    if (!imageResponse.success || !imageResponse.data) {
      HONO_LOGGER.error(`Image upload failed for ${siteLogo.name}`, {
        error: imageResponse.error,
      });
      return c.json(
        HONO_ERROR(
          "INTERNAL_SERVER_ERROR",
          `Failed to upload logo: ${
            imageResponse.error?.message || "Unknown error"
          }`
        ),
        HTTP.INTERNAL_SERVER_ERROR
      );
    }
    siteLogoId = imageResponse.data.id;
  }

  try {
    const [newConfig] = await db
      .insert(siteConfig)
      .values({
        storeName,
        siteOwnerEmail: siteOwnerEmail,
        storeContactEmail: storeContactEmail,
        storeAddress: storeAddress || null,
        storeGoogleMapUrl: storeGoogleMapUrl || "#",
        storeGoogleMapIframeUrl: storeGoogleMapIframeUrl || "#",
        facebookUrl: facebookUrl || "#",
        instagramUrl: instagramUrl || "#",
        linkedinUrl: linkedinUrl || "#",
        tiktokUrl: tiktokUrl || "#",
        youtubeUrl: youtubeUrl || "#",
        storeContactWhatsappNumber: storeContactWhatsappNumber || null,
        footerDescription: footerDescription || null,
        siteLogoId,
      })
      .returning();

    if (!newConfig) {
      // Clean up uploaded logo if config creation fails
      if (siteLogoId) {
        await deleteImageByIdOrSlug(
          siteLogoId,
          "id",
          "after site config creation failure"
        );
      }
      return c.json(
        HONO_ERROR(
          "INTERNAL_SERVER_ERROR",
          "Failed to create site configuration"
        ),
        HTTP.INTERNAL_SERVER_ERROR
      );
    }

    return c.json(
      HONO_RESPONSE({
        data: newConfig,
        statusCode: "CREATED",
        message: "Site configuration created successfully",
      }),
      HTTP.CREATED
    );
  } catch (error) {
    // Clean up uploaded logo if config creation fails
    if (siteLogoId) {
      await deleteImageByIdOrSlug(
        siteLogoId,
        "id",
        "after site config creation failure"
      );
    }
    HONO_LOGGER.error("Failed to create site configuration", { error });
    return c.json(
      HONO_ERROR(
        "INTERNAL_SERVER_ERROR",
        "Failed to create site configuration"
      ),
      HTTP.INTERNAL_SERVER_ERROR
    );
  }
};
