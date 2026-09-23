-- Add addresses table
CREATE TABLE IF NOT EXISTS "addresses" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "customer_id" uuid NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "name" varchar(160) NOT NULL,
    "recipient_name" varchar(160) NOT NULL,
    "phone" varchar(40) NOT NULL,
    "street" varchar(200) NOT NULL,
    "exterior_number" varchar(20),
    "interior_number" varchar(20),
    "neighborhood" varchar(160),
    "city" varchar(100) NOT NULL,
    "state" varchar(100) NOT NULL,
    "postal_code" varchar(10) NOT NULL,
    "country" varchar(2) NOT NULL DEFAULT 'MX',
    "is_default" boolean NOT NULL DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add shot_id to quiz_option_weights (if not exists)
ALTER TABLE "quiz_option_weights" ADD COLUMN IF NOT EXISTS "shot_id" uuid REFERENCES "shots"("id") ON DELETE CASCADE;