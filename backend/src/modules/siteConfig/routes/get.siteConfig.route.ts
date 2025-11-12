import { createRoute } from "@hono/zod-openapi";
import { db } from "@/db";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";
import { siteConfigWithLogoSchema } from "../schemas/site-config-with-logo.schema";

export const GET_Route = createRoute({
  path: "/public/site-config",
  method: "get",
  tags: moduleTags.siteConfig,
  request: {},
  responses: {
    [HTTP.OK]: APISchema.response({
      data: siteConfigWithLogoSchema,
      description: "OK - Site configuration retrieved successfully",
      statusCode: "OK",
    }),
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
  },
});

export const GET_Handler: AppRouteHandler<typeof GET_Route> = async (c) => {
  const config = await db.query.siteConfig.findFirst({
    with: { siteLogo: true },
    orderBy: (siteConfig, { desc }) => [desc(siteConfig.createdAt)],
  });

  if (!config) {
    return c.json(
      HONO_ERROR("NOT_FOUND", "Site configuration not found"),
      HTTP.NOT_FOUND
    );
  }

  return c.json(HONO_RESPONSE({ data: config }), HTTP.OK);
};
