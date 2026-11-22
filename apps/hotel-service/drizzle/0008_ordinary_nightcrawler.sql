ALTER TABLE "hotel_rooms" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "address" varchar(255);--> statement-breakpoint
ALTER TABLE "hotels" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "hotels" DROP COLUMN "has_free_cancellation";