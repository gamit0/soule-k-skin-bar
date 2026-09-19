-- Migration: Add "all" to skin_type enum and fix quizOptionWeights
-- Created: 2025-09-18

-- Add "all" to skin_type enum
ALTER TYPE "public"."skin_type" ADD VALUE IF NOT EXISTS 'all' AFTER 'sensitive';

-- Update quizOptionWeights in admin to use shotId (already done in schema)
-- This is just a migration record