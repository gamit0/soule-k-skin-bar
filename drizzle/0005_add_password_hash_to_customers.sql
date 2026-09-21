-- Migration to add password_hash column to customers table
ALTER TABLE customers ADD COLUMN password_hash varchar(191) NOT NULL DEFAULT '';
