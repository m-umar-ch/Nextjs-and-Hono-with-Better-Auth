import { index, integer, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { createTable } from "@/db/extras/db.utils";
import { file } from "@/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { toZodV4SchemaTyped } from "@/lib/utils/zod-utils";

export const category = createTable(
  "category",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").unique().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    categoryImgID: uuid("category_img_id").references(() => file.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index().on(table.id), index().on(table.slug)]
);

export const categoryRelations = relations(category, ({ many, one }) => ({
  img: one(file, { fields: [category.categoryImgID], references: [file.id] }),
}));

export type CategoryTableType = InferSelectModel<typeof category>;

export const categorySchema = toZodV4SchemaTyped(createSelectSchema(category));
