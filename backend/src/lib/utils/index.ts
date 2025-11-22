/**
 * Centralized exports for all utility functions
 *
 * This file provides a single import point for all utility functions,
 * organized by category for better discoverability and maintainability.
 */

// Async utilities and Result pattern
export {
  delay,
  isConnectionError,
  isFailure,
  isSuccess,
  parallelLimit,
  type Result,
  retry,
  timeout,
  tryCatch,
  tryCatchSync,
  withTimeout,
} from "./async-utils";
// Re-export commonly used types for convenience

// HTTP response utilities
export {
  type ErrorResponse,
  HONO_ERROR,
  HONO_ERROR_WITHOUT_CONTEXT,
  HONO_PAGINATED_RESPONSE,
  HONO_PAGINATED_RESPONSE_WITHOUT_CONTEXT,
  HONO_RESPONSE,
  HONO_RESPONSE_WITHOUT_CONTEXT,
} from "./response-utils";
// String utilities
export {
  capitalize,
  deSlugify,
  slugify,
  stripHtml,
  toTitleCase,
  truncate,
} from "./string-utils";

/**
 * Utility categories for reference:
 *
 * STRING UTILITIES:
 * - slugify: Convert string to URL-friendly slug
 * - deSlugify: Convert slug back to readable title
 * - capitalize: Capitalize first letter
 * - toTitleCase: Convert to title case
 * - truncate: Truncate string with ellipsis
 * - stripHtml: Remove HTML tags
 *
 * ASYNC UTILITIES:
 * - tryCatch: Safe promise execution with Result pattern
 * - tryCatchSync: Safe synchronous execution with Result pattern
 * - delay: Simple delay function
 * - timeout: Create timeout promise
 * - withTimeout: Race promise against timeout
 * - retry: Retry with exponential backoff
 * - parallelLimit: Execute promises with concurrency limit
 * - isSuccess/isFailure: Result type guards
 * - isConnectionError: Check if error is a connection/network error
 *
 * RESPONSE UTILITIES:
 * - HONO_ERROR: Create and return error responses directly (with Context)
 * - HONO_ERROR_WITHOUT_CONTEXT: Create standardized error response objects (without Context)
 * - HONO_RESPONSE: Create and return success responses directly (with Context)
 * - HONO_RESPONSE_WITHOUT_CONTEXT: Create standardized success response objects (without Context)
 * - HONO_PAGINATED_RESPONSE: Create and return paginated responses directly (with Context)
 * - HONO_PAGINATED_RESPONSE_WITHOUT_CONTEXT: Create paginated response objects (without Context)
 * - isErrorResponse/isSuccessResponse: Response type guards
 * - HTTP_STATUS: HTTP status codes
 * - STATUS_PHRASES: HTTP status phrases
 */
