/**
 * API Route: Create Plaid Link Token
 * POST /api/plaid/create-link-token
 * 
 * Creates a Plaid Link token for initializing the Plaid Link modal
 * Requires authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLinkToken } from '@/lib/plaid';
import { getServerUser } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log('[create-link-token] Auth header:', authHeader ? 'Present' : 'Missing');
    console.log('[create-link-token] Token:', token ? `${token.substring(0, 20)}...` : 'None');

    // Get current user (server-side)
    const user = await getServerUser(token);

    console.log('[create-link-token] User:', user ? user.id : 'null');

    if (!user) {
      console.log('[create-link-token] No user found, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get user ID from request body (should match authenticated user)
    const body = await request.json();
    const { userId } = body;

    // Verify userId matches authenticated user
    if (userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID mismatch' },
        { status: 403 }
      );
    }

    // Create Plaid Link token
    const { linkToken, error } = await createLinkToken(user.id);

    if (error || !linkToken) {
      console.error('Error creating link token:', error);
      return NextResponse.json(
        { error: error || 'Failed to create link token' },
        { status: 500 }
      );
    }

    // Return link token
    return NextResponse.json({
      link_token: linkToken,
      expiration: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    });
  } catch (error) {
    console.error('Error in create-link-token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}