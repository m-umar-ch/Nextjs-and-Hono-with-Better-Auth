import { createRoute, z } from "@hono/zod-openapi";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import type { AuthenticatedRouteHandler } from "@/lib/core/create-router";
import { HONO_LOGGER } from "@/lib/core/hono-logger";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_PAGINATED_RESPONSE } from "@/lib/utils";
import { Roles } from "@/modules/auth/service/permissions";
import { moduleTags } from "../../module.tags";
import { UserSchema, user } from "../entity/user.entity";

export const GET_Route = createRoute({
  path: "/user",
  method: "get",
  tags: moduleTags.user,
  summary: "Get paginated list of users",
  request: {
    query: APISchema.paginationQuery.extend({
      search: z.string().nullable().optional(),
      role: z.enum(Roles).nullable().optional(),
      sort: z
        .enum([
          "name-asc",
          "name-desc",
          "email-asc",
          "email-desc",
          "newest",
          "oldest",
        ])
        .default("newest")
        .nullable()
        .optional(),
    }),
  },
  middleware: [requirePermissions({ user: ["list"] })],
  responses: {
    [HTTP.OK]: APISchema.paginatedResponse({
      itemSchema: UserSchema,
      description: "OK - Users retrieved successfully",
      statusCode: "OK",
    }),
    [HTTP.UNAUTHORIZED]: APISchema.UNAUTHORIZED,
    [HTTP.FORBIDDEN]: APISchema.FORBIDDEN,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const GET_Handler: AuthenticatedRouteHandler<typeof GET_Route> = async (
  c
) => {
  const query = c.req.valid("query");
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const offset = (page - 1) * limit;
  const sort = query.sort ?? "newest";
  const role = query.role;
  const search = query.search;

  try {
    const whereConditionsArray = [];

    if (role) {
      whereConditionsArray.push(eq(user.role, role));
    }

    if (search?.trim()) {
      const searchTerm = search.trim();
      const searchPattern = `%${searchTerm}%`;

      const searchCondition = or(
        ilike(user.name, searchPattern),
        ilike(user.email, searchPattern)
      );

      if (searchCondition) {
        whereConditionsArray.push(searchCondition);
      }
    }

    const whereConditions =
      whereConditionsArray.length > 0
        ? and(...whereConditionsArray)
        : undefined;

    const orderBy: Array<ReturnType<typeof asc> | ReturnType<typeof desc>> =
      sort === "name-asc"
        ? [asc(user.name), desc(user.createdAt)]
        : sort === "name-desc"
        ? [desc(user.name), desc(user.createdAt)]
        : sort === "email-asc"
        ? [asc(user.email), desc(user.createdAt)]
        : sort === "email-desc"
        ? [desc(user.email), desc(user.createdAt)]
        : sort === "newest"
        ? [desc(user.createdAt), desc(user.updatedAt)]
        : sort === "oldest"
        ? [asc(user.createdAt), asc(user.updatedAt)]
        : [desc(user.createdAt), desc(user.updatedAt)];

    const [userResponse, total] = await Promise.all([
      db.query.user.findMany({
        where: whereConditions,
        orderBy,
        offset,
        limit,
      }),

      db.$count(user, whereConditions),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return HONO_PAGINATED_RESPONSE(c, userResponse, {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
    });
  } catch (error) {
    HONO_LOGGER.error("Failed to retrieve users", {
      error,
      userId: c.var.user.id,
      page,
      limit,
      sort,
      role,
    });

    return HONO_ERROR(
      c,
      "INTERNAL_SERVER_ERROR",
      "Failed to retrieve users. Please try again.",
      { error }
    );
  }
};
