// lib/env.ts
/**
 * Type-safe environment variables
 * Validates that all required variables are present at build time
 */

/**
 * Get an environment variable and throw if missing
 */
function getEnvVar(key: string, isOptional = false): string {
    const value = process.env[key];
    
    if (!value && !isOptional) {
      throw new Error(
        `Missing required environment variable: ${key}\n` +
        `Please add ${key} to your .env.local file`
      );
    }
    
    return value || '';
  }
  
  /**
   * Validate Plaid environment
   */
  function getPlaidEnv(): 'sandbox' | 'development' | 'production' {
    const plaidEnv = getEnvVar('PLAID_ENV');
    
    if (!['sandbox', 'development', 'production'].includes(plaidEnv)) {
      throw new Error(
        `Invalid PLAID_ENV: ${plaidEnv}\n` +
        `Must be one of: sandbox, development, production`
      );
    }
    
    return plaidEnv as 'sandbox' | 'development' | 'production';
  }
  
  /**
   * Type-safe environment configuration
   * Access like: env.supabase.url
   */
  export const env = {
    // Supabase (public - safe for browser)
    supabase: {
      url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
      anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    },
    
    // Supabase (private - server only)
    supabaseServiceKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    
    // Plaid
    plaid: {
      clientId: getEnvVar('PLAID_CLIENT_ID'),
      secret: getEnvVar('PLAID_SECRET'),
      env: getPlaidEnv(),
      webhookUrl: getEnvVar('PLAID_WEBHOOK_URL', true), // Optional
    },
    
    // Encryption
    encryption: {
      key: getEnvVar('ENCRYPTION_KEY'),
    },
    
    // App
    app: {
      url: getEnvVar('NEXT_PUBLIC_APP_URL', true) || 'http://localhost:3000',
      nodeEnv: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
    },
  } as const;
  
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