import { createRouter } from "@/lib/core/create-router";
import { DELETE_Handler, DELETE_Route } from "../routes/delete.category.route";
import { GET_Handler, GET_Route } from "../routes/get.category.route";
import {
  GET_ONE_Handler,
  GET_ONE_Route,
} from "../routes/get-one.category.route";
import { PATCH_Handler, PATCH_Route } from "../routes/patch.category.route";
import { POST_Handler, POST_Route } from "../routes/post.category.route";
import { SORT_Route, SORT_Handler } from "../routes/sort.category.route";

export const categoryController = createRouter()
  .openapi(DELETE_Route, DELETE_Handler)
  .openapi(GET_ONE_Route, GET_ONE_Handler)
  .openapi(GET_Route, GET_Handler)
  .openapi(PATCH_Route, PATCH_Handler)
  .openapi(POST_Route, POST_Handler)
  .openapi(SORT_Route, SORT_Handler);
