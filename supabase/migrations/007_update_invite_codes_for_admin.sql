/**
 * Migration 007: Update invite_codes to support admin creators
 *
 * Changes:
 * - Make created_by nullable (for finance users)
 * - Add created_by_admin_id (for admin users)
 * - Add foreign key constraint to admin_users
 * - Handle existing rows with NULL created_by
 */

-- First, let's check and log any rows with NULL created_by (for debugging)
DO $$
DECLARE
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO null_count FROM invite_codes WHERE created_by IS NULL;
  IF null_count > 0 THEN
    RAISE NOTICE 'Found % invite_codes rows with NULL created_by', null_count;
  END IF;
END $$;

-- Make created_by nullable (it currently references users table)
ALTER TABLE invite_codes ALTER COLUMN created_by DROP NOT NULL;

-- Add new column for admin creators
ALTER TABLE invite_codes ADD COLUMN IF NOT EXISTS created_by_admin_id UUID;

-- Add foreign key constraint to admin_users
ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_created_by_admin_id_fkey
  FOREIGN KEY (created_by_admin_id)
  REFERENCES admin_users(id)
  ON DELETE SET NULL;

-- Add check constraint to ensure at least one creator is set
-- Allow both to be NULL for legacy/system-created codes
ALTER TABLE invite_codes
  ADD CONSTRAINT invite_codes_creator_check
  CHECK (
    (created_by IS NOT NULL AND created_by_admin_id IS NULL) OR
    (created_by IS NULL AND created_by_admin_id IS NOT NULL) OR
    (created_by IS NULL AND created_by_admin_id IS NULL)
  );

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_invite_codes_created_by_admin_id
  ON invite_codes(created_by_admin_id);

-- Add comment
COMMENT ON COLUMN invite_codes.created_by_admin_id IS 'Admin user who created this invite code (mutually exclusive with created_by, both NULL for system-generated codes)';
