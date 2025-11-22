import { createRoute } from "@hono/zod-openapi";
import { db } from "@/db";
import { table_filter } from "@/db/extras/db.utils";
import { category } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_PAGINATED_RESPONSE } from "@/lib/utils/response-utils";
import { moduleTags } from "../../module.tags";
import { categoryWithImgSchema } from "../schemas/category-with-img.schema";

export const GET_Route = createRoute({
  path: "/public/category",
  method: "get",
  tags: moduleTags.category,
  summary: "Get paginated list of categories",
  request: {
    query: APISchema.paginationQuery,
  },
  responses: {
    [HTTP.OK]: APISchema.paginatedResponse({
      itemSchema: categoryWithImgSchema,
      description: "OK - Categories retrieved successfully",
      statusCode: "OK",
    }),
  },
});

export const GET_Handler: AppRouteHandler<typeof GET_Route> = async (c) => {
  const query = c.req.valid("query");
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;
  const total = await db.$count(category);

  // Get paginated categories
  const categories = await db.query.category.findMany({
    with: { img: { columns: { slug: true } } },
    orderBy: (category, { asc }) => [asc(category.sortOrder)],
    extras(fields, { sql }) {
      const productTable = sql.raw(`"${table_filter}product"`);
      return {
        totalProducts:
          sql<number>`(SELECT COUNT(*) FROM ${productTable} WHERE ${productTable}.category_slug = ${fields.slug} AND ${productTable}.status_slug != 'inactive')`.as(
            "totalProducts"
          ),
      };
    },
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return HONO_PAGINATED_RESPONSE(c, categories, {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  });
};
