import { createRoute, z } from "@hono/zod-openapi";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { table_filter } from "@/db/extras/db.utils";
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
  summary: "Get a single category by slug",
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
      with: { img: { columns: { slug: true } } },
      extras(fields, { sql }) {
        const productTable = sql.raw(`"${table_filter}product"`);
        return {
          totalProducts:
            sql<number>`(SELECT COUNT(*) FROM ${productTable} WHERE ${productTable}.category_slug = ${fields.slug} AND ${productTable}.status_slug != 'inactive')`.as(
              "totalProducts"
            ),
        };
      },
    })
    .prepare("get-category-by-slug");

  const categoryResponse = await categoryPrepare.execute({ slug });
  if (!categoryResponse) {
    return HONO_ERROR(c, "NOT_FOUND", "Category Not Found");
  }

  return HONO_RESPONSE(c, { data: categoryResponse });
};
