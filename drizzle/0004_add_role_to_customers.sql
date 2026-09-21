-- Migration to add role column to customers table
ALTER TABLE customers ADD COLUMN role varchar(30) NOT NULL DEFAULT 'customer';
-- Recreate role enum column probably + default, but we do minimal.
