import { createRouter } from "@/lib/core/create-router";
import {
  DELETE_Handler,
  DELETE_Route,
} from "../routes/delete.siteConfig.route";
import { GET_Handler, GET_Route } from "../routes/get.siteConfig.route";
import {
  GET_ONE_Handler,
  GET_ONE_Route,
} from "../routes/get-one.siteConfig.route";
import { PATCH_Handler, PATCH_Route } from "../routes/patch.siteConfig.route";
import { POST_Handler, POST_Route } from "../routes/post.siteConfig.route";

export const siteConfigController = createRouter()
  .openapi(DELETE_Route, DELETE_Handler)
  .openapi(GET_ONE_Route, GET_ONE_Handler)
  .openapi(GET_Route, GET_Handler)
  .openapi(PATCH_Route, PATCH_Handler)
  .openapi(POST_Route, POST_Handler);
