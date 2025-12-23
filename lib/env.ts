// lib/env.ts
/**
 * Type-safe environment variables
 * Validates that all required variables are present at build time
 */

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined';

/**
 * Get an environment variable and throw if missing
 * For client-side, only validates NEXT_PUBLIC_* variables
 */
function getEnvVar(key: string, isOptional = false): string {
    const value = process.env[key];

    // On client, skip validation for server-only variables
    if (!isServer && !key.startsWith('NEXT_PUBLIC_')) {
      return '';
    }

    if (!value && !isOptional) {
      // Debug: Log available env vars
      if (!isServer && key.startsWith('NEXT_PUBLIC_')) {
        console.error('🔴 Missing env var:', key);
        console.error('🔍 Available NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
      }
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please add ${key} to your .env.local file`
      );
    }

    return value || '';
  }
  
  /**
   * Validate Plaid environment
   * Returns 'sandbox' as default on client-side
   */
  function getPlaidEnv(): 'sandbox' | 'development' | 'production' {
    const plaidEnv = getEnvVar('PLAID_ENV');

    // On client, return default
    if (!plaidEnv) {
      return 'sandbox';
    }

    if (!['sandbox', 'development', 'production'].includes(plaidEnv)) {
      throw new Error(
        `Invalid PLAID_ENV: ${plaidEnv}\n` +
        `Must be one of: sandbox, development, production`
      );
    }

    return plaidEnv as 'sandbox' | 'development' | 'production';
  }
  
  /**
   * Type-safe environment configuration with lazy evaluation
   * Access like: env.supabase.url
   */
  export const env = {
    // Supabase (public - safe for browser)
    supabase: {
      get url() {
        return getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
      },
      get anonKey() {
        return getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
      },
    },

    // Supabase (private - server only)
    get supabaseServiceKey() {
      return getEnvVar('SUPABASE_SERVICE_ROLE_KEY');
    },

    // Plaid
    plaid: {
      get clientId() {
        return getEnvVar('PLAID_CLIENT_ID');
      },
      get secret() {
        return getEnvVar('PLAID_SECRET');
      },
      get env() {
        return getPlaidEnv();
      },
      get webhookUrl() {
        return getEnvVar('PLAID_WEBHOOK_URL', true);
      },
      get webhookVerificationKey() {
        return getEnvVar('PLAID_WEBHOOK_VERIFICATION_KEY', true);
      },
    },

    // Encryption
    encryption: {
      get key() {
        return getEnvVar('ENCRYPTION_KEY');
      },
    },

    // App
    app: {
      get url() {
        return getEnvVar('NEXT_PUBLIC_APP_URL', true) || 'http://localhost:3000';
      },
      get nodeEnv() {
        return (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
      },
    },
  };
  
  /**
   * Check if we're in production
   */
  export const isProduction = env.app.nodeEnv === 'production';
  
  /**
   * Check if we're in development
   */
  export const isDevelopment = env.app.nodeEnv === 'development';
  
  /**
   * Check if we're using Plaid sandbox
   */
  export const isPlaidSandbox = env.plaid.env === 'sandbox';
  
  /**
   * Validate encryption key format
   */
  export function validateEncryptionKey(): boolean {
    const key = env.encryption.key;
    
    // Should be 64 characters (32 bytes in hex)
    if (key.length !== 64) {
      throw new Error(
        `ENCRYPTION_KEY must be 64 characters (32 bytes in hex)\n` +
        `Current length: ${key.length}\n` +
        `Generate a valid key with: openssl rand -hex 32`
      );
    }
    
    // Should only contain hex characters
    if (!/^[0-9a-f]+$/i.test(key)) {
      throw new Error(
        `ENCRYPTION_KEY must only contain hex characters (0-9, a-f)\n` +
        `Generate a valid key with: openssl rand -hex 32`
      );
    }
    
    return true;
  }
  
  /**
   * Validate all environment variables on startup
   */
  export function validateEnv(): void {
    try {
      // Check Supabase
      if (!env.supabase.url.startsWith('https://')) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL must start with https://');
      }
      
      if (!env.supabase.anonKey.startsWith('eyJ')) {
        throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid');
      }
      
      if (!env.supabaseServiceKey.startsWith('eyJ')) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY appears to be invalid');
      }
      
      // Check Plaid
      if (env.plaid.clientId.length === 0) {
        throw new Error('PLAID_CLIENT_ID is required');
      }
      
      if (env.plaid.secret.length === 0) {
        throw new Error('PLAID_SECRET is required');
      }
      
      // Check encryption key
      validateEncryptionKey();
      
      console.log('✅ Environment variables validated successfully');
      console.log(`📍 Environment: ${env.app.nodeEnv}`);
      console.log(`🏦 Plaid: ${env.plaid.env}`);
      
    } catch (error) {
      console.error('❌ Environment validation failed:');
      console.error(error instanceof Error ? error.message : error);
      
      if (!isDevelopment) {
        // In production, fail fast
        process.exit(1);
      }
    }
  }
  
  /**
   * Type-safe environment variable access
   * Use this for one-off variables not in the env object
   */
  export function getEnv(key: string, fallback?: string): string {
    return process.env[key] || fallback || '';
  }
  
  /**
   * Check if a feature flag is enabled
   */
  export function isFeatureEnabled(featureName: string): boolean {
    const key = `FEATURE_${featureName.toUpperCase()}`;
    return process.env[key] === 'true' || process.env[key] === '1';
  }
  
  // Validate on import (in production)
  if (isProduction) {
    validateEnv();
  }