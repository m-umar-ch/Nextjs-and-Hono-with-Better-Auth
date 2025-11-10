import { createRouter } from "@/lib/core/create-router";
import { POST_Handler, POST_Route } from "../routes/post.mailer.route";

export const mailerController = createRouter().openapi(
  POST_Route,
  POST_Handler
);
