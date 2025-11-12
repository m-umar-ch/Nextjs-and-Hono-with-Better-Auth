import { createRouter } from "@/lib/core/create-router";
import { GET_Handler, GET_Route } from "../routes/get.siteConfig.route";
import { PATCH_Handler, PATCH_Route } from "../routes/patch.siteConfig.route";
import { POST_Handler, POST_Route } from "../routes/post.siteConfig.route";

export const siteConfigController = createRouter()
  .openapi(GET_Route, GET_Handler)
  .openapi(POST_Route, POST_Handler)
  .openapi(PATCH_Route, PATCH_Handler);
