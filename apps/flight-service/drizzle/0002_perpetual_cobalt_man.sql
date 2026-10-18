ALTER TYPE "public"."flight_booking_status" ADD VALUE 'PROCESSING' BEFORE 'CONFIRMED';--> statement-breakpoint
ALTER TYPE "public"."flight_booking_status" ADD VALUE 'FAILED' BEFORE 'CANCELLED';--> statement-breakpoint
ALTER TYPE "public"."flight_booking_status" ADD VALUE 'CANCELLING' BEFORE 'CANCELLED';