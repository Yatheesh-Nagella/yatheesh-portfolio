'use client';

/**
 * Notification Preferences Page
 * Users can manage their email notification settings
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  Bell,
  DollarSign,
  TrendingUp,
  Shield,
  Loader2,
  Save,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  marketing_emails: boolean;
  budget_alerts: boolean;
  transaction_alerts: boolean;
  weekly_summary: boolean;
  account_security: boolean;
  budget_alert_threshold: number;
  large_transaction_threshold: number;
  alert_frequency: 'immediate' | 'daily_digest' | 'weekly_digest';
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  async function fetchPreferences() {
    if (!user?.id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows, which is fine (we'll create one)
        throw error;
      }

      if (data) {
        setPreferences(data as NotificationPreferences);
      } else {
        // Create default preferences if none exist
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  }

  async function createDefaultPreferences() {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          email_enabled: true,
          marketing_emails: true,
          budget_alerts: true,
          transaction_alerts: false,
          weekly_summary: true,
          account_security: true,
          budget_alert_threshold: 80,
          large_transaction_threshold: 50000,
          alert_frequency: 'immediate',
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data as NotificationPreferences);
      toast.success('Default preferences created');
    } catch (error) {
      console.error('Error creating preferences:', error);
      toast.error('Failed to create preferences');
    }
  }

  async function savePreferences() {
    if (!preferences || !user?.id) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('notification_preferences')
        .update({
          email_enabled: preferences.email_enabled,
          marketing_emails: preferences.marketing_emails,
          budget_alerts: preferences.budget_alerts,
          transaction_alerts: preferences.transaction_alerts,
          weekly_summary: preferences.weekly_summary,
          budget_alert_threshold: preferences.budget_alert_threshold,
          large_transaction_threshold: preferences.large_transaction_threshold,
          alert_frequency: preferences.alert_frequency,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  function updatePreference<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Failed to load preferences</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Notification Preferences</h1>
          <p className="text-gray-400">Manage how and when you receive updates from OneLibro</p>
        </div>

        {/* Global Email Toggle */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6 border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#10b981]/10 rounded-lg">
                <Mail className="w-6 h-6 text-[#10b981]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Email Notifications</h2>
                <p className="text-sm text-gray-400">
                  Enable or disable all email notifications
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.email_enabled}
                onChange={(e) => updatePreference('email_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#10b981]"></div>
            </label>
          </div>
        </div>

        {/* Notification Categories */}
        <div className="space-y-6">
          {/* Marketing Emails */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Marketing & Updates</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing_emails}
                  onChange={(e) => updatePreference('marketing_emails', e.target.checked)}
                  disabled={!preferences.email_enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] disabled:opacity-50"></div>
              </label>
            </div>
            <p className="text-sm text-gray-400">
              Product updates, new features, and occasional tips to get the most out of OneLibro
            </p>
          </div>

          {/* Budget Alerts */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Budget Alerts</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.budget_alerts}
                  onChange={(e) => updatePreference('budget_alerts', e.target.checked)}
                  disabled={!preferences.email_enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] disabled:opacity-50"></div>
              </label>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Get notified when you&apos;re approaching your spending limits
            </p>

            {preferences.budget_alerts && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Alert Threshold: {preferences.budget_alert_threshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={preferences.budget_alert_threshold}
                    onChange={(e) =>
                      updatePreference('budget_alert_threshold', parseInt(e.target.value))
                    }
                    disabled={!preferences.email_enabled}
                    className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You&apos;ll be notified when you reach this percentage of your budget
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Alerts */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Large Transaction Alerts</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.transaction_alerts}
                  onChange={(e) => updatePreference('transaction_alerts', e.target.checked)}
                  disabled={!preferences.email_enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] disabled:opacity-50"></div>
              </label>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Get notified about large transactions for fraud detection
            </p>

            {preferences.transaction_alerts && (
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Alert for transactions over: $
                  {(preferences.large_transaction_threshold / 100).toFixed(0)}
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={preferences.large_transaction_threshold / 100}
                  onChange={(e) =>
                    updatePreference(
                      'large_transaction_threshold',
                      parseInt(e.target.value) * 100
                    )
                  }
                  disabled={!preferences.email_enabled}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: $100, Maximum: $10,000
                </p>
              </div>
            )}
          </div>

          {/* Weekly Summary */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-white">Weekly Summary</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.weekly_summary}
                  onChange={(e) => updatePreference('weekly_summary', e.target.checked)}
                  disabled={!preferences.email_enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] disabled:opacity-50"></div>
              </label>
            </div>
            <p className="text-sm text-gray-400">
              Receive a weekly recap of your spending, budgets, and financial insights
            </p>
          </div>

          {/* Account Security (Always On) */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Account Security</h3>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                <span className="text-sm text-[#10b981] font-medium">Always On</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Important security alerts, password resets, and login notifications (cannot be
              disabled)
            </p>
          </div>

          {/* Alert Frequency */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold text-white mb-4">Alert Frequency</h3>
            <p className="text-sm text-gray-400 mb-4">
              Choose how often you want to receive notification emails
            </p>

            <select
              value={preferences.alert_frequency}
              onChange={(e) =>
                updatePreference(
                  'alert_frequency',
                  e.target.value as 'immediate' | 'daily_digest' | 'weekly_digest'
                )
              }
              disabled={!preferences.email_enabled}
              className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#10b981] disabled:opacity-50"
            >
              <option value="immediate">Immediate (as they happen)</option>
              <option value="daily_digest">Daily Digest (once per day)</option>
              <option value="weekly_digest">Weekly Digest (once per week)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
