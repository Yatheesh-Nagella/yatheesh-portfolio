/**
 * Custom database type definitions
 * These types represent the structure of data from Supabase tables
 * Updated to match the actual database schema
 */

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean | null;
  account_status: string | null;
  invite_code: string | null;
  invited_by: string | null;
  invite_expires_at: string | null;
  created_at: string | null;
  last_login_at: string | null;
}

export interface Account {
  id: string;
  user_id: string | null;
  plaid_item_id: string | null;
  plaid_account_id: string;
  account_name: string | null;
  account_type: string | null;
  current_balance: number | null;
  available_balance: number | null;
  currency: string | null;
  is_hidden: boolean | null;
  created_at: string | null;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  account_id: string | null;
  plaid_transaction_id: string;
  amount: number;
  transaction_date: string;
  merchant_name: string | null;
  category: string | null;
  is_pending: boolean | null;
  is_hidden: boolean | null;
  user_notes: string | null;
  currency: string | null;
  created_at: string | null;
}

export interface Budget {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  amount: number;
  spent_amount: number | null;
  period: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface InviteCode {
  id: string;
  code: string;
  created_by: string | null;
  expires_at: string;
  used_count: number | null;
  max_uses: number | null;
  is_active: boolean | null;
  created_at: string | null;
}

export interface PlaidItem {
  id: string;
  user_id: string | null;
  plaid_item_id: string;
  access_token: string;
  institution_id: string | null;
  institution_name: string | null;
  status: string | null;
  error_message: string | null;
  last_synced_at: string | null;
  created_at: string | null;
}
