-- Migration 008: Cleanup Old Admin Logs Table
-- Remove the orphaned admin_logs table that was left with RLS disabled
-- The new admin system uses admin_audit_logs instead (from migration 006)

-- Drop the old admin_logs table (not used, RLS disabled)
DROP TABLE IF EXISTS public.admin_logs CASCADE;

-- Verify the new admin_audit_logs table has RLS enabled
DO $$
BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = 'admin_audit_logs' AND relnamespace = 'public'::regnamespace) THEN
    RAISE EXCEPTION 'admin_audit_logs does not have RLS enabled!';
  END IF;
END $$;

-- Comment for clarity
COMMENT ON TABLE admin_audit_logs IS 'Secure audit logs for admin actions - RLS enabled, service role only';
