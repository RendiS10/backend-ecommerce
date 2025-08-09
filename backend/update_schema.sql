-- SQL script to update order_status column to accommodate longer values
-- Run this in your MySQL database

-- Check current column definition
DESCRIBE orders;

-- Update the order_status column to allow longer text
ALTER TABLE orders MODIFY COLUMN order_status VARCHAR(20) NOT NULL DEFAULT 'new';

-- Verify the change
DESCRIBE orders;
