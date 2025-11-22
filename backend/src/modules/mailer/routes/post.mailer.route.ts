import { createRoute, z } from "@hono/zod-openapi";
import type {
  AppRouteHandler,
  AuthenticatedRouteHandler,
} from "@/lib/core/create-router";
import { HTTP } from "@/lib/http/status-codes";
import { requirePermissions } from "@/lib/middlewares/auth.middleware";
import { APISchema } from "@/lib/schemas/api-schemas";
import { HONO_ERROR, HONO_RESPONSE } from "@/lib/utils";
import { moduleTags } from "@/modules/module.tags";
import { sendEmail } from "../service/mailer.service";

/**
 * @info Zod schema for sendEmail API input validation
 */
export const SendEmailSchema = z
  .object({
    to: z
      .union([
        z.email("Invalid email address"),
        z
          .array(z.email("Invalid email address"))
          .min(1, "At least one recipient required"),
      ])
      .describe("Recipient email address(es)"),
    subject: z.string().min(1, "Subject is required").describe("Email subject"),
    html: z.string().optional().describe("HTML content of the email"),
    text: z.string().optional().describe("Plain text content of the email"),
    from: z
      .email("Invalid from email address")
      .optional()
      .describe("Sender email address"),
    replyTo: z
      .email("Invalid reply-to email address")
      .optional()
      .describe("Reply-to email address"),
    cc: z
      .union([
        z.email("Invalid CC email address"),
        z.array(z.email("Invalid CC email address")),
      ])
      .optional()
      .describe("CC email address(es)"),
    bcc: z
      .union([
        z.email("Invalid BCC email address"),
        z.array(z.email("Invalid BCC email address")),
      ])
      .optional()
      .describe("BCC email address(es)"),
  })
  .refine((data) => data.html || data.text, {
    message: "Either html or text content must be provided",
    path: ["html", "text"],
  });

export const POST_Route = createRoute({
  path: "/mailer/send",
  method: "post",
  tags: moduleTags.mailer,
  summary: "Use Resend Mailers",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SendEmailSchema,
        },
      },
    },
  },
  /**
   * @todo add mailer route
   */
  // middleware: [requirePermissions({})],
  responses: {
    [HTTP.OK]: APISchema.OK,
    [HTTP.BAD_REQUEST]: APISchema.BAD_REQUEST,
    [HTTP.UNPROCESSABLE_ENTITY]: APISchema.UNPROCESSABLE_ENTITY,
    [HTTP.INTERNAL_SERVER_ERROR]: APISchema.INTERNAL_SERVER_ERROR,
  },
});

export const POST_Handler: AuthenticatedRouteHandler<
  typeof POST_Route
> = async (c) => {
  try {
    const emailData = c.req.valid("json");

    // Send the email using the validated data
    const result = await sendEmail(emailData);

    if (!result.success) {
      return HONO_ERROR(c, "BAD_REQUEST", "Failed to send email", {
        issues: [{ message: result.error || "Unknown error occurred" }],
      });
    }

    return HONO_RESPONSE(c, {
      message: "Email sent successfully",
      data: result.data,
      statusCode: "OK",
    });
  } catch (error) {
    return HONO_ERROR(c, "INTERNAL_SERVER_ERROR", "Internal server error", {
      issues: [
        {
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        },
      ],
      error,
    });
  }
};
