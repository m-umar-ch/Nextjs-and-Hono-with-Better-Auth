import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  integer,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "@/db/extras/db.utils";
import { file } from "@/db/schema";
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
  (table) => [uniqueIndex("category_slug_idx").on(table.slug)]
);

export const categoryRelations = relations(category, ({ one }) => ({
  img: one(file, { fields: [category.categoryImgID], references: [file.id] }),
}));

export type CategoryTableType = InferSelectModel<typeof category>;

export const categorySchema = toZodV4SchemaTyped(createSelectSchema(category));
