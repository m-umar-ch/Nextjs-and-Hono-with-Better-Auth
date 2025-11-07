import { createRouter } from "@/lib/core/create-router";
import { GET_IMG_Route, GET_IMG_Handler } from "../routes/get-img.file.route";
export const fileController = createRouter().openapi(
  GET_IMG_Route,
  GET_IMG_Handler
);
