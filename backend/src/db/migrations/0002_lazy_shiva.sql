ALTER TABLE "account" RENAME TO "hono_account";--> statement-breakpoint
ALTER TABLE "session" RENAME TO "hono_session";--> statement-breakpoint
ALTER TABLE "verification" RENAME TO "hono_verification";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "hono_user";--> statement-breakpoint
ALTER TABLE "hono_session" DROP CONSTRAINT "session_token_unique";--> statement-breakpoint
ALTER TABLE "hono_user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "hono_account" DROP CONSTRAINT "account_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hono_session" DROP CONSTRAINT "session_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hono_account" ADD CONSTRAINT "hono_account_user_id_hono_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hono_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hono_session" ADD CONSTRAINT "hono_session_user_id_hono_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hono_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hono_session" ADD CONSTRAINT "hono_session_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "hono_user" ADD CONSTRAINT "hono_user_email_unique" UNIQUE("email");