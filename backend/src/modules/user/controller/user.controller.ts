import { createRouter } from "@/lib/core/create-router";
import {
  CHANGE_ROLE_Handler,
  CHANGE_ROLE_Route,
} from "../routes/change-role.user.route";
import { GET_Handler, GET_Route } from "../routes/get.user.route";
import { GET_ONE_Handler, GET_ONE_Route } from "../routes/get-one.user.route";

export const userController = createRouter()
  .openapi(GET_Route, GET_Handler)
  .openapi(GET_ONE_Route, GET_ONE_Handler)
  .openapi(CHANGE_ROLE_Route, CHANGE_ROLE_Handler);
