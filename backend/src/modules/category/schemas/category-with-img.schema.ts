import { z } from "@hono/zod-openapi";
import { fileSchema } from "@/db/schema";
import { categorySchema } from "../entity/category.entity";

export const categoryWithImgSchema = categorySchema.and(
  z.object({
    img: fileSchema.nullable(),
    /**
     * @todo uncomment this when product modules is completed
     */
    // totalProducts: z.number(),
  })
);
