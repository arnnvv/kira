ALTER TABLE "kira_users" RENAME TO "kira_merchant";--> statement-breakpoint
ALTER TABLE "kira_merchant" DROP CONSTRAINT "kira_users_email_unique";--> statement-breakpoint
ALTER TABLE "kira_merchant" DROP CONSTRAINT "kira_users_number_unique";--> statement-breakpoint
ALTER TABLE "kira_sessions" DROP CONSTRAINT "kira_sessions_user_id_kira_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kira_sessions" ADD CONSTRAINT "kira_sessions_user_id_kira_merchant_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."kira_merchant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "kira_merchant" ADD CONSTRAINT "kira_merchant_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "kira_merchant" ADD CONSTRAINT "kira_merchant_number_unique" UNIQUE("number");