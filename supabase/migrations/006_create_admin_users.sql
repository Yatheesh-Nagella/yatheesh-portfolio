-- Migration 006: Create Admin Users Table
-- Separate authentication system for admin dashboard with TOTP 2FA

-- Admin users table (separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,

  -- TOTP 2FA fields
  totp_secret TEXT, -- Encrypted TOTP secret
  totp_enabled BOOLEAN DEFAULT false,
  totp_verified BOOLEAN DEFAULT false,
  backup_codes TEXT[], -- Encrypted backup codes

  -- Session management
  last_login_at TIMESTAMPTZ,
  last_login_ip TEXT,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,

  -- Account status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin audit logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'login', 'logout', 'create_invite', 'delete_user', etc.
  resource_type TEXT, -- 'user', 'invite_code', 'settings', etc.
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX idx_admin_audit_logs_admin_user_id ON admin_audit_logs(admin_user_id);
CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (very restrictive for admin tables)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin tables are only accessible via service role
-- No RLS policies - must use service role client for all admin operations

-- Grant permissions to service role
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON admin_sessions TO service_role;
GRANT ALL ON admin_audit_logs TO service_role;

-- Comments
COMMENT ON TABLE admin_users IS 'Admin users with TOTP 2FA - separate from finance users';
COMMENT ON TABLE admin_sessions IS 'Admin session tokens with expiry';
COMMENT ON TABLE admin_audit_logs IS 'Audit trail of all admin actions';
COMMENT ON COLUMN admin_users.totp_secret IS 'Encrypted TOTP secret for 2FA';
COMMENT ON COLUMN admin_users.backup_codes IS 'Encrypted backup codes for account recovery';
