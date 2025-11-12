import { createRoute } from "@hono/zod-openapi";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";

export const POST_Route = createRoute({
  path: "/siteConfig",
  method: "post",
  tags: moduleTags.siteConfig,
  request: {},
  responses: {
    [HTTP.OK]: APISchema.OK,
  },
});

export const POST_Handler: AppRouteHandler<typeof POST_Route> = async (c) => {
  return c.json(HONO_RESPONSE(), HTTP.OK);
};
