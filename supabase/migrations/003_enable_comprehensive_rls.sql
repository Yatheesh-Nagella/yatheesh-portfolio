-- ============================================
-- OneLedger Phase 3: Comprehensive RLS Policies
-- ============================================
-- This migration enables Row Level Security on all tables
-- and creates comprehensive policies for all CRUD operations

-- ============================================
-- 1. ADD MISSING COLUMNS FOR MANUAL TRANSACTIONS
-- ============================================

-- Add columns for manual transaction tracking (if they don't exist)
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS is_manual BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;

-- Make plaid_transaction_id nullable for manual transactions
ALTER TABLE public.transactions
  ALTER COLUMN plaid_transaction_id DROP NOT NULL;

-- ============================================
-- 2. DROP EXISTING POLICIES (Clean Slate)
-- ============================================

-- Users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins view all users" ON public.users;

-- Plaid items table
DROP POLICY IF EXISTS "Users view own plaid items" ON public.plaid_items;
DROP POLICY IF EXISTS "System can insert plaid items" ON public.plaid_items;
DROP POLICY IF EXISTS "Users can delete own plaid items" ON public.plaid_items;

-- Accounts table
DROP POLICY IF EXISTS "Users view own accounts" ON public.accounts;
DROP POLICY IF EXISTS "System can insert accounts" ON public.accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON public.accounts;

-- Transactions table
DROP POLICY IF EXISTS "Users view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can insert transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own manual transactions" ON public.transactions;

-- Budgets table
DROP POLICY IF EXISTS "Users manage own budgets" ON public.budgets;

-- Invite codes table
DROP POLICY IF EXISTS "Anyone can view active codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Admins can manage invite codes" ON public.invite_codes;

-- Admin logs table
DROP POLICY IF EXISTS "Admins can view logs" ON public.admin_logs;

-- ============================================
-- 3. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 5. PLAID_ITEMS TABLE POLICIES
-- ============================================

-- Users can view their own Plaid items
CREATE POLICY "Users can view own plaid items"
ON public.plaid_items FOR SELECT
USING (user_id = auth.uid());

-- System/Users can insert Plaid items (for connecting banks)
CREATE POLICY "Users can insert own plaid items"
ON public.plaid_items FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own Plaid items (for sync status)
CREATE POLICY "Users can update own plaid items"
ON public.plaid_items FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own Plaid items (unlink account)
CREATE POLICY "Users can delete own plaid items"
ON public.plaid_items FOR DELETE
USING (user_id = auth.uid());

-- ============================================
-- 6. ACCOUNTS TABLE POLICIES
-- ============================================

-- Users can view their own accounts
CREATE POLICY "Users can view own accounts"
ON public.accounts FOR SELECT
USING (user_id = auth.uid());

-- System/Users can insert accounts (from Plaid sync)
CREATE POLICY "Users can insert own accounts"
ON public.accounts FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own accounts (balances, hidden status)
CREATE POLICY "Users can update own accounts"
ON public.accounts FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own accounts (when unlinking)
CREATE POLICY "Users can delete own accounts"
ON public.accounts FOR DELETE
USING (user_id = auth.uid());

-- ============================================
-- 7. TRANSACTIONS TABLE POLICIES
-- ============================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT
USING (user_id = auth.uid());

-- Users can insert transactions (manual transactions)
CREATE POLICY "Users can insert own transactions"
ON public.transactions FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own transactions (edit manual transactions, add notes)
CREATE POLICY "Users can update own transactions"
ON public.transactions FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete ONLY their manual transactions (not Plaid imports)
CREATE POLICY "Users can delete own manual transactions"
ON public.transactions FOR DELETE
USING (user_id = auth.uid() AND is_manual = true);

-- ============================================
-- 8. BUDGETS TABLE POLICIES
-- ============================================

-- Users can fully manage their own budgets (CRUD)
CREATE POLICY "Users can manage own budgets"
ON public.budgets FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- 9. INVITE_CODES TABLE POLICIES
-- ============================================

-- Anyone can view active, non-expired invite codes (for signup)
CREATE POLICY "Anyone can view active invite codes"
ON public.invite_codes FOR SELECT
USING (
  is_active = true
  AND expires_at > NOW()
  AND used_count < max_uses
);

-- Admins can manage all invite codes
CREATE POLICY "Admins can manage invite codes"
ON public.invite_codes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 10. ADMIN_LOGS TABLE POLICIES
-- ============================================

-- Only admins can view admin logs
CREATE POLICY "Admins can view admin logs"
ON public.admin_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Only admins can insert admin logs
CREATE POLICY "Admins can insert admin logs"
ON public.admin_logs FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- ============================================
-- 11. SERVICE ROLE BYPASS (for server-side operations)
-- ============================================
-- Note: The service role key bypasses RLS automatically
-- This is used in API routes for Plaid sync, etc.
-- No additional policies needed

-- ============================================
-- ✅ RLS IS NOW FULLY ENABLED!
-- ============================================
-- All tables are protected with comprehensive policies
-- Users can only access their own data
-- Admins have elevated access
-- Server-side operations use service role key

-- To verify policies are active, run:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
