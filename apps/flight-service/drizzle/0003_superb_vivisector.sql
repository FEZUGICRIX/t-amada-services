CREATE TYPE "public"."flight_class" AS ENUM('ECONOMY', 'BUSINESS');--> statement-breakpoint
ALTER TABLE "flight_bookings" ADD COLUMN "passengers_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "flight_bookings" ADD COLUMN "flight_class" varchar(20);--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "airline_code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "airline_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "departure_city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "arrival_city" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "departure_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "arrival_time" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "has_baggage" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "baggage_weight_kg" integer;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "flight_class" "flight_class" DEFAULT 'ECONOMY' NOT NULL;--> statement-breakpoint
ALTER TABLE "flights" ADD COLUMN "flight_type" varchar(50) DEFAULT 'ONE_WAY';