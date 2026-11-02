CREATE TYPE "public"."insurance_plan_type" AS ENUM('BASIC', 'EXTENDED');--> statement-breakpoint
ALTER TABLE "insurance_policies" ADD COLUMN "plan_type" "insurance_plan_type" DEFAULT 'BASIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_policies" ADD COLUMN "coverage_amount" numeric(12, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_policies" ADD COLUMN "covered_risks" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "insurance_policies" ADD COLUMN "exclusions" text;