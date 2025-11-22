CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'out-of-stock');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "hono_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hono_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "hono_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "hono_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hono_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"category_img_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hono_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hono_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hono_file_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hono_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hono_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "hono_siteConfig" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_owner_email" varchar NOT NULL,
	"store_contact_email" varchar NOT NULL,
	"site_logo_id" uuid,
	"store_name" varchar NOT NULL,
	"store_address" varchar,
	"store_google_map_url" varchar DEFAULT '#',
	"store_google_map_iframe_url" varchar DEFAULT '#',
	"facebook_url" varchar DEFAULT '#',
	"instagram_url" varchar DEFAULT '#',
	"linkedin_url" varchar DEFAULT '#',
	"tiktok_url" varchar DEFAULT '#',
	"youtube_url" varchar DEFAULT '#',
	"store_contact_whatsapp_number" varchar,
	"footer_description" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hono_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"category_sort_order" integer DEFAULT 0 NOT NULL,
	"name" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"sale_price" integer NOT NULL,
	"description" text,
	"meta_title" text,
	"meta_description" text,
	"category_slug" varchar(255),
	"status_slug" "product_status" DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hono_product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hono_product_image" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"product_id" uuid NOT NULL,
	"img_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "productImage_product_img_comp_key" UNIQUE("img_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "hono_order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"city" varchar(63) NOT NULL,
	"shipping_address" text NOT NULL,
	"note" text,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"total_price" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"userID" varchar(255),
	CONSTRAINT "hono_order_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "hono_order_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hono_account" ADD CONSTRAINT "hono_account_user_id_hono_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hono_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hono_session" ADD CONSTRAINT "hono_session_user_id_hono_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hono_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hono_category" ADD CONSTRAINT "hono_category_category_img_id_hono_file_id_fk" FOREIGN KEY ("category_img_id") REFERENCES "public"."hono_file"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_siteConfig" ADD CONSTRAINT "hono_siteConfig_site_logo_id_hono_file_id_fk" FOREIGN KEY ("site_logo_id") REFERENCES "public"."hono_file"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_product" ADD CONSTRAINT "hono_product_category_slug_hono_category_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."hono_category"("slug") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_product_image" ADD CONSTRAINT "hono_product_image_product_id_hono_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."hono_product"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_product_image" ADD CONSTRAINT "hono_product_image_img_id_hono_file_id_fk" FOREIGN KEY ("img_id") REFERENCES "public"."hono_file"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_order" ADD CONSTRAINT "hono_order_userID_hono_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."hono_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hono_order_item" ADD CONSTRAINT "hono_order_item_order_id_hono_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."hono_order"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "hono_order_item" ADD CONSTRAINT "hono_order_item_product_id_hono_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."hono_product"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_idx" ON "hono_category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "hono_file_id_index" ON "hono_file" USING btree ("id");--> statement-breakpoint
CREATE INDEX "hono_siteConfig_id_index" ON "hono_siteConfig" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "product_slug_idx" ON "hono_product" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "product_category_slug_idx" ON "hono_product" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "product_search_vector_idx" ON "hono_product" USING gin ((
        setweight(to_tsvector('english', COALESCE("name", '')), 'A') ||
        setweight(to_tsvector('english', COALESCE("slug", '')), 'B') ||
        setweight(to_tsvector('english', COALESCE("description", '')), 'C') ||
        setweight(to_tsvector('english', COALESCE("meta_title", '')), 'D') ||
        setweight(to_tsvector('english', COALESCE("meta_description", '')), 'D')
      ));--> statement-breakpoint
CREATE INDEX "productImage_productID_idx" ON "hono_product_image" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "productImage_imageID_idx" ON "hono_product_image" USING btree ("img_id");--> statement-breakpoint
CREATE INDEX "order_userID_idx" ON "hono_order" USING btree ("userID");--> statement-breakpoint
CREATE INDEX "order_status_idx" ON "hono_order" USING btree ("status");--> statement-breakpoint
CREATE INDEX "order_orderNumber_idx" ON "hono_order" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "order_item_orderID_idx" ON "hono_order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_item_productID_idx" ON "hono_order_item" USING btree ("product_id");