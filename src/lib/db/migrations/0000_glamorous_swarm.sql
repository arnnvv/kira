CREATE TABLE IF NOT EXISTS "kira_link" (
	"id" varchar PRIMARY KEY NOT NULL,
	"merchant_id" varchar NOT NULL,
	"url" varchar NOT NULL,
	"isverified" boolean DEFAULT false NOT NULL,
	"upi" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kira_merchant" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar(255) NOT NULL,
	"number" varchar,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "kira_merchant_email_unique" UNIQUE("email"),
	CONSTRAINT "kira_merchant_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kira_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kira_link" ADD CONSTRAINT "kira_link_merchant_id_kira_merchant_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."kira_merchant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "kira_sessions" ADD CONSTRAINT "kira_sessions_user_id_kira_merchant_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."kira_merchant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
