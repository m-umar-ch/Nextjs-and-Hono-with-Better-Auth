import { z } from "@hono/zod-openapi";
import { HTTP, HTTP_STATUS_PHRASE } from "../http/status-codes";

/**
 * Collection of standardized OpenAPI response schemas for HTTP status codes.
 *
 * These schemas ensure consistent API response structure across all endpoints,
 * providing clear success/error indicators, standardized error formats, and
 * appropriate HTTP status codes.
 *
 * @example
 * // Usage in OpenAPI route definition
 * app.openapi(route, {
 *   responses: {
 *     [HTTP.OK]: APISchema.OK,
 *     [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
 *     [HTTP.NOT_FOUND]: APISchema.NOT_FOUND,
 *   }
 * })
 *
 * // Usage with data response
 * [HTTP.OK]: APISchema.response({
 *   data: categorySchema,
 *   description: "OK - Category retrieved successfully",
 *   statusCode: "OK",
 * })
 *
 * // Usage with paginated response
 * [HTTP.OK]: APISchema.paginatedResponse({
 *   itemSchema: categorySchema,
 *   description: "OK - Categories retrieved successfully",
 *   statusCode: "OK",
 * })
 *
 * @namespace APISchema
 */
export const APISchema = {
  /**
   * Creates a standardized response schema with data payload.
   *
   * Used for successful operations that return data.
   * Automatically includes success indicator, message, and status code.
   *
   * @param options - Configuration object
   * @param options.data - Zod schema for the response data
   * @param options.description - Response description (default: "OK - Request successful")
   * @param options.statusCode - HTTP status code key (default: "OK")
   * @returns OpenAPI response schema configuration
   *
   * @example
   * APISchema.response({
   *   data: categorySchema,
   *   description: "OK - Category retrieved successfully",
   *   statusCode: "OK",
   * })
   */
  response: <T extends z.ZodType>({
    data,
    description = "OK - Request successful",
    statusCode = "OK",
  }: {
    data: T;
    description?: string;
    statusCode?: keyof typeof HTTP;
  }) => {
    return {
      description,
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(true),
            message: z
              .string()
              .default(
                HTTP_STATUS_PHRASE[HTTP[statusCode]] ||
                  "Operation completed successfully"
              ),
            statusCode: z.number().optional().default(HTTP[statusCode]),
            data,
          }),
        },
      },
    };
  },

  /**
   * Creates a standardized paginated response schema.
   *
   * Used for list endpoints that return paginated data.
   * Automatically includes success indicator, message, status code, items array, and pagination metadata.
   *
   * @param options - Configuration object
   * @param options.itemSchema - Zod schema for individual items in the paginated list
   * @param options.description - Response description (default: "OK - Request successful")
   * @param options.statusCode - HTTP status code key (default: "OK")
   * @returns OpenAPI response schema configuration
   *
   * @example
   * APISchema.paginatedResponse({
   *   itemSchema: categorySchema,
   *   description: "OK - Categories retrieved successfully",
   *   statusCode: "OK",
   * })
   */
  paginatedResponse: <T extends z.ZodType>({
    itemSchema,
    description = "OK - Request successful",
    statusCode = "OK",
  }: {
    itemSchema: T;
    description?: string;
    statusCode?: keyof typeof HTTP;
  }) => {
    const paginationSchema = z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    });

    return {
      description,
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().default(true),
            message: z
              .string()
              .default(
                HTTP_STATUS_PHRASE[HTTP[statusCode]] ||
                  "Operation completed successfully"
              ),
            statusCode: z.number().optional().default(HTTP[statusCode]),
            data: z.object({
              items: z.array(itemSchema),
              pagination: paginationSchema,
            }),
          }),
        },
      },
    };
  },

  /**
   * Pagination query parameters schema for list endpoints.
   *
   * Used for paginated GET requests to specify page number and items per page.
   * Both parameters are optional with sensible defaults.
   *
   * @example
   * // Use defaults (page: 1, limit: 10)
   * GET /api/categories
   *
   * // Specify page and limit
   * GET /api/categories?page=2&limit=20
   *
   * // Usage in route definition
   * request: {
   *   query: APISchema.paginationQuery,
   * }
   */
  paginationQuery: z.object({
    page: z.coerce.number().int().min(1).default(1).nullable().optional(),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .nullable()
      .optional(),
  }),

  /**
   * HTTP 200 OK - Successful request response schema.
   *
   * Used for successful operations that return data or confirmation messages.
   * Contains success indicator, message, and optional status code.
   *
   * @example
   * {
   *   success: true,
   *   message: "Operation completed successfully",
   *   statusCode: 200
   * }
   */
  OK: {
    description: "OK - Request successful",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(true),
          message: z.string().default("Operation completed successfully"),
          statusCode: z.number().optional().default(HTTP.OK),
        }),
      },
    },
  },

  /**
   * HTTP 201 Created - Resource creation success response schema.
   *
   * Used when a new resource has been successfully created.
   * Includes success indicator, message, optional data payload, and status code.
   *
   * @example
   * {
   *   success: true,
   *   message: "Resource created successfully",
   *   data: { id: "123", name: "New Resource" },
   *   statusCode: 201
   * }
   */
  CREATED: {
    description: "Created - Resource successfully created",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(true),
          message: z.string().default("Resource created successfully"),
          data: z.any().optional(),
          statusCode: z.number().default(HTTP.CREATED).optional(),
        }),
      },
    },
  },

  /**
   * HTTP 204 No Content - Successful request with no response body.
   *
   * Used for successful operations that don't need to return data,
   * such as DELETE operations or updates that don't return the updated resource.
   */
  NO_CONTENT: {
    description: "No Content - Request successful with no response body",
  },

  /**
   * HTTP 200 OK - Image file response schema.
   *
   * Used for successful image file retrieval endpoints.
   * Returns binary image data with appropriate content type headers.
   * Supports multiple image formats: PNG, JPEG, GIF, WebP, SVG, ICO, BMP, and AVIF.
   *
   * @example
   * // Response headers:
   * // Content-Type: image/png
   * // Cache-Control: public, max-age=31536000, immutable
   * // Content-Length: 12345
   * // Binary image data in response body
   */
  IMAGE_OK: {
    description: "OK - Image file returned successfully",
    content: {
      "image/png": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/jpeg": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/gif": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/webp": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/svg+xml": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/x-icon": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/bmp": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "image/avif": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
      "application/octet-stream": {
        schema: z.string().openapi({
          type: "string",
          format: "binary",
          description: "Raw file data",
        }),
      },
    },
  },

  /**
   * HTTP 400 Bad Request - Client error response schema.
   *
   * Used when the request contains invalid syntax, parameters, or data.
   * Contains error details with a descriptive message.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Invalid request parameters provided"
   *   },
   *   statusCode: 400
   * }
   */
  BAD_REQUEST: {
    description: "Bad Request - Invalid request data",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Invalid request parameters provided"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.BAD_REQUEST),
        }),
      },
    },
  },

  /**
   * HTTP 401 Unauthorized - Authentication required response schema.
   *
   * Used when the request lacks valid authentication credentials.
   * The client must authenticate itself to get the requested response.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Authentication required"
   *   },
   *   statusCode: 401
   * }
   */
  UNAUTHORIZED: {
    description: "Unauthorized - Authentication required",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Authentication required"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.UNAUTHORIZED),
        }),
      },
    },
  },

  /**
   * HTTP 403 Forbidden - Access denied response schema.
   *
   * Used when the client is authenticated but doesn't have permission
   * to access the requested resource or perform the operation.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Access denied"
   *   },
   *   statusCode: 403
   * }
   */
  FORBIDDEN: {
    description: "Forbidden - Insufficient permissions",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Access denied"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.FORBIDDEN),
        }),
      },
    },
  },

  /**
   * HTTP 404 Not Found - Resource not found response schema.
   *
   * Used when the requested resource doesn't exist or the endpoint is invalid.
   * Can also be used to hide resource existence from unauthorized clients.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Requested resource not found"
   *   },
   *   statusCode: 404
   * }
   */
  NOT_FOUND: {
    description: "Not Found - Resource not found",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Requested resource not found"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.NOT_FOUND),
        }),
      },
    },
  },

  /**
   * HTTP 409 Conflict - Resource conflict response schema.
   *
   * Used when the request conflicts with the current state of the server,
   * such as trying to create a resource that already exists.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Resource conflict occurred"
   *   },
   *   statusCode: 409
   * }
   */
  CONFLICT: {
    description: "Conflict - Resource already exists or state conflict",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Resource conflict occurred"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.CONFLICT),
        }),
      },
    },
  },

  /**
   * HTTP 422 Unprocessable Entity - Validation error response schema.
   *
   * Used when the request is well-formed but contains semantic errors,
   * typically validation failures on input data.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "Request validation failed"
   *   },
   *   statusCode: 422
   * }
   */
  UNPROCESSABLE_ENTITY: {
    description: "Unprocessable Entity - Validation errors",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("Request validation failed"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.UNPROCESSABLE_ENTITY),
        }),
      },
    },
  },

  /**
   * HTTP 500 Internal Server Error - Server error response schema.
   *
   * Used when the server encounters an unexpected condition that prevents
   * it from fulfilling the request. Should include minimal error details
   * to avoid exposing sensitive server information.
   *
   * @example
   * {
   *   success: false,
   *   error: {
   *     message: "An unexpected error occurred"
   *   },
   *   statusCode: 500
   * }
   */
  INTERNAL_SERVER_ERROR: {
    description: "Internal Server Error - Server encountered an error",
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(false),
          error: z.object({
            message: z.string().default("An unexpected error occurred"),
            issues: z
              .array(
                z.object({
                  message: z.string(),
                  path: z.string().optional(),
                  code: z.string().optional(),
                })
              )
              .optional(),
          }),
          statusCode: z.number().optional().default(HTTP.INTERNAL_SERVER_ERROR),
        }),
      },
    },
  },
};
