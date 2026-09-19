-- Migration: Add shots table and update quiz_option_weights to reference shots
-- Created: 2025-09-18

-- Create shots table
CREATE TABLE IF NOT EXISTS "shots" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "slug" varchar(160) NOT NULL UNIQUE,
    "name" varchar(160) NOT NULL,
    "menu_title" varchar(160),
    "subtitle" varchar(280),
    "category" varchar(120),
    "description" text,
    "icon" varchar(60),
    "mood" varchar(20) NOT NULL,
    "concerns" "concern"[] DEFAULT '{}' NOT NULL,
    "skin_types" "skin_type"[] DEFAULT '{}' NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create shot_products table
CREATE TABLE IF NOT EXISTS "shot_products" (
    "shot_id" uuid NOT NULL REFERENCES "shots"("id") ON DELETE CASCADE,
    "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "order" integer DEFAULT 0 NOT NULL,
    PRIMARY KEY ("shot_id", "product_id")
);

-- Update quiz_option_weights: drop cocktail_id, add shot_id
ALTER TABLE "quiz_option_weights" DROP COLUMN IF EXISTS "cocktail_id";
ALTER TABLE "quiz_option_weights" ADD COLUMN IF NOT EXISTS "shot_id" uuid NOT NULL REFERENCES "shots"("id") ON DELETE CASCADE;

-- Update primary key to include shot_id
ALTER TABLE "quiz_option_weights" DROP CONSTRAINT IF EXISTS "quiz_option_weights_option_id_cocktail_id_pk";
ALTER TABLE "quiz_option_weights" ADD CONSTRAINT "quiz_option_weights_option_id_shot_id_pk" PRIMARY KEY ("option_id", "shot_id");