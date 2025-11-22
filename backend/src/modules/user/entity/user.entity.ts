import type { InferSelectModel } from "drizzle-orm";
import { boolean, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "@/db/extras/db.utils";
import { toZodV4SchemaTyped } from "@/lib/utils/zod-utils";
import { Roles } from "@/modules/auth/service/permissions";

export const user = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default(Roles.DEFAULT).notNull(), // Role-based authentication field
  banned: boolean("banned").default(false), // Better Auth admin plugin field
  banReason: text("ban_reason"), // Better Auth admin plugin field
  banExpires: timestamp("ban_expires"), // Better Auth admin plugin field
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User relations
// export const userRelations = relations(user, ({ many, one }) => ({}));

// Export user type
export type UserTableType = InferSelectModel<typeof user>;

export const UserSchema = toZodV4SchemaTyped(createSelectSchema(user));
