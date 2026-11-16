CREATE TABLE "hotel_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hotel_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"capacity_adults" integer DEFAULT 2 NOT NULL,
	"capacity_children" integer DEFAULT 1 NOT NULL,
	"has_breakfast" boolean DEFAULT false NOT NULL,
	"has_free_cancellation" boolean DEFAULT false NOT NULL,
	"available_rooms" integer NOT NULL,
	"price_per_night" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hotel_bookings" ALTER COLUMN "hotel_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD COLUMN "room_id" uuid;--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD COLUMN "rooms_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel_rooms" ADD CONSTRAINT "hotel_rooms_hotel_id_hotels_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotel_bookings" ADD CONSTRAINT "hotel_bookings_room_id_hotel_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."hotel_rooms"("id") ON DELETE cascade ON UPDATE no action;