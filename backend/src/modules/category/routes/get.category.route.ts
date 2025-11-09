import { createRoute, z } from "@hono/zod-openapi";
import { moduleTags } from "../../module.tags";
import { createResponseSchema } from "@/lib/schemas/api-schemas";
import { HTTP } from "@/lib/http/status-codes";
import { HONO_RESPONSE } from "@/lib/utils";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { db } from "@/db";
import { categorySchema } from "../entity/category.entity";
import { fileSchema } from "@/db/schema";

export const GET_Route = createRoute({
  path: "/category",
  method: "get",
  tags: moduleTags.category,
  request: {},
  responses: {
    [HTTP.OK]: createResponseSchema({
      data: z.array(
        categorySchema.and(
          z.object({
            img: fileSchema.nullable(),
            /**
             * @todo uncomment this when product modules is completed
             */
            // totalProducts: z.number(),
          })
        )
      ),
    }),
  },
});

export const GET_Handler: AppRouteHandler<typeof GET_Route> = async (c) => {
  const categories = await db.query.category.findMany({
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
    orderBy: (category, { asc }) => [asc(category.sortOrder)],
  });

  return c.json(HONO_RESPONSE({ data: categories }), HTTP.OK);
};
