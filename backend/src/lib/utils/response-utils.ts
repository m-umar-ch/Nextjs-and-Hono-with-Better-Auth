/**
 * HTTP response utility functions for standardized API responses
 */

import type { Context, TypedResponse } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { JSONParsed } from "hono/utils/types";
import { HONO_LOGGER } from "../core/hono-logger";
import { HTTP, HTTP_STATUS_PHRASE } from "../http/status-codes";

type HTTPStatusKey = keyof typeof HTTP;
type HTTPStatusValue = (typeof HTTP)[HTTPStatusKey];
type SuccessResponse<T> = BaseResponse & { data: T };
type SuccessResponseNoData = BaseResponse & { data?: never };
type StatusCodeValue<K extends HTTPStatusKey> = (typeof HTTP)[K];
type HONO_ERROR_RETURN<T extends StatusCodeValue<HTTPStatusKey>> = Response &
  TypedResponse<JSONParsed<ErrorResponse>, T, "json">;
type HONO_SUCCESS_RETURN<
  D,
  T extends StatusCodeValue<HTTPStatusKey>
> = Response & TypedResponse<JSONParsed<SuccessResponse<D>>, T, "json">;

/**
 * Options for success response creation
 */
interface ResponseOptions<T = unknown> {
  data?: T;
  message?: string;
  statusCode?: HTTPStatusKey;
  timestamp?: boolean;
  requestId?: string;
}

/**
 * Base response shared across all success responses
 */
interface BaseResponse {
  success: true;
  message: string;
  statusCode: HTTPStatusValue;
  timestamp?: string;
  requestId?: string;
}

// Overload for when data is provided
export function HONO_RESPONSE_WITHOUT_CONTEXT<T>(
  options: ResponseOptions<T> & { data: T }
): SuccessResponse<T>;
// Overload for when no data is provided
export function HONO_RESPONSE_WITHOUT_CONTEXT(
  options?: Omit<ResponseOptions, "data">
): SuccessResponseNoData;
export function HONO_RESPONSE_WITHOUT_CONTEXT<T>(
  options: ResponseOptions<T> = {}
): SuccessResponse<T> | SuccessResponseNoData {
  const {
    data,
    message,
    statusCode = "OK",
    timestamp = true,
    requestId,
  } = options;

  const statusValue = HTTP[statusCode];

  const base: BaseResponse = {
    success: true,
    message: message || HTTP_STATUS_PHRASE[HTTP[statusCode]],
    statusCode: statusValue,
  };

  if (timestamp) base.timestamp = new Date().toISOString();
  if (requestId) base.requestId = requestId;

  return data !== undefined ? { ...base, data } : base;
}

/**
 * Pagination metadata input (allows optional hasNext/hasPrev)
 */
interface PaginationInput {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * Pagination metadata output (always has hasNext/hasPrev as boolean)
 */
interface PaginationOutput {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function HONO_PAGINATED_RESPONSE_WITHOUT_CONTEXT<T>(
  data: T[],
  pagination: PaginationInput,
  options: Omit<ResponseOptions, "data"> = {}
): SuccessResponse<{
  items: T[];
  pagination: PaginationOutput;
}> {
  const paginationData: PaginationOutput = {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages: pagination.totalPages,
    hasNext: pagination.hasNext ?? pagination.page < pagination.totalPages,
    hasPrev: pagination.hasPrev ?? pagination.page > 1,
  };

  return HONO_RESPONSE_WITHOUT_CONTEXT({
    ...options,
    data: {
      items: data,
      pagination: paginationData,
    },
    message: options.message || `Retrieved ${data.length} items`,
  });
}

/**
 * Returns a standardized success response from a Hono route handler.
 *
 * @example
 * // Basic success without data
 * return HONO_RESPONSE(c);
 *
 * @example
 * // Success with data
 * return HONO_RESPONSE(c, { data: { id: 1, name: "John" } });
 *
 * @example
 * // Created resource
 * return HONO_RESPONSE(c, {
 *   data: user,
 *   message: "User created successfully",
 *   statusCode: "CREATED"
 * });
 *
 * @example
 * // With request ID for tracing
 * return HONO_RESPONSE(c, {
 *   data: results,
 *   requestId: c.get("requestId")
 * });
 *
 * @example
 * // No content response
 * return HONO_RESPONSE(c, { statusCode: "NO_CONTENT" });
 *
 * @example
 * // Custom message
 * return HONO_RESPONSE(c, {
 *   data: items,
 *   message: "Items retrieved successfully",
 *   statusCode: "OK"
 * });
 *
 * @example
 * // Disable timestamp
 * return HONO_RESPONSE(c, {
 *   data: result,
 *   timestamp: false
 * });
 */
export function HONO_RESPONSE<T, K extends HTTPStatusKey = "OK">(
  c: Context,
  options: ResponseOptions<T> & { data: T; statusCode?: K }
): HONO_SUCCESS_RETURN<T, StatusCodeValue<K>>;
export function HONO_RESPONSE<K extends HTTPStatusKey = "OK">(
  c: Context,
  options?: Omit<ResponseOptions, "data"> & { statusCode?: K }
): HONO_SUCCESS_RETURN<StatusCodeValue<K>, never>;
export function HONO_RESPONSE<T, K extends HTTPStatusKey = "OK">(
  c: Context,
  options: ResponseOptions<T> = {}
): HONO_SUCCESS_RETURN<T, StatusCodeValue<K>> {
  const response = HONO_RESPONSE_WITHOUT_CONTEXT(options);
  const statusCode = (options.statusCode || "OK") as K;
  const statusValue = HTTP[statusCode];

  return c.json(
    response,
    statusValue as ContentfulStatusCode
  ) as HONO_SUCCESS_RETURN<T, StatusCodeValue<K>>;
}

/**
 * Returns a standardized paginated success response from a Hono route handler.
 *
 * @example
 * // Basic paginated response
 * return HONO_PAGINATED_RESPONSE(c, users, {
 *   page: 1,
 *   limit: 10,
 *   total: 100,
 *   totalPages: 10
 * });
 *
 * @example
 * // With custom message
 * return HONO_PAGINATED_RESPONSE(c, products, {
 *   page: 2,
 *   limit: 20,
 *   total: 150,
 *   totalPages: 8
 * }, {
 *   message: "Products retrieved successfully"
 * });
 *
 * @example
 * // With request ID for tracing
 * return HONO_PAGINATED_RESPONSE(c, items, {
 *   page: 1,
 *   limit: 25,
 *   total: 500,
 *   totalPages: 20
 * }, {
 *   requestId: c.get("requestId")
 * });
 *
 * @example
 * // With custom status code
 * return HONO_PAGINATED_RESPONSE(c, results, {
 *   page: 1,
 *   limit: 50,
 *   total: 200,
 *   totalPages: 4
 * }, {
 *   statusCode: "OK",
 *   message: "Search results"
 * });
 *
 * @example
 * // Disable timestamp
 * return HONO_PAGINATED_RESPONSE(c, data, {
 *   page: 1,
 *   limit: 10,
 *   total: 50,
 *   totalPages: 5
 * }, {
 *   timestamp: false
 * });
 */
export function HONO_PAGINATED_RESPONSE<
  K extends HTTPStatusKey = "OK",
  T = unknown
>(
  c: Context,
  data: T[],
  pagination: PaginationInput,
  options: Omit<ResponseOptions, "data"> & { statusCode?: K } = {}
): HONO_SUCCESS_RETURN<
  {
    items: T[];
    pagination: PaginationOutput;
  },
  StatusCodeValue<K>
> {
  const statusCode = (options.statusCode || "OK") as K;
  const response = HONO_PAGINATED_RESPONSE_WITHOUT_CONTEXT(data, pagination, {
    ...options,
    statusCode,
  });
  const statusValue = HTTP[statusCode];

  return c.json(
    response,
    statusValue as ContentfulStatusCode
  ) as HONO_SUCCESS_RETURN<
    {
      items: T[];
      pagination: PaginationOutput;
    },
    StatusCodeValue<K>
  >;
}

/**
 * Returns a standardized error response from a Hono route handler.
 *
 * @example
 * // Basic error with message
 * return HONO_ERROR(c, "BAD_REQUEST", "Invalid request data");
 *
 * @example
 * // Use default message from status code
 * return HONO_ERROR(c, "NOT_FOUND");
 *
 * @example
 * // Validation errors with multiple issues
 * return HONO_ERROR(c, "UNPROCESSABLE_ENTITY", "Validation failed", {
 *   issues: [
 *     { message: "Email is required", path: "email", code: "required" },
 *     { message: "Password must be at least 8 characters", path: "password", code: "min_length" }
 *   ]
 * });
 *
 * @example
 * // With request ID for tracing
 * return HONO_ERROR(c, "INTERNAL_SERVER_ERROR", "Database error", {
 *   requestId: c.get("requestId")
 * });
 *
 * @example
 * // Catch and return error
 * try {
 *   await someOperation();
 * } catch (error) {
 *   return HONO_ERROR(c, "INTERNAL_SERVER_ERROR", "Operation failed", {
 *     error: error,
 *     requestId: c.get("requestId")
 *   });
 * }
 *
 * @example
 * // Custom message via options
 * return HONO_ERROR(c, "BAD_REQUEST", undefined, {
 *   message: someCondition ? "Error A" : "Error B"
 * });
 *
 * @example
 * // Disable timestamp
 * return HONO_ERROR(c, "UNAUTHORIZED", "Invalid credentials", {
 *   timestamp: false
 * });
 *
 * @example
 * // 5xx error with Error object (auto-logs to Sentry)
 * return HONO_ERROR(c, "INTERNAL_SERVER_ERROR", "Service unavailable", {
 *   error: new Error("Database timeout"),
 *   requestId: c.get("requestId")
 * });
 */
export function HONO_ERROR<K extends HTTPStatusKey>(
  c: Context,
  statusCode: K,
  message?: string,
  options: ErrorOptions = {}
): HONO_ERROR_RETURN<StatusCodeValue<K>> {
  const errorResponse = HONO_ERROR_WITHOUT_CONTEXT(
    statusCode,
    message,
    options
  );

  return c.json(
    errorResponse,
    HTTP[statusCode] as ContentfulStatusCode
  ) as HONO_ERROR_RETURN<StatusCodeValue<K>>;
}

/**
 * Standard error response structure following OpenAPI specification
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    issues?: Array<{ message: string; path?: string; code?: string }>;
  };
  statusCode: HTTPStatusValue;
  timestamp?: string;
  requestId?: string;
}

/**
 * Options for error response creation
 */
interface ErrorOptions {
  message?: string;
  issues?: Array<{ message: string; path?: string; code?: string }>;
  timestamp?: boolean;
  requestId?: string;
  error?: Error | unknown; // Optional error object to extract route/method info
}

export function HONO_ERROR_WITHOUT_CONTEXT(
  statusCode: HTTPStatusKey,
  message?: string,
  options: ErrorOptions = {}
): ErrorResponse {
  const statusValue = HTTP[statusCode];

  const {
    message: optionsMessage,
    issues,
    timestamp = true,
    requestId,
    error: errorObject,
  } = options;

  // Priority: options.message > message parameter > generated message
  const finalMessage =
    optionsMessage || message || HTTP_STATUS_PHRASE[HTTP[statusCode]];

  const response: ErrorResponse = {
    success: false,
    error: {
      message: finalMessage,
      ...(issues && issues.length > 0 && { issues }),
    },
    statusCode: statusValue,
  };

  // Add optional fields
  if (timestamp) {
    response.timestamp = new Date().toISOString();
  }

  if (requestId) {
    response.requestId = requestId;
  }

  if (statusValue >= 500) {
    HONO_LOGGER.error(`HTTP ${statusValue} | Error: ${finalMessage}`, {
      originalError: errorObject,
    });

    // Report to Sentry for 5xx errors
    if (errorObject instanceof Error) {
      HONO_LOGGER.sentry.captureException(errorObject, {
        tags: {
          statusCode: statusValue,
          errorCode: statusCode,
        },
        extra: {
          message: finalMessage,
          requestId,
          timestamp: new Date().toISOString(),
        },
      });
    } else if (errorObject) {
      // For non-Error objects, capture as a message
      HONO_LOGGER.sentry.captureMessage(
        `HTTP ${statusValue} Error: ${finalMessage}`,
        "error",
        {
          tags: {
            statusCode: statusValue,
            errorCode: statusCode,
          },
          extra: {
            originalError: errorObject,
            requestId,
            timestamp: new Date().toISOString(),
          },
        }
      );
    }
  }

  return response;
}
