import { createRoute, z } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";
import { category } from "../entity/category.entity";
import { categoryWithImgSchema } from "../schemas/category-with-img.schema";

export const GET_ONE_Route = createRoute({
  path: "/public/category/{slug}",
  method: "get",
  tags: moduleTags.category,
  request: { params: z.object({ slug: z.string().min(1) }) },
  responses: {
    [HTTP.OK]: APISchema.response({
      data: categoryWithImgSchema,
    }),
    [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
  },
});

export const GET_ONE_Handler: AppRouteHandler<typeof GET_ONE_Route> = async (
  c
) => {
  const { slug } = c.req.valid("param");
  const categoryPrepare = db.query.category
    .findFirst({
      where: eq(category.slug, sql.placeholder("slug")),
      with: { img: true },
      /**
       * @todo uncomment this when product modules is completed
       */
      // extras(fields, { sql }) {
      //   return {
      //     totalProducts:
      //       sql<number>`(SELECT COUNT(*) FROM hono_product WHERE hono_product.category_slug = ${fields.slug})`.as(
      //         "totalProducts"
      //       ),
      //   };
      // },
    })
    .prepare("get-category-by-slug");

  const categoryResponse = await categoryPrepare.execute({ slug });
  if (!categoryResponse) {
    return c.json(
      HONO_ERROR("NOT_FOUND", "Category Not Found"),
      HTTP.NOT_FOUND
    );
  }

  return c.json(HONO_RESPONSE({ data: categoryResponse }), HTTP.OK);
};
