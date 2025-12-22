/**
 * Budget Alerts Cron Job
 * GET /api/cron/budget-alerts
 *
 * Runs hourly to check all active budgets and send email alerts
 * when users approach or exceed their spending limits
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { sendEmail } from '@/lib/email';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/budget-alerts
 * Called by Vercel Cron every hour
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${env.cron.secret}`) {
      console.error('[Budget Alerts] Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createServiceRoleClient();

    // Get all active budgets with user information
    const { data: budgets, error: budgetsError } = await supabase
      .from('budgets')
      .select(`
        *,
        user:users!budgets_user_id_fkey(
          id,
          email,
          full_name
        )
      `)
      .eq('is_active', true);

    if (budgetsError) {
      console.error('[Budget Alerts] Error fetching budgets:', budgetsError);
      return NextResponse.json(
        { error: 'Failed to fetch budgets' },
        { status: 500 }
      );
    }

    if (!budgets || budgets.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active budgets to check',
        duration_ms: Date.now() - startTime,
      });
    }

    let alertsSent = 0;
    let alertsSkipped = 0;
    const errors: string[] = [];

    // Process each budget
    for (const budget of budgets) {
      try {
        // Skip if budget doesn't have required fields
        if (!budget.period || !budget.user || !budget.category) {
          alertsSkipped++;
          continue;
        }

        // Calculate date range for budget period
        const { startDate, endDate} = getBudgetPeriodDates(budget.period as 'weekly' | 'monthly' | 'yearly');

        // Get total spending for this budget's category in the current period
        const { data: transactions, error: txError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', budget.user_id || '')
          .eq('category', budget.category || '')
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate);

        if (txError) {
          console.error(`[Budget Alerts] Error fetching transactions for budget ${budget.id}:`, txError);
          errors.push(`Budget ${budget.id}: ${txError.message}`);
          continue;
        }

        // Calculate total spent (amount is in cents)
        const totalSpentCents = transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

        // Update budget spent_amount
        await supabase
          .from('budgets')
          .update({ spent_amount: totalSpentCents })
          .eq('id', budget.id);

        // Calculate percentage used
        const budgetAmountCents = budget.amount || 0;
        const percentageUsed = budgetAmountCents > 0
          ? (totalSpentCents / budgetAmountCents) * 100
          : 0;

        // Get user's notification preferences
        const { data: prefs } = await supabase
          .from('notification_preferences')
          .select('budget_alerts, budget_alert_threshold, email_enabled')
          .eq('user_id', budget.user_id || '')
          .single();

        // Skip if user has budget alerts disabled
        if (!prefs?.budget_alerts || !prefs?.email_enabled) {
          alertsSkipped++;
          continue;
        }

        // Determine if alert should be sent
        const threshold = prefs.budget_alert_threshold || 80;
        const shouldAlert = percentageUsed >= threshold;

        if (!shouldAlert) {
          continue;
        }

        // Check if we already sent an alert for this threshold today
        const today = new Date().toISOString().split('T')[0];
        const { data: existingAlerts } = await supabase
          .from('budget_alert_history')
          .select('id')
          .eq('budget_id', budget.id)
          .eq('threshold_percentage', threshold)
          .gte('alerted_at', `${today}T00:00:00Z`)
          .limit(1);

        if (existingAlerts && existingAlerts.length > 0) {
          // Already sent alert today for this threshold
          alertsSkipped++;
          continue;
        }

        // Send budget alert email
        const daysRemaining = getDaysRemainingInPeriod(budget.period as 'weekly' | 'monthly' | 'yearly');

        const emailResult = await sendEmail({
          to: budget.user.email,
          subject: `Budget Alert: ${budget.name}`,
          templateKey: 'budget_alert_email',
          templateProps: {
            user_name: budget.user.full_name || budget.user.email || 'there',
            budget_name: budget.name || 'Your Budget',
            budget_category: budget.category,
            budget_amount: budgetAmountCents / 100, // Convert cents to dollars
            spent_amount: totalSpentCents / 100, // Convert cents to dollars
            threshold_percentage: threshold,
            period: budget.period,
            days_remaining: daysRemaining,
          },
          userId: budget.user_id || undefined,
          category: 'notification',
        });

        if (emailResult.success) {
          // Log the alert to prevent duplicates
          await supabase
            .from('budget_alert_history')
            .insert({
              user_id: budget.user_id,
              budget_id: budget.id,
              threshold_percentage: threshold,
              spent_amount: totalSpentCents,
              budget_amount: budgetAmountCents,
              period: budget.period as string,
            } as any);

          alertsSent++;
        } else {
          errors.push(`Budget ${budget.id}: ${emailResult.error}`);
        }

      } catch (error) {
        console.error(`[Budget Alerts] Error processing budget ${budget.id}:`, error);
        errors.push(`Budget ${budget.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    const duration = Date.now() - startTime;

    console.log(`[Budget Alerts] Completed: ${alertsSent} sent, ${alertsSkipped} skipped, ${errors.length} errors, ${duration}ms`);

    return NextResponse.json({
      success: true,
      budgets_checked: budgets.length,
      alerts_sent: alertsSent,
      alerts_skipped: alertsSkipped,
      errors_count: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      duration_ms: duration,
    });

  } catch (error) {
    console.error('[Budget Alerts] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Get start and end dates for budget period
 */
function getBudgetPeriodDates(period: 'weekly' | 'monthly' | 'yearly'): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate: Date;

  switch (period) {
    case 'weekly':
      // Start of current week (Sunday)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      break;

    case 'monthly':
      // Start of current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case 'yearly':
      // Start of current year
      startDate = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      // Default to monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate,
  };
}

/**
 * Get number of days remaining in current budget period
 */
function getDaysRemainingInPeriod(period: 'weekly' | 'monthly' | 'yearly'): number {
  const now = new Date();
  let endDate: Date;

  switch (period) {
    case 'weekly':
      // End of week (Saturday)
      endDate = new Date(now);
      endDate.setDate(now.getDate() + (6 - now.getDay()));
      break;

    case 'monthly':
      // End of month
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;

    case 'yearly':
      // End of year
      endDate = new Date(now.getFullYear(), 11, 31);
      break;

    default:
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / msPerDay);
  return Math.max(0, daysRemaining);
}
