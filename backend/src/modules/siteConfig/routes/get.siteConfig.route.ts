import { createRoute } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_RESPONSE } from "@/lib/utils";
import { AppRouteHandler } from "@/lib/core/create-router";

export const GET_Route = createRoute({
  path: "/siteConfig",
  method: "get",
  tags: moduleTags.siteConfig,
  request: {},
  responses: {
    [HTTP.OK]: APISchema.OK,
  },
});

export const GET_Handler: AppRouteHandler<typeof GET_Route> = async (c) => {
  return c.json(HONO_RESPONSE(), HTTP.OK);
};

