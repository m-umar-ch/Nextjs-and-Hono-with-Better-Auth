import { createRouter } from "@/lib/core/create-router";
import { GET_IMG_Handler, GET_IMG_Route } from "../routes/get-img.file.route";
export const fileController = createRouter().openapi(
  GET_IMG_Route,
  GET_IMG_Handler
);
