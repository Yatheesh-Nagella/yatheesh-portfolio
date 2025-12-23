-- Migration: Create invite_code_requests table
-- Phase: Invite Code Request System
-- Date: 2025-01-23

-- Create invite_code_requests table
CREATE TABLE IF NOT EXISTS invite_code_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'rejected')),
  notes TEXT,
  invite_code_id UUID REFERENCES invite_codes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_invite_requests_email ON invite_code_requests(email);
CREATE INDEX IF NOT EXISTS idx_invite_requests_status ON invite_code_requests(status);
CREATE INDEX IF NOT EXISTS idx_invite_requests_created_at ON invite_code_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE invite_code_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to insert (public request form)
CREATE POLICY "Anyone can request invite codes"
  ON invite_code_requests FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only service role can select/update/delete (admin panel uses service role client)
-- No SELECT policy needed as admins will use supabaseAdmin (service role client)

-- Add comment to table
COMMENT ON TABLE invite_code_requests IS 'Stores user requests for invite codes from the login page';
COMMENT ON COLUMN invite_code_requests.status IS 'Status of the request: pending, sent, or rejected';
COMMENT ON COLUMN invite_code_requests.invite_code_id IS 'References the invite code that was sent to the requester';
COMMENT ON COLUMN invite_code_requests.processed_by IS 'Admin user who processed this request';
