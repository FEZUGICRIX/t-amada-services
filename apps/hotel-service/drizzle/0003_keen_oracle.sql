ALTER TABLE "hotels" ADD COLUMN "stars" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "location_tag" varchar(255);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "image_url" varchar(500);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "has_breakfast" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "has_free_cancellation" boolean DEFAULT false NOT NULL;