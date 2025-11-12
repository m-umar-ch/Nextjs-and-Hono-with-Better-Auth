import { createRoute } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { file } from "@/db/schema";
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
import { updateSiteConfigSchema } from "../schemas/update-site-config.schema";

export const PATCH_Route = createRoute({
  path: "/site-config",
  method: "patch",
  tags: moduleTags.siteConfig,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: updateSiteConfigSchema,
        },
      },
      required: true,
    },
  },
  middleware: [requireAuth],
  responses: {
    [HTTP.OK]: APISchema.response({
      data: SiteConfigSchema,
      statusCode: "OK",
      description: "OK - Site configuration updated successfully",
    }),
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const PATCH_Handler: AuthenticatedRouteHandler<
  typeof PATCH_Route
> = async (c) => {
  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: c.var.user.id,
      permission: { siteConfig: ["update"] },
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

  // Get existing site config (singleton)
  const existingConfig = await db.query.siteConfig.findFirst();
  if (!existingConfig) {
    return c.json(
      HONO_ERROR("NOT_FOUND", "Site configuration not found"),
      HTTP.NOT_FOUND
    );
  }

  const formData = c.req.valid("form");
  const {
    storeName,
    storeAddress,
    storeGoogleMapUrl,
    storeGoogleMapIframeUrl,
    facebookUrl,
    instagramUrl,
    linkedinUrl,
    tiktokUrl,
    youtubeUrl,
    storeContactEmail,
    storeContactWhatsappNumber,
    footerDescription,
    siteOwnerEmail,
    siteLogo,
  } = formData;

  const updateData: {
    storeName?: string;
    storeAddress?: string | null;
    storeGoogleMapUrl?: string;
    storeGoogleMapIframeUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    storeContactEmail?: string;
    storeContactWhatsappNumber?: string | null;
    footerDescription?: string | null;
    siteOwnerEmail?: string;
    siteLogoId?: string | null;
  } = {};

  let oldLogoSlug: string | null = null;

  // Handle logo update/removal
  if (siteLogo === null) {
    // Explicitly removing logo
    if (existingConfig.siteLogoId) {
      const oldLogo = await db.query.file.findFirst({
        where: eq(file.id, existingConfig.siteLogoId),
        columns: { slug: true },
      });
      if (oldLogo?.slug) {
        oldLogoSlug = oldLogo.slug;
      }
    }
    updateData.siteLogoId = null;
  } else if (siteLogo && siteLogo instanceof File) {
    // Updating with a new logo
    if (existingConfig.siteLogoId) {
      const oldLogo = await db.query.file.findFirst({
        where: eq(file.id, existingConfig.siteLogoId),
        columns: { slug: true },
      });
      if (oldLogo?.slug) {
        oldLogoSlug = oldLogo.slug;
      }
    }

    const imageResponse = await saveSingleImage(siteLogo);
    if (!imageResponse.success || !imageResponse.data) {
      HONO_LOGGER.error(`Logo upload failed for ${siteLogo.name}`, {
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
    updateData.siteLogoId = imageResponse.data.id;
  }

  // Handle other field updates
  if (storeName !== undefined) {
    updateData.storeName = storeName;
  }
  if (storeAddress !== undefined) {
    updateData.storeAddress = storeAddress;
  }
  if (storeGoogleMapUrl !== undefined) {
    updateData.storeGoogleMapUrl = storeGoogleMapUrl || "#";
  }
  if (storeGoogleMapIframeUrl !== undefined) {
    updateData.storeGoogleMapIframeUrl = storeGoogleMapIframeUrl || "#";
  }
  if (facebookUrl !== undefined) {
    updateData.facebookUrl = facebookUrl || "#";
  }
  if (instagramUrl !== undefined) {
    updateData.instagramUrl = instagramUrl || "#";
  }
  if (linkedinUrl !== undefined) {
    updateData.linkedinUrl = linkedinUrl || "#";
  }
  if (tiktokUrl !== undefined) {
    updateData.tiktokUrl = tiktokUrl || "#";
  }
  if (youtubeUrl !== undefined) {
    updateData.youtubeUrl = youtubeUrl || "#";
  }
  if (storeContactEmail !== undefined && storeContactEmail !== null) {
    updateData.storeContactEmail = storeContactEmail;
  }
  if (storeContactWhatsappNumber !== undefined) {
    updateData.storeContactWhatsappNumber = storeContactWhatsappNumber;
  }
  if (footerDescription !== undefined) {
    updateData.footerDescription = footerDescription;
  }
  if (siteOwnerEmail !== undefined && siteOwnerEmail !== null) {
    updateData.siteOwnerEmail = siteOwnerEmail;
  }

  // Ensure at least one field is being updated
  if (Object.keys(updateData).length === 0) {
    return c.json(
      HONO_ERROR(
        "BAD_REQUEST",
        "At least one field must be provided for update"
      ),
      HTTP.BAD_REQUEST
    );
  }

  try {
    const [updatedConfig] = await db
      .update(siteConfig)
      .set(updateData)
      .where(eq(siteConfig.id, existingConfig.id))
      .returning();

    if (!updatedConfig) {
      // If update failed and we uploaded a new logo, clean it up
      if (siteLogo && siteLogo instanceof File && updateData.siteLogoId) {
        await deleteImageByIdOrSlug(
          updateData.siteLogoId as string,
          "id",
          "after site config update failure"
        );
      }
      return c.json(
        HONO_ERROR(
          "INTERNAL_SERVER_ERROR",
          "Failed to update site configuration"
        ),
        HTTP.INTERNAL_SERVER_ERROR
      );
    }

    // Clean up old logo if it was replaced or removed
    if (oldLogoSlug) {
      await deleteImageByIdOrSlug(
        oldLogoSlug,
        "slug",
        "after site config update"
      );
      // Don't fail the request, just log the error
    }

    return c.json(
      HONO_RESPONSE({
        data: updatedConfig,
        statusCode: "OK",
        message: "Site configuration updated successfully",
      }),
      HTTP.OK
    );
  } catch (error) {
    // Clean up new logo if update failed
    if (siteLogo && siteLogo instanceof File && updateData.siteLogoId) {
      await deleteImageByIdOrSlug(
        updateData.siteLogoId as string,
        "id",
        "after site config update failure"
      );
    }
    HONO_LOGGER.error("Failed to update site configuration", { error });
    return c.json(
      HONO_ERROR(
        "INTERNAL_SERVER_ERROR",
        "Failed to update site configuration"
      ),
      HTTP.INTERNAL_SERVER_ERROR
    );
  }
};
