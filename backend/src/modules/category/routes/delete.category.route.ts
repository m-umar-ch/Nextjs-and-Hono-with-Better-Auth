import { createRoute } from "@hono/zod-openapi";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";

export const DELETE_Route = createRoute({
  path: "/category",
  method: "delete",
  tags: moduleTags.category,
  request: {},
  responses: {
    [HTTP.OK]: APISchema.OK,
  },
});

export const DELETE_Handler: AppRouteHandler<typeof DELETE_Route> = async (
  c
) => {
  return c.json(HONO_RESPONSE(), HTTP.OK);
};
