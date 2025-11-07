import { createRoute } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_RESPONSE } from "@/lib/utils";
import { AppRouteHandler } from "@/lib/core/create-router";

export const PATCH_Route = createRoute({
  path: "/category",
  method: "patch",
  tags: moduleTags.category,
  request: {},
  responses: {
    [HTTP.OK]: APISchema.OK,
  },
});

export const PATCH_Handler: AppRouteHandler<typeof PATCH_Route> = async (c) => {
  return c.json(HONO_RESPONSE(), HTTP.OK);
};

