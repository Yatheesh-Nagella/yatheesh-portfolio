/**
 * Admin Authentication Utilities
 * Separate authentication system for admin dashboard with TOTP 2FA
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import crypto from 'crypto';
import { env } from './env';

// Service role client for admin operations (bypasses RLS)
export function getAdminServiceClient() {
  return createClient(env.supabase.url, env.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Encryption for TOTP secrets and backup codes
const ENCRYPTION_KEY = env.encryption.key;
const ALGORITHM = 'aes-256-cbc';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Admin user type
export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  totp_enabled: boolean;
  totp_verified: boolean;
  last_login_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: string;
  token: string;
  expires_at: string;
}

// Generate secure random token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create admin user (only for initial setup)
 */
export async function createAdminUser(
  email: string,
  password: string,
  fullName: string | null = null
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    const supabase = getAdminServiceClient();

    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return { user: null, error: 'Admin user already exists' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Remove password_hash from response
    const { password_hash, totp_secret, backup_codes, ...adminUser } = data;

    return { user: adminUser as AdminUser, error: null };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { user: null, error: 'Failed to create admin user' };
  }
}

/**
 * Authenticate admin user (step 1: email/password)
 */
export async function authenticateAdmin(
  email: string,
  password: string,
  ipAddress?: string
): Promise<{
  requiresTOTP: boolean;
  userId?: string;
  error: string | null;
}> {
  try {
    const supabase = getAdminServiceClient();

    // Get admin user
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !adminUser) {
      return { requiresTOTP: false, error: 'Invalid email or password' };
    }

    // Check if account is locked
    if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
      return {
        requiresTOTP: false,
        error: 'Account is temporarily locked. Please try again later.',
      };
    }

    // Check if account is active
    if (!adminUser.is_active) {
      return { requiresTOTP: false, error: 'Account is disabled' };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);

    if (!passwordMatch) {
      // Increment failed login attempts
      const newFailedAttempts = (adminUser.failed_login_attempts || 0) + 1;
      const updates: any = { failed_login_attempts: newFailedAttempts };

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        updates.locked_until = lockUntil.toISOString();
      }

      await supabase.from('admin_users').update(updates).eq('id', adminUser.id);

      return { requiresTOTP: false, error: 'Invalid email or password' };
    }

    // Reset failed login attempts on successful password verification
    await supabase
      .from('admin_users')
      .update({ failed_login_attempts: 0, locked_until: null })
      .eq('id', adminUser.id);

    // Check if TOTP is enabled
    if (adminUser.totp_enabled && adminUser.totp_verified) {
      return { requiresTOTP: true, userId: adminUser.id, error: null };
    }

    // No TOTP required - create session
    return { requiresTOTP: false, userId: adminUser.id, error: null };
  } catch (error) {
    console.error('Error authenticating admin:', error);
    return { requiresTOTP: false, error: 'Authentication failed' };
  }
}

/**
 * Verify TOTP code (step 2: 2FA)
 */
export async function verifyAdminTOTP(
  userId: string,
  code: string
): Promise<{ valid: boolean; error: string | null }> {
  try {
    const supabase = getAdminServiceClient();

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('totp_secret, totp_enabled, totp_verified')
      .eq('id', userId)
      .single();

    if (error || !adminUser) {
      return { valid: false, error: 'User not found' };
    }

    if (!adminUser.totp_enabled || !adminUser.totp_verified || !adminUser.totp_secret) {
      return { valid: false, error: 'TOTP not enabled' };
    }

    // Decrypt TOTP secret
    const secret = decrypt(adminUser.totp_secret);

    // Verify code
    const isValid = authenticator.verify({ token: code, secret });

    return { valid: isValid, error: isValid ? null : 'Invalid code' };
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return { valid: false, error: 'Verification failed' };
  }
}

/**
 * Create admin session
 */
export async function createAdminSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ session: AdminSession | null; user: AdminUser | null; error: string | null }> {
  try {
    const supabase = getAdminServiceClient();

    // Generate session token
    const token = generateSecureToken();

    // Session expires in 8 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8);

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: userId,
        token,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Update last login
    await supabase
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: ipAddress,
      })
      .eq('id', userId);

    // Log login action
    await logAdminAction(userId, 'login', null, null, null, ipAddress, userAgent);

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, full_name, totp_enabled, totp_verified, last_login_at, is_active, created_at')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    return { session, user, error: null };
  } catch (error) {
    console.error('Error creating admin session:', error);
    return { session: null, user: null, error: 'Failed to create session' };
  }
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(
  token: string
): Promise<{ user: AdminUser | null; error: string | null }> {
  try {
    const supabase = getAdminServiceClient();

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('token', token)
      .single();

    if (sessionError || !session) {
      return { user: null, error: 'Invalid session' };
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('admin_sessions').delete().eq('id', session.id);
      return { user: null, error: 'Session expired' };
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('id, email, full_name, totp_enabled, totp_verified, last_login_at, is_active, created_at')
      .eq('id', session.admin_user_id)
      .single();

    if (userError || !user) {
      return { user: null, error: 'User not found' };
    }

    // Check if user is active
    if (!user.is_active) {
      return { user: null, error: 'Account is disabled' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error verifying admin session:', error);
    return { user: null, error: 'Session verification failed' };
  }
}

/**
 * Delete admin session (logout)
 */
export async function deleteAdminSession(token: string): Promise<void> {
  try {
    const supabase = getAdminServiceClient();

    // Get session to log the user ID
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('admin_user_id')
      .eq('token', token)
      .single();

    if (session) {
      await logAdminAction(session.admin_user_id, 'logout', null, null, null);
    }

    await supabase.from('admin_sessions').delete().eq('token', token);
  } catch (error) {
    console.error('Error deleting admin session:', error);
  }
}

/**
 * Setup TOTP for admin user
 */
export async function setupAdminTOTP(
  userId: string
): Promise<{ secret: string; qrCodeUrl: string; error: string | null }> {
  try {
    const supabase = getAdminServiceClient();

    // Generate TOTP secret
    const secret = authenticator.generateSecret();

    // Get user email for QR code
    const { data: user } = await supabase
      .from('admin_users')
      .select('email')
      .eq('id', userId)
      .single();

    if (!user) {
      return { secret: '', qrCodeUrl: '', error: 'User not found' };
    }

    // Generate otpauth URL
    const otpauthUrl = authenticator.keyuri(user.email, 'OneLedger Admin', secret);

    // Encrypt and save secret
    const encryptedSecret = encrypt(secret);

    await supabase
      .from('admin_users')
      .update({
        totp_secret: encryptedSecret,
        totp_enabled: true,
        totp_verified: false, // Will be verified after first successful code
      })
      .eq('id', userId);

    return { secret, qrCodeUrl: otpauthUrl, error: null };
  } catch (error) {
    console.error('Error setting up TOTP:', error);
    return { secret: '', qrCodeUrl: '', error: 'TOTP setup failed' };
  }
}

/**
 * Verify TOTP setup (during initial setup - doesn't require totp_verified to be true)
 */
export async function verifyTOTPSetup(
  userId: string,
  code: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    /* Debugging logs */
    /*
    console.log('=== TOTP Setup Verification Debug ===');
    console.log('User ID:', userId);
    console.log('Code:', code);
    console.log('Code length:', code?.length);
    */

    const supabase = getAdminServiceClient();

    // Get user's TOTP secret (should exist but not yet verified)
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('totp_secret, totp_enabled, totp_verified')
      .eq('id', userId)
      .single();

    /*
    console.log('DB Query error:', error);
    console.log('Admin user found:', !!adminUser);
    console.log('TOTP enabled:', adminUser?.totp_enabled);
    console.log('TOTP verified:', adminUser?.totp_verified);
    console.log('TOTP secret exists:', !!adminUser?.totp_secret);
    */

    if (error || !adminUser) {
      console.error('User not found error');
      return { success: false, error: 'User not found' };
    }

    if (!adminUser.totp_enabled || !adminUser.totp_secret) {
      console.error('TOTP not enabled or secret missing');
      return { success: false, error: 'TOTP setup not initiated' };
    }

    // Decrypt TOTP secret
    const secret = decrypt(adminUser.totp_secret);

    // Verify code (allow for time drift)
    const isValid = authenticator.verify({
      token: code,
      secret,
      window: 2, // Allow 2 time steps (±60 seconds) for clock skew
    } as any);

    if (!isValid) {
      console.error('TOTP code invalid');
      return { success: false, error: 'Invalid code. Please try again.' };
    }

    // Mark TOTP as verified
    console.log('Marking TOTP as verified...');
    await supabase
      .from('admin_users')
      .update({ totp_verified: true })
      .eq('id', userId);

    await logAdminAction(userId, 'totp_enabled', null, null, null);

    console.log('TOTP setup verification successful!');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error verifying TOTP setup:', error);
    return { success: false, error: 'Verification failed' };
  }
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(
  adminUserId: string,
  action: string,
  resourceType: string | null = null,
  resourceId: string | null = null,
  details: any = null,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const supabase = getAdminServiceClient();

    await supabase.from('admin_audit_logs').insert({
      admin_user_id: adminUserId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}
