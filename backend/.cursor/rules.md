# Response Function Usage Rules

## Overview

This project uses standardized HTTP response utility functions for consistent API responses. There are two types of response functions:

1. **Context-aware functions** (preferred): Functions that take a Hono `Context` object and return a complete response
2. **Without-context functions**: Functions that only create response objects (use only when context is unavailable)

## Context-Aware Functions (Use These in Route Handlers)

### `HONO_RESPONSE(c, options?)`

**Use when:** You have access to the Hono context (`c`) in a route handler.

**Returns:** A complete Hono response with proper status code

**Examples:**

```typescript
// Basic success without data
return HONO_RESPONSE(c);

// Success with data
return HONO_RESPONSE(c, { data: { id: 1, name: "John" } });

// Created resource
return HONO_RESPONSE(c, {
  data: user,
  message: "User created successfully",
  statusCode: "CREATED",
});
```

### `HONO_PAGINATED_RESPONSE(c, data, pagination, options?)`

**Use when:** You have access to the Hono context and need to return paginated data.

**Returns:** A complete Hono response with paginated data structure

**Examples:**

```typescript
return HONO_PAGINATED_RESPONSE(c, categories, {
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
});
```

### `HONO_ERROR(c, statusCode, message?, options?)`

**Use when:** You have access to the Hono context and need to return an error response.

**Returns:** A complete Hono response with error details

**Examples:**

```typescript
// Basic error
return HONO_ERROR(c, "BAD_REQUEST", "Invalid request data");

// Error with validation issues
return HONO_ERROR(c, "UNPROCESSABLE_ENTITY", "Validation failed", {
  issues: [{ message: "Email is required", path: "email", code: "required" }],
});
```

## Without-Context Functions (Use Only When Necessary)

### `HONO_RESPONSE_WITHOUT_CONTEXT(options?)`

**Use when:** You need to create a response object but don't have access to the Hono context (e.g., inside hooks, middleware that needs to return a response object, or utility functions).

**Returns:** A response object (not a complete Hono response)

**Example:**

```typescript
// Inside a hook function
const errorResponse = HONO_ERROR_WITHOUT_CONTEXT(
  "UNPROCESSABLE_ENTITY",
  "Request validation failed",
  { issues: [...] }
);
return c.json(errorResponse, UNPROCESSABLE_ENTITY);
```

### `HONO_PAGINATED_RESPONSE_WITHOUT_CONTEXT(data, pagination, options?)`

**Use when:** You need to create a paginated response object without context.

### `HONO_ERROR_WITHOUT_CONTEXT(statusCode, message?, options?)`

**Use when:** You need to create an error response object without context (e.g., in validation hooks).

## General Rules

1. **Always prefer context-aware functions** (`HONO_RESPONSE`, `HONO_PAGINATED_RESPONSE`, `HONO_ERROR`) when you have access to the Hono context in route handlers.

2. **Never wrap context-aware functions with `c.json()`** - they already return complete responses:

   ```typescript
   // ❌ WRONG
   return c.json(HONO_RESPONSE(c, { data }), HTTP.OK);

   // ✅ CORRECT
   return HONO_RESPONSE(c, { data });
   ```

3. **Use `_WITHOUT_CONTEXT` functions only when:**

   - Inside hooks that need to return response objects
   - In utility functions that don't have access to context
   - When you need to manually call `c.json()` with the response object

4. **Status codes are handled automatically** by context-aware functions - you don't need to pass them separately.

5. **Import from `@/lib/utils`** for convenience:
   ```typescript
   import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
   ```

## Migration Notes

- Old pattern: `c.json(HONO_ERROR(...), HTTP.XXX)` → New: `HONO_ERROR(c, ...)`
- Old pattern: `c.json(HONO_RESPONSE(...), HTTP.XXX)` → New: `HONO_RESPONSE(c, ...)`
- Old pattern: `c.json(HONO_PAGINATED_RESPONSE(...), HTTP.XXX)` → New: `HONO_PAGINATED_RESPONSE(c, ...)`
