import { createRoute, z } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_ERROR } from "@/lib/utils";
import { AppRouteHandler } from "@/lib/core/create-router";
import { stat } from "fs/promises";
import { getContentType, sanitizeFilePath } from "../service/file-utils";

export const GET_IMG_Route = createRoute({
  path: "/file/get-img-by-slug/{slug}",
  method: "get",
  tags: moduleTags.file,
  request: {
    params: z.object({
      slug: z
        .string()
        .min(1)
        .max(255)
        .describe("Image filename with extension"),
    }),
  },
  responses: {
    [HTTP.OK]: APISchema.IMAGE_OK,
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
  },
});

export const GET_IMG_Handler: AppRouteHandler<typeof GET_IMG_Route> = async (
  c
) => {
  const { slug } = c.req.valid("param");

  // Sanitize and validate file path
  const filePath = sanitizeFilePath(slug);
  if (!filePath) {
    return c.json(
      HONO_ERROR("BAD_REQUEST", "Invalid file path"),
      HTTP.BAD_REQUEST
    );
  }

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return c.json(HONO_ERROR("NOT_FOUND"), HTTP.NOT_FOUND);
    }

    // Use Bun's optimized file reading
    const file = Bun.file(filePath);

    const contentType = getContentType(slug);

    const fileData = await file.arrayBuffer();

    // Set headers for caching and content type
    c.header("Content-Type", contentType);
    c.header("Cache-Control", "public, max-age=31536000, immutable"); // 1 year cache for images
    c.header("Content-Length", fileStats.size.toString());

    return c.body(fileData);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "ENOENT") {
        return c.json(HONO_ERROR("NOT_FOUND"), HTTP.NOT_FOUND);
      }
      if (error.code === "EACCES" || error.code === "EPERM") {
        return c.json(HONO_ERROR("FORBIDDEN", "Access denied"), HTTP.FORBIDDEN);
      }
    }

    console.error(`Error serving image ${slug}:`, error);
    return c.json(HONO_ERROR("NOT_FOUND"), HTTP.NOT_FOUND);
  }
};
