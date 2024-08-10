CREATE TABLE IF NOT EXISTS "kira_link" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"merchant_id" varchar(21) NOT NULL,
	"url" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kira_link" ADD CONSTRAINT "kira_link_merchant_id_kira_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."kira_merchant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
