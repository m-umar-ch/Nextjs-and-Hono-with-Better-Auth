DROP INDEX "hono_category_id_index";--> statement-breakpoint
DROP INDEX "hono_category_slug_index";--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_idx" ON "hono_category" USING btree ("slug");