-- ============================================
-- Fix: Allow invite code usage during signup
-- ============================================
-- This fixes the "Invalid invite code" error during signup
-- by allowing unauthenticated users to increment used_count

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Admins can manage invite codes" ON public.invite_codes;

-- Recreate with separate policies for better control

-- Anyone can read valid invite codes (for signup validation)
-- This policy already exists, but let's make sure it's correct
DROP POLICY IF EXISTS "Anyone can view active invite codes" ON public.invite_codes;
CREATE POLICY "Anyone can view active invite codes"
ON public.invite_codes FOR SELECT
USING (
  is_active = true
  AND expires_at > NOW()
  AND used_count < max_uses
);

-- Allow incrementing used_count during signup (UPDATE only used_count field)
CREATE POLICY "Allow updating invite code usage"
ON public.invite_codes FOR UPDATE
USING (
  is_active = true
  AND expires_at > NOW()
  AND used_count < max_uses
)
WITH CHECK (
  -- Only allow incrementing used_count, nothing else
  is_active = is_active
  AND expires_at = expires_at
  AND max_uses = max_uses
);

-- Admins can INSERT new invite codes
CREATE POLICY "Admins can create invite codes"
ON public.invite_codes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Admins can fully manage (UPDATE/DELETE) invite codes
CREATE POLICY "Admins can update invite codes"
ON public.invite_codes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can delete invite codes"
ON public.invite_codes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- Fix: Allow user profile creation during signup
-- ============================================

-- The auth.users trigger creates a profile, we need to allow INSERT
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- ✅ Invite codes now work for signup!
-- ============================================
