/**
 * API Route: Plaid Webhook Handler
 * POST /api/plaid/webhook
 *
 * Receives webhook events from Plaid and processes them:
 * - SYNC_UPDATES_AVAILABLE: New transactions ready
 * - ITEM_LOGIN_REQUIRED: Bank needs re-authentication
 * - PENDING_EXPIRATION: Access token expiring soon
 */

import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';
import { plaidClient, syncTransactions } from '@/lib/plaid';
import { decryptAccessToken, dollarsToCents } from '@/lib/supabase';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { env } from '@/lib/env';
import { sendEmail } from '@/lib/email';

// Plaid webhook types
type WebhookType =
  | 'TRANSACTIONS'
  | 'ITEM'
  | 'HOLDINGS'
  | 'INVESTMENTS_TRANSACTIONS'
  | 'LIABILITIES'
  | 'ASSETS';

type TransactionsWebhookCode =
  | 'SYNC_UPDATES_AVAILABLE'
  | 'INITIAL_UPDATE'
  | 'HISTORICAL_UPDATE'
  | 'DEFAULT_UPDATE'
  | 'TRANSACTIONS_REMOVED';

type ItemWebhookCode =
  | 'ERROR'
  | 'LOGIN_REPAIRED'
  | 'PENDING_EXPIRATION'
  | 'USER_PERMISSION_REVOKED'
  | 'WEBHOOK_UPDATE_ACKNOWLEDGED';

interface PlaidWebhookPayload {
  webhook_type: WebhookType;
  webhook_code: TransactionsWebhookCode | ItemWebhookCode;
  item_id: string;
  error?: {
    error_type: string;
    error_code: string;
    error_message: string;
  };
  new_transactions?: number;
  consent_expiration_time?: string;
}

/**
 * Verify Plaid webhook signature using JWT
 * Plaid signs webhooks with their private key; we verify with their public key
 * See: https://plaid.com/docs/api/webhooks/webhook-verification/
 */
async function verifyWebhookSignature(request: Request): Promise<boolean> {
  const verificationKey = env.plaid.webhookVerificationKey;

  // Skip verification in sandbox/development if key not configured
  if (!verificationKey && env.plaid.env !== 'production') {
    console.warn('[Webhook] Skipping signature verification (no key configured for non-production)');
    return true;
  }

  // In production, verification key is REQUIRED
  if (!verificationKey && env.plaid.env === 'production') {
    console.error('[Webhook] CRITICAL: Webhook verification key missing in production!');
    return false;
  }

  try {
    const signedJwt = request.headers.get('plaid-verification');

    if (!signedJwt) {
      console.error('[Webhook] Missing Plaid-Verification header');
      return false;
    }

    // Verify the JWT using Plaid's JWKS endpoint
    const JWKS = createRemoteJWKSet(new URL('https://production.plaid.com/.well-known/jwks.json'));

    const { payload } = await jwtVerify(signedJwt, JWKS, {
      algorithms: ['ES256'],
    });

    // Verify the webhook body matches the JWT payload
    const body = await request.text();
    const bodyHash = Buffer.from(body).toString('base64');

    if (payload.request_body_sha256 !== bodyHash) {
      console.error('[Webhook] Body hash mismatch');
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Webhook] Signature verification failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // SECURITY: Verify webhook signature first
    // Clone request for signature verification (body can only be read once)
    const requestClone = request.clone();
    const isValid = await verifyWebhookSignature(requestClone);

    if (!isValid) {
      console.error('[Webhook] Signature verification failed - rejecting webhook');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload: PlaidWebhookPayload = await request.json();

    console.log('[Webhook] Received:', {
      type: payload.webhook_type,
      code: payload.webhook_code,
      item_id: payload.item_id,
    });

    const supabase = createServiceRoleClient();

    // Find the plaid_item in our database
    const { data: plaidItem, error: itemError } = await supabase
      .from('plaid_items')
      .select('*, users(id, email)')
      .eq('plaid_item_id', payload.item_id)
      .single();

    if (itemError || !plaidItem) {
      console.error('[Webhook] Item not found:', payload.item_id);
      // Return 200 to acknowledge receipt (Plaid will retry on non-200)
      return NextResponse.json({ received: true, processed: false });
    }

    // Route to appropriate handler based on webhook type
    switch (payload.webhook_type) {
      case 'TRANSACTIONS':
        await handleTransactionsWebhook(payload, plaidItem, supabase);
        break;

      case 'ITEM':
        await handleItemWebhook(payload, plaidItem, supabase);
        break;

      default:
        console.log('[Webhook] Unhandled webhook type:', payload.webhook_type);
    }

    const duration = Date.now() - startTime;
    console.log(`[Webhook] Processed in ${duration}ms`);

    // Always return 200 to acknowledge receipt
    return NextResponse.json({
      received: true,
      processed: true,
      duration_ms: duration,
    });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    // Return 200 anyway to prevent Plaid from retrying
    // Log the error for investigation
    return NextResponse.json({
      received: true,
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Handle TRANSACTIONS webhook events
 */
async function handleTransactionsWebhook(
  payload: PlaidWebhookPayload,
  plaidItem: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  supabase: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const code = payload.webhook_code as TransactionsWebhookCode;

  switch (code) {
    case 'SYNC_UPDATES_AVAILABLE':
    case 'INITIAL_UPDATE':
    case 'HISTORICAL_UPDATE':
    case 'DEFAULT_UPDATE':
      console.log(`[Webhook] ${code}: Syncing transactions for item ${payload.item_id}`);
      await syncTransactionsForItem(plaidItem, supabase);
      break;

    case 'TRANSACTIONS_REMOVED':
      console.log('[Webhook] TRANSACTIONS_REMOVED - transactions may have been removed');
      // The sync will handle removals automatically
      await syncTransactionsForItem(plaidItem, supabase);
      break;

    default:
      console.log('[Webhook] Unhandled transactions code:', code);
  }
}

/**
 * Handle ITEM webhook events
 */
async function handleItemWebhook(
  payload: PlaidWebhookPayload,
  plaidItem: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  supabase: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  const code = payload.webhook_code as ItemWebhookCode;

  switch (code) {
    case 'ERROR':
      console.log('[Webhook] ITEM ERROR:', payload.error);
      // Update item status in database
      await supabase
        .from('plaid_items')
        .update({
          status: 'error',
          error_message: payload.error?.error_message || 'Unknown error',
        })
        .eq('id', plaidItem.id);

      // Send email notification to user
      sendEmail({
        to: plaidItem.users.email,
        subject: `Action needed: Issue with your ${plaidItem.institution_name} account`,
        templateKey: 'plaid_item_error',
        templateProps: {
          institution_name: plaidItem.institution_name,
          error_message: payload.error?.error_message || 'We encountered an error connecting to your bank account.',
          reconnect_link: `${env.app.url}/finance/settings`,
        },
        userId: plaidItem.user_id,
        category: 'notification',
      }).catch((error) => {
        // Log error but don't fail webhook processing
        console.error('[Webhook] Failed to send ERROR email:', error);
      });
      break;

    case 'LOGIN_REPAIRED':
      console.log('[Webhook] LOGIN_REPAIRED: User re-authenticated');
      // Clear error status
      await supabase
        .from('plaid_items')
        .update({
          status: 'active',
          error_message: null,
        })
        .eq('id', plaidItem.id);
      // Sync transactions now that login is fixed
      await syncTransactionsForItem(plaidItem, supabase);
      break;

    case 'PENDING_EXPIRATION':
      console.log('[Webhook] PENDING_EXPIRATION:', payload.consent_expiration_time);
      // Mark item as needing attention
      await supabase
        .from('plaid_items')
        .update({
          status: 'pending_expiration',
          error_message: `Consent expires: ${payload.consent_expiration_time}`,
        })
        .eq('id', plaidItem.id);

      // Send email notification to user
      sendEmail({
        to: plaidItem.users.email,
        subject: `Action needed: Reconnect your ${plaidItem.institution_name} account`,
        templateKey: 'plaid_item_error',
        templateProps: {
          institution_name: plaidItem.institution_name,
          error_message: `Your consent to access this account is expiring soon. Please reconnect by ${payload.consent_expiration_time || 'as soon as possible'}.`,
          reconnect_link: `${env.app.url}/finance/settings`,
        },
        userId: plaidItem.user_id,
        category: 'notification',
      }).catch((error) => {
        // Log error but don't fail webhook processing
        console.error('[Webhook] Failed to send PENDING_EXPIRATION email:', error);
      });
      break;

    case 'USER_PERMISSION_REVOKED':
      console.log('[Webhook] USER_PERMISSION_REVOKED');
      await supabase
        .from('plaid_items')
        .update({
          status: 'revoked',
          error_message: 'User revoked permission',
        })
        .eq('id', plaidItem.id);
      break;

    case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
      console.log('[Webhook] Webhook URL updated');
      break;

    default:
      console.log('[Webhook] Unhandled item code:', code);
  }
}

/**
 * Sync transactions for a specific Plaid item
 * Reuses existing sync logic
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncTransactionsForItem(plaidItem: any, supabase: any) {
  try {
    // Decrypt the access token
    const accessToken = decryptAccessToken(plaidItem.access_token);

    // Get the cursor for incremental sync
    const cursor = plaidItem.sync_cursor || undefined;

    let hasMore = true;
    let currentCursor = cursor;
    let totalAdded = 0;
    let totalModified = 0;
    let totalRemoved = 0;

    // Sync in batches until no more data
    while (hasMore) {
      const syncResult = await syncTransactions(accessToken, currentCursor);

      if (syncResult.error) {
        console.error('[Webhook] Sync error:', syncResult.error);
        break;
      }

      // Get account mapping (plaid_account_id -> our account id)
      const { data: accounts } = await supabase
        .from('accounts')
        .select('id, plaid_account_id')
        .eq('plaid_item_id', plaidItem.id);

      const accountMap = new Map(
        accounts?.map((a: any) => [a.plaid_account_id, a.id]) || [] // eslint-disable-line @typescript-eslint/no-explicit-any
      );

      // Process added transactions
      if (syncResult.added.length > 0) {
        const transactionsToInsert = syncResult.added
          .filter(tx => accountMap.has(tx.account_id))
          .map(tx => ({
            user_id: plaidItem.user_id,
            account_id: accountMap.get(tx.account_id),
            plaid_transaction_id: tx.transaction_id,
            amount: dollarsToCents(tx.amount),
            transaction_date: tx.date,
            merchant_name: tx.merchant_name || tx.name,
            category: tx.category?.[0] || null,
            is_pending: tx.pending,
            is_hidden: false,
            is_manual: false,
          }));

        if (transactionsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('transactions')
            .upsert(transactionsToInsert, {
              onConflict: 'plaid_transaction_id',
            });

          if (insertError) {
            console.error('[Webhook] Insert error:', insertError);
          } else {
            totalAdded += transactionsToInsert.length;
          }
        }
      }

      // Process modified transactions
      if (syncResult.modified.length > 0) {
        for (const tx of syncResult.modified) {
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              amount: dollarsToCents(tx.amount),
              transaction_date: tx.date,
              merchant_name: tx.merchant_name || tx.name,
              category: tx.category?.[0] || null,
              is_pending: tx.pending,
            })
            .eq('plaid_transaction_id', tx.transaction_id);

          if (!updateError) {
            totalModified++;
          }
        }
      }

      // Process removed transactions
      if (syncResult.removed.length > 0) {
        const { error: deleteError } = await supabase
          .from('transactions')
          .update({ is_hidden: true })
          .in('plaid_transaction_id', syncResult.removed);

        if (!deleteError) {
          totalRemoved += syncResult.removed.length;
        }
      }

      currentCursor = syncResult.nextCursor;
      hasMore = syncResult.hasMore;
    }

    // Update the sync cursor and last_synced_at
    await supabase
      .from('plaid_items')
      .update({
        sync_cursor: currentCursor,
        last_synced_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', plaidItem.id);

    // Update account balances
    await updateAccountBalances(plaidItem, accessToken, supabase);

    console.log(`[Webhook] Sync complete: +${totalAdded}, ~${totalModified}, -${totalRemoved}`);
  } catch (error) {
    console.error('[Webhook] Error syncing transactions:', error);
  }
}

/**
 * Update account balances from Plaid
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateAccountBalances(plaidItem: any, accessToken: string, supabase: any) {
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    for (const account of response.data.accounts) {
      await supabase
        .from('accounts')
        .update({
          current_balance: dollarsToCents(account.balances.current || 0),
          available_balance: dollarsToCents(account.balances.available || 0),
        })
        .eq('plaid_account_id', account.account_id);
    }
  } catch (error) {
    console.error('[Webhook] Error updating balances:', error);
  }
}

// Also support GET for webhook URL verification
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Plaid webhook endpoint is active',
  });
}
