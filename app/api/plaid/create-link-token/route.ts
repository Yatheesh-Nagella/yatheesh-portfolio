/**
 * API Route: Create Plaid Link Token
 * POST /api/plaid/create-link-token
 * 
 * Creates a Plaid Link token for initializing the Plaid Link modal
 * Requires authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createLinkToken } from '@/lib/plaid';
import { getCurrentUser } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser();

    if (!user) {
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