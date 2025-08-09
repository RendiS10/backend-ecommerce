-- ============================================================================
-- MIGRATION SCRIPT: Update order_status column to use ENUM with new values
-- ============================================================================

-- 1. Backup existing data (optional)
-- CREATE TABLE orders_backup AS SELECT * FROM orders;

-- 2. Update existing data to use new status values
UPDATE orders 
SET order_status = CASE 
    WHEN order_status IN ('1', 'pending', 'pending_payment', 'new') THEN 'Menunggu Konfirmasi'
    WHEN order_status IN ('2', 'confirmed', 'paid') THEN 'Diproses'
    WHEN order_status IN ('3', 'processing', 'process') THEN 'Diproses'
    WHEN order_status IN ('4', 'shipped', 'ship') THEN 'Dikirim'
    WHEN order_status IN ('5', 'delivered', 'done', 'completed') THEN 'Selesai'
    WHEN order_status IN ('9', 'cancelled', 'canceled') THEN 'Dibatalkan'
    ELSE 'Menunggu Konfirmasi'
END;

-- 3. Modify column to use ENUM type
ALTER TABLE orders 
MODIFY COLUMN order_status 
ENUM('Menunggu Konfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') 
NOT NULL 
DEFAULT 'Menunggu Konfirmasi';

-- 4. Verify the changes
SELECT DISTINCT order_status, COUNT(*) as count 
FROM orders 
GROUP BY order_status;

-- 5. Show updated table structure
DESCRIBE orders;
