import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { index, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { createTable } from "@/db/extras/db.utils";
import { file } from "@/db/schema";
import { toZodV4SchemaTyped } from "@/lib/utils/zod-utils";

export const siteConfig = createTable(
  "siteConfig",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    siteLogoId: uuid("site_logo_id").references(() => file.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    storeName: varchar("store_name").notNull(),
    storeAddress: varchar("store_address"),
    storeGoogleMapUrl: varchar("store_google_map_url").default("#"),
    storeGoogleMapIframeUrl: varchar("store_google_map_iframe_url").default(
      "#"
    ),
    facebookUrl: varchar("facebook_url").default("#"),
    instagramUrl: varchar("instagram_url").default("#"),
    linkedinUrl: varchar("linkedin_url").default("#"),
    tiktokUrl: varchar("tiktok_url").default("#"),
    youtubeUrl: varchar("youtube_url").default("#"),
    storeContactEmail: varchar("store_contact_email"),
    storeContactWhatsappNumber: varchar("store_contact_whatsapp_number"),
    footerDescription: varchar("footer_description"),
    siteOwnerEmail: varchar("site_owner_email"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index().on(table.id)]
);

export const siteConfigRelations = relations(siteConfig, ({ one }) => ({
  siteLogo: one(file, {
    fields: [siteConfig.siteLogoId],
    references: [file.id],
  }),
}));

export type SiteConfigTableType = InferSelectModel<typeof siteConfig>;

export const SiteConfigSchema = toZodV4SchemaTyped(
  createSelectSchema(siteConfig)
);
