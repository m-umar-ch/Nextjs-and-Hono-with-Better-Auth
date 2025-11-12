import { createRoute } from "@hono/zod-openapi";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { category } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_PAGINATED_RESPONSE } from "@/lib/utils";
import { moduleTags } from "../../module.tags";
import { categoryWithImgSchema } from "../schemas/category-with-img.schema";

export const GET_Route = createRoute({
  path: "/public/category",
  method: "get",
  tags: moduleTags.category,
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

// Type assertion needed due to Hono Zod OpenAPI type inference limitations
// Runtime behavior is correct - dates serialize to strings, hasNext/hasPrev are always boolean
export const GET_Handler: AppRouteHandler<typeof GET_Route> = async (c) => {
  const query = c.req.valid("query");
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;

  // Get total count
  const [{ total }] = await db.select({ total: count() }).from(category);

  // Get paginated categories
  const categories = await db.query.category.findMany({
    with: { img: true },
    orderBy: (category, { asc }) => [asc(category.sortOrder)],
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
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return c.json(
    HONO_PAGINATED_RESPONSE(categories, {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    }),
    HTTP.OK
  );
};
