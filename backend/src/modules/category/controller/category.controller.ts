import { createRouter } from "@/lib/core/create-router";
import { DELETE_Route, DELETE_Handler } from "../routes/delete.category.route";
import {
  GET_ONE_Route,
  GET_ONE_Handler,
} from "../routes/get-one.category.route";
import { GET_Route, GET_Handler } from "../routes/get.category.route";
import { PATCH_Route, PATCH_Handler } from "../routes/patch.category.route";
import { POST_Route, POST_Handler } from "../routes/post.category.route";

export const categoryController = createRouter()
  .openapi(DELETE_Route, DELETE_Handler)
  // .openapi(GET_ONE_Route, GET_ONE_Handler)
  .openapi(GET_Route, GET_Handler)
  .openapi(PATCH_Route, PATCH_Handler)
  .openapi(POST_Route, POST_Handler);
