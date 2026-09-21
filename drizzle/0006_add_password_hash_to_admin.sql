-- Migration to add password_hash column to admin_users table
ALTER TABLE admin_users ADD COLUMN password_hash varchar(191);
