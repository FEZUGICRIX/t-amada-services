CREATE TYPE "public"."transfer_route_type" AS ENUM('ONE_WAY', 'ROUND_TRIP');--> statement-breakpoint
CREATE TYPE "public"."vehicle_class" AS ENUM('STANDARD', 'MINIVAN');--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "vehicle_class" "vehicle_class" DEFAULT 'STANDARD' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "vehicle_type_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "max_passengers" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "baggage_capacity_info" varchar(255);--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "transfer_route_type" "transfer_route_type" DEFAULT 'ONE_WAY' NOT NULL;