ALTER TABLE "flights" ADD COLUMN "departure_airport" varchar(10) DEFAULT 'SVO' NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "arrival_airport" varchar(10) DEFAULT 'AER' NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "departure_utc_offset_minutes" integer DEFAULT 180 NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "arrival_utc_offset_minutes" integer DEFAULT 180 NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "stops_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "stops" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "segment_minutes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
CREATE INDEX "flights_stops_count_idx" ON "flights" USING btree ("stops_count");