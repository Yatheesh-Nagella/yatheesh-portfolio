 -- ============================================
  -- COMPLETE RLS FIX FOR ONELEDGER
  -- ============================================

  -- Step 1: Disable RLS on ALL tables first
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.invite_codes DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.budgets DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.plaid_items DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.admin_logs DISABLE ROW LEVEL SECURITY;

  -- Step 2: Drop ALL policies
  DO $$
  DECLARE
      pol RECORD;
  BEGIN
      FOR pol IN
          SELECT schemaname, tablename, policyname
          FROM pg_policies
          WHERE schemaname = 'public'
      LOOP
          EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
              pol.policyname, pol.schemaname, pol.tablename);
      END LOOP;
  END $$;

  -- Step 3: Fix the trigger to use SECURITY DEFINER properly
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Step 4: Recreate the trigger
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- Step 5: Create missing user profiles for existing auth users
  INSERT INTO public.users (id, email, full_name)
  SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', '')
  FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
  WHERE pu.id IS NULL;

  -- Step 6: Now enable RLS with SIMPLE policies

  -- USERS TABLE
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "users_select" ON public.users FOR SELECT USING (auth.uid() = id);
  CREATE POLICY "users_update" ON public.users FOR UPDATE USING (auth.uid() = id);
  -- Allow service role to insert (for triggers)
  CREATE POLICY "users_insert" ON public.users FOR INSERT WITH CHECK (true);

  -- INVITE_CODES TABLE
  ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "invite_select" ON public.invite_codes FOR SELECT
    USING (is_active = true AND expires_at > NOW() AND used_count < max_uses);
  CREATE POLICY "invite_update" ON public.invite_codes FOR UPDATE USING (true);

  -- ACCOUNTS TABLE
  ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "accounts_all" ON public.accounts FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  -- TRANSACTIONS TABLE
  ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "transactions_all" ON public.transactions FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  -- BUDGETS TABLE
  ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "budgets_all" ON public.budgets FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  -- PLAID_ITEMS TABLE
  ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "plaid_items_all" ON public.plaid_items FOR ALL
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

  -- ADMIN_LOGS - Keep disabled for now
  ALTER TABLE public.admin_logs DISABLE ROW LEVEL SECURITY;

  -- Step 7: Verify everything
  SELECT 'User Profiles Created:' as status, COUNT(*) as count FROM public.users;
  SELECT 'RLS Policies Active:' as status, COUNT(*) as count FROM pg_policies WHERE schemaname = 'public';