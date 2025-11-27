// lib/plaid.ts
/**
 * Plaid client configuration and helper functions
 * Fully typed for type safety
 */

import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';
import crypto from 'crypto';
import { env } from './env';

// ============================================
// PLAID CLIENT SETUP
// ============================================

const configuration = new Configuration({
  basePath: PlaidEnvironments[env.plaid.env],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': env.plaid.clientId,
      'PLAID-SECRET': env.plaid.secret,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface PlaidLinkTokenResponse {
  link_token: string;
  expiration: string;
}

export interface PlaidAccessTokenResponse {
  access_token: string;
  item_id: string;
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  type: string;
  subtype: string | null;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
    currency: string;
  };
}

export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
  category: string[] | null;
  pending: boolean;
  payment_channel: string;
}

export interface PlaidInstitution {
  institution_id: string;
  name: string;
  products: string[];
}

// ============================================
// LINK TOKEN FUNCTIONS
// ============================================

/**
 * Create a Link token for a user
 * This token is used to initialize Plaid Link on the frontend
 *
 * @param userId - The unique identifier for the user
 * @param products - Array of Plaid products to enable. Defaults to [Transactions, Auth]
 *                   - Products.Transactions: Access transaction history
 *                   - Products.Auth: Access account/routing numbers for ACH
 *                   - Products.Investments: Access investment holdings
 *                   - Products.Liabilities: Access loan/credit card debt info
 * @returns Object containing linkToken (for Plaid Link UI) or error message
 * @see {@link https://plaid.com/docs/api/products/|Plaid Products Documentation}
 */
export async function createLinkToken(
  userId: string,
  products: Products[] = [Products.Transactions, Products.Auth]
): Promise<{ linkToken: string | null; error: string | null }> {
  try {
    // Build link token config
    const linkConfig: Parameters<typeof plaidClient.linkTokenCreate>[0] = {
      user: {
        client_user_id: userId,
      },
      client_name: 'OneLedger',
      products,
      country_codes: [CountryCode.Us],
      language: 'en',
    };

    // Add webhook URL if configured
    // In production: https://finance.yatheeshnagella.com/api/plaid/webhook
    // In development: Use ngrok or similar for testing
    if (env.plaid.webhookUrl) {
      linkConfig.webhook = env.plaid.webhookUrl;
      console.log('[Plaid] Webhook URL registered:', env.plaid.webhookUrl);
    }

    const response = await plaidClient.linkTokenCreate(linkConfig);

    return {
      linkToken: response.data.link_token,
      error: null,
    };
  } catch (error) {
    console.error('Error creating link token:', error);
    return {
      linkToken: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create Link token for updating an existing Item
 * Used when user needs to re-authenticate
 */
export async function createUpdateLinkToken(
  accessToken: string
): Promise<{ linkToken: string | null; error: string | null }> {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: 'update-mode',
      },
      client_name: 'OneLedger',
      country_codes: [CountryCode.Us],
      language: 'en',
      access_token: accessToken,
    });

    return {
      linkToken: response.data.link_token,
      error: null,
    };
  } catch (error) {
    console.error('Error creating update link token:', error);
    return {
      linkToken: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// TOKEN EXCHANGE
// ============================================

/**
 * Exchange public token for access token
 * Called after user completes Plaid Link flow
 */
export async function exchangePublicToken(
  publicToken: string
): Promise<{ accessToken: string | null; itemId: string | null; error: string | null }> {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
      error: null,
    };
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return {
      accessToken: null,
      itemId: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// ACCOUNTS
// ============================================

/**
 * Get all accounts for a Plaid item
 */
export async function getAccounts(
  accessToken: string
): Promise<{ accounts: PlaidAccount[] | null; error: string | null }> {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accounts: PlaidAccount[] = response.data.accounts.map(account => ({
      account_id: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      balances: {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code || 'USD',
      },
    }));

    return {
      accounts,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return {
      accounts: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get account balances
 */
export async function getBalances(
  accessToken: string
): Promise<{ accounts: PlaidAccount[] | null; error: string | null }> {
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    const accounts: PlaidAccount[] = response.data.accounts.map(account => ({
      account_id: account.account_id,
      name: account.name,
      type: account.type,
      subtype: account.subtype,
      balances: {
        available: account.balances.available,
        current: account.balances.current,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code || 'USD',
      },
    }));

    return {
      accounts,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching balances:', error);
    return {
      accounts: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// TRANSACTIONS
// ============================================

/**
 * Get transactions for a date range
 */
export async function getTransactions(
  accessToken: string,
  startDate: string, // Format: YYYY-MM-DD
  endDate: string     // Format: YYYY-MM-DD
): Promise<{ transactions: PlaidTransaction[] | null; error: string | null }> {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 500, // Max transactions per request
        offset: 0,
      },
    });

    const transactions: PlaidTransaction[] = response.data.transactions.map(tx => ({
      transaction_id: tx.transaction_id,
      account_id: tx.account_id,
      amount: tx.amount,
      date: tx.date,
      name: tx.name,
      merchant_name: tx.merchant_name || null,
      category: tx.category || null,
      pending: tx.pending,
      payment_channel: tx.payment_channel,
    }));

    return {
      transactions,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      transactions: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sync transactions (get new/updated transactions since last sync)
 */
export async function syncTransactions(
  accessToken: string,
  cursor?: string
): Promise<{
  added: PlaidTransaction[];
  modified: PlaidTransaction[];
  removed: string[];
  nextCursor: string;
  hasMore: boolean;
  error: string | null;
}> {
  try {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor: cursor,
    });

    const added: PlaidTransaction[] = response.data.added.map(tx => ({
      transaction_id: tx.transaction_id,
      account_id: tx.account_id,
      amount: tx.amount,
      date: tx.date,
      name: tx.name,
      merchant_name: tx.merchant_name || null,
      category: tx.category || null,
      pending: tx.pending,
      payment_channel: tx.payment_channel,
    }));

    const modified: PlaidTransaction[] = response.data.modified.map(tx => ({
      transaction_id: tx.transaction_id,
      account_id: tx.account_id,
      amount: tx.amount,
      date: tx.date,
      name: tx.name,
      merchant_name: tx.merchant_name || null,
      category: tx.category || null,
      pending: tx.pending,
      payment_channel: tx.payment_channel,
    }));

    const removed = response.data.removed.map(tx => tx.transaction_id);

    return {
      added,
      modified,
      removed,
      nextCursor: response.data.next_cursor,
      hasMore: response.data.has_more,
      error: null,
    };
  } catch (error) {
    console.error('Error syncing transactions:', error);
    return {
      added: [],
      modified: [],
      removed: [],
      nextCursor: '',
      hasMore: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// ITEM MANAGEMENT
// ============================================

/**
 * Get item details (institution info, status)
 */
export async function getItem(
  accessToken: string
): Promise<{ item: PlaidInstitution | null; error: string | null }> {
  try {
    const response = await plaidClient.itemGet({
      access_token: accessToken,
    });

    const institutionId = response.data.item.institution_id;
    
    if (!institutionId) {
      return { item: null, error: 'No institution ID found' };
    }

    const instResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
    });

    const institution: PlaidInstitution = {
      institution_id: instResponse.data.institution.institution_id,
      name: instResponse.data.institution.name,
      products: instResponse.data.institution.products as string[],
    };

    return {
      item: institution,
      error: null,
    };
  } catch (error) {
    console.error('Error fetching item:', error);
    return {
      item: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Remove (delete) a Plaid item
 * This disconnects the bank account
 */
export async function removeItem(
  accessToken: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await plaidClient.itemRemove({
      access_token: accessToken,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error removing item:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// WEBHOOKS
// ============================================

/**
 * Verify Plaid webhook signature
 * Use this to validate webhook requests are from Plaid
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  webhookSecret: string
): boolean {
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(body);
  const computedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

// ============================================
// SANDBOX HELPERS (Development only)
// ============================================

/**
 * Reset login for a Plaid item (Sandbox only)
 * Useful for testing re-authentication flow
 */
export async function sandboxResetLogin(
  accessToken: string
): Promise<{ success: boolean; error: string | null }> {
  if (env.plaid.env !== 'sandbox') {
    return {
      success: false,
      error: 'This function only works in sandbox mode',
    };
  }

  try {
    await plaidClient.sandboxItemResetLogin({
      access_token: accessToken,
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error resetting login:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fire a test webhook (Sandbox only)
 */
export async function sandboxFireWebhook(
  accessToken: string,
  webhookCode: string
): Promise<{ success: boolean; error: string | null }> {
  if (env.plaid.env !== 'sandbox') {
    return {
      success: false,
      error: 'This function only works in sandbox mode',
    };
  }

  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    await plaidClient.sandboxItemFireWebhook({
      access_token: accessToken,
      webhook_code: webhookCode as any,
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Error firing webhook:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}