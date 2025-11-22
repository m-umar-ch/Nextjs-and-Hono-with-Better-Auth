import { z } from "@hono/zod-openapi";
import { categorySchema } from "../entity/category.entity";

export const categoryWithImgSchema = categorySchema.and(
  z.object({
    img: z.object({ slug: z.string() }).nullable(),
    totalProducts: z.number(),
  })
);
