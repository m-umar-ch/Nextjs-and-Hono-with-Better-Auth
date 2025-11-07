import { createRoute, z } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { APISchema, createOKSchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_ERROR, HONO_RESPONSE, slugify } from "@/lib/utils";
import { AppRouteHandler } from "@/lib/core/create-router";
import { getSingleImageSchema } from "@/modules/file/service/get-file-openapi.schema";
import { db } from "@/db";
import { category, categorySchema } from "../entity/category.entity";
import { eq } from "drizzle-orm";
import { file as fileSchema } from "@/modules/file/entity/file.entity";

export const POST_Route = createRoute({
  path: "/category",
  method: "post",
  tags: moduleTags.category,
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            name: z.string().min(3),
            slug: z.string().min(3),
            image: getSingleImageSchema(),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    [HTTP.OK]: createOKSchema({ data: categorySchema }),
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
  },
});

export const POST_Handler: AppRouteHandler<typeof POST_Route> = async (c) => {
  const { image, name, slug: unSlugifiedSlug } = c.req.valid("form");

  const slug = slugify(unSlugifiedSlug);

  const alreadyExists = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });
  if (alreadyExists) {
    return c.json(
      HONO_ERROR("UNPROCESSABLE_ENTITY"),
      HTTP.UNPROCESSABLE_ENTITY
    );
  }

  let imageResponse: typeof fileSchema;

  // @todo fix below
  const response = await db.query.category.findFirst({});
  return c.json(HONO_RESPONSE({ data: response! }), HTTP.OK);
};
