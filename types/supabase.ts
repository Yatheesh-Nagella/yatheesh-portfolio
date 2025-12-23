export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string | null
          account_type: string | null
          available_balance: number | null
          created_at: string | null
          currency: string | null
          current_balance: number | null
          id: string
          is_hidden: boolean | null
          plaid_account_id: string
          plaid_item_id: string | null
          user_id: string | null
        }
        Insert: {
          account_name?: string | null
          account_type?: string | null
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          is_hidden?: boolean | null
          plaid_account_id: string
          plaid_item_id?: string | null
          user_id?: string | null
        }
        Update: {
          account_name?: string | null
          account_type?: string | null
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          is_hidden?: boolean | null
          plaid_account_id?: string
          plaid_item_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_plaid_item_id_fkey"
            columns: ["plaid_item_id"]
            isOneToOne: false
            referencedRelation: "plaid_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          token: string
          user_agent: string | null
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          token: string
          user_agent?: string | null
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          email: string
          failed_login_attempts: number | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          last_login_ip: string | null
          locked_until: string | null
          password_hash: string
          totp_enabled: boolean | null
          totp_secret: string | null
          totp_verified: boolean | null
          updated_at: string | null
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          email: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          locked_until?: string | null
          password_hash: string
          totp_enabled?: boolean | null
          totp_secret?: string | null
          totp_verified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          email?: string
          failed_login_attempts?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          last_login_ip?: string | null
          locked_until?: string | null
          password_hash?: string
          totp_enabled?: boolean | null
          totp_secret?: string | null
          totp_verified?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      budget_alert_history: {
        Row: {
          alerted_at: string | null
          budget_amount: number
          budget_id: string
          email_log_id: string | null
          id: string
          period: string
          spent_amount: number
          threshold_percentage: number
          user_id: string
        }
        Insert: {
          alerted_at?: string | null
          budget_amount: number
          budget_id: string
          email_log_id?: string | null
          id?: string
          period: string
          spent_amount: number
          threshold_percentage: number
          user_id: string
        }
        Update: {
          alerted_at?: string | null
          budget_amount?: number
          budget_id?: string
          email_log_id?: string | null
          id?: string
          period?: string
          spent_amount?: number
          threshold_percentage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_alert_history_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_alert_history_email_log_id_fkey"
            columns: ["email_log_id"]
            isOneToOne: false
            referencedRelation: "email_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_alert_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          period: string | null
          spent_amount: number | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          period?: string | null
          spent_amount?: number | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          period?: string | null
          spent_amount?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          target_audience: Json | null
          template_key: string | null
          total_bounced: number | null
          total_clicked: number | null
          total_delivered: number | null
          total_opened: number | null
          total_recipients: number | null
          total_sent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          target_audience?: Json | null
          template_key?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          target_audience?: Json | null
          template_key?: string | null
          total_bounced?: number | null
          total_clicked?: number | null
          total_delivered?: number | null
          total_opened?: number | null
          total_recipients?: number | null
          total_sent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_key_fkey"
            columns: ["template_key"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["template_key"]
          },
        ]
      }
      email_logs: {
        Row: {
          bounced_at: string | null
          category: string
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          recipient_email: string
          resend_email_id: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_key: string | null
          user_id: string | null
        }
        Insert: {
          bounced_at?: string | null
          category: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email: string
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_key?: string | null
          user_id?: string | null
        }
        Update: {
          bounced_at?: string | null
          category?: string
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email?: string
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_key?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_key_fkey"
            columns: ["template_key"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["template_key"]
          },
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          html_content: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          subject_template: string
          template_key: string
          template_name: string
          template_path: string | null
          template_type: string | null
          total_sent: number | null
          updated_at: string | null
          variables: Json | null
          version: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          subject_template: string
          template_key: string
          template_name: string
          template_path?: string | null
          template_type?: string | null
          total_sent?: number | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          subject_template?: string
          template_key?: string
          template_name?: string
          template_path?: string | null
          template_type?: string | null
          total_sent?: number | null
          updated_at?: string | null
          variables?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          created_by_admin_id: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          created_by_admin_id?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          created_by_admin_id?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_created_by_admin_id_fkey"
            columns: ["created_by_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_code_requests: {
        Row: {
          id: string
          email: string
          name: string
          status: string
          notes: string | null
          invite_code_id: string | null
          created_at: string
          updated_at: string
          processed_by: string | null
          processed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          status?: string
          notes?: string | null
          invite_code_id?: string | null
          created_at?: string
          updated_at?: string
          processed_by?: string | null
          processed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          status?: string
          notes?: string | null
          invite_code_id?: string | null
          created_at?: string
          updated_at?: string
          processed_by?: string | null
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invite_code_requests_invite_code_id_fkey"
            columns: ["invite_code_id"]
            isOneToOne: false
            referencedRelation: "invite_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invite_code_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          account_security: boolean | null
          alert_frequency: string | null
          budget_alert_threshold: number | null
          budget_alerts: boolean | null
          created_at: string | null
          email_enabled: boolean | null
          id: string
          large_transaction_threshold: number | null
          marketing_emails: boolean | null
          transaction_alerts: boolean | null
          updated_at: string | null
          user_id: string
          weekly_summary: boolean | null
        }
        Insert: {
          account_security?: boolean | null
          alert_frequency?: string | null
          budget_alert_threshold?: number | null
          budget_alerts?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          large_transaction_threshold?: number | null
          marketing_emails?: boolean | null
          transaction_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_summary?: boolean | null
        }
        Update: {
          account_security?: boolean | null
          alert_frequency?: string | null
          budget_alert_threshold?: number | null
          budget_alerts?: boolean | null
          created_at?: string | null
          email_enabled?: boolean | null
          id?: string
          large_transaction_threshold?: number | null
          marketing_emails?: boolean | null
          transaction_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_summary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_items: {
        Row: {
          access_token: string
          created_at: string | null
          error_message: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          last_synced_at: string | null
          plaid_item_id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          plaid_item_id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          last_synced_at?: string | null
          plaid_item_id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          created_at: string | null
          currency: string | null
          edited_at: string | null
          id: string
          is_hidden: boolean | null
          is_manual: boolean | null
          is_pending: boolean | null
          merchant_name: string | null
          notes: string | null
          plaid_transaction_id: string | null
          transaction_date: string
          user_id: string | null
          user_notes: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          created_at?: string | null
          currency?: string | null
          edited_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_manual?: boolean | null
          is_pending?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          plaid_transaction_id?: string | null
          transaction_date: string
          user_id?: string | null
          user_notes?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          created_at?: string | null
          currency?: string | null
          edited_at?: string | null
          id?: string
          is_hidden?: boolean | null
          is_manual?: boolean | null
          is_pending?: boolean | null
          merchant_name?: string | null
          notes?: string | null
          plaid_transaction_id?: string | null
          transaction_date?: string
          user_id?: string | null
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_status: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          invite_code: string | null
          invite_expires_at: string | null
          invited_by: string | null
          is_admin: boolean | null
          last_login_at: string | null
        }
        Insert: {
          account_status?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          invite_code?: string | null
          invite_expires_at?: string | null
          invited_by?: string | null
          is_admin?: boolean | null
          last_login_at?: string | null
        }
        Update: {
          account_status?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          invite_code?: string | null
          invite_expires_at?: string | null
          invited_by?: string | null
          is_admin?: boolean | null
          last_login_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_admin_sessions: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
