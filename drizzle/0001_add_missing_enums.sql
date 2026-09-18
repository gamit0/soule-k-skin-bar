-- Migration: Add missing enum values for MVP
-- P-05: Add sensitive, redness to concern enum
-- P-06: Add toner, eye_cream, special_care to routine_step enum

-- Add missing concern values
ALTER TYPE concern ADD VALUE IF NOT EXISTS 'sensitive' AFTER 'oiliness';
ALTER TYPE concern ADD VALUE IF NOT EXISTS 'redness' AFTER 'sensitive';

-- Add missing routine_step values
ALTER TYPE routine_step ADD VALUE IF NOT EXISTS 'toner' AFTER 'cleanser';
ALTER TYPE routine_step ADD VALUE IF NOT EXISTS 'eye_cream' AFTER 'serum';
ALTER TYPE routine_step ADD VALUE IF NOT EXISTS 'special_care' AFTER 'treatment';
