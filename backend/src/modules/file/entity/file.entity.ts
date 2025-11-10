import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "@/db/extras/db.utils";
import { toZodV4SchemaTyped } from "@/lib/utils/zod-utils";

export const file = createTable(
  "file",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug").unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index().on(table.id)]
);

export const fileRelations = relations(file, ({ many, one }) => ({}));

export type FileTableType = InferSelectModel<typeof file>;

export const fileSchema = toZodV4SchemaTyped(createSelectSchema(file));
