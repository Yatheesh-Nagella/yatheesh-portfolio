/**
 * Campaigns API
 * GET /api/admin/campaigns - List all campaigns
 * POST /api/admin/campaigns - Create new campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient } from '@/lib/admin-auth';

/**
 * GET /api/admin/campaigns
 * List all email campaigns with stats
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin session
    const { user, error: sessionError } = await verifyAdminSession(token);

    if (sessionError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getAdminServiceClient();

    // Get all campaigns with creator info
    const { data: campaigns, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        created_by_user:users!email_campaigns_created_by_fkey(
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return NextResponse.json(
        { error: 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error in GET /api/admin/campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/campaigns
 * Create a new email campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, subject, template_key, target_audience, scheduled_at } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify admin session
    const { user, error: sessionError } = await verifyAdminSession(token);

    if (sessionError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!name || !subject || !template_key) {
      return NextResponse.json(
        { error: 'Name, subject, and template are required' },
        { status: 400 }
      );
    }

    const supabase = getAdminServiceClient();

    // Verify template exists and is active
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_key', template_key)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found or inactive' },
        { status: 400 }
      );
    }

    // Count target recipients
    let targetCount = 0;
    const audience = target_audience || {};

    // Build query for counting recipients
    let query = supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    // Apply filters based on target_audience
    if (audience.active_only) {
      query = query.eq('is_active', true);
    }

    if (audience.signup_after) {
      query = query.gte('created_at', audience.signup_after);
    }

    if (audience.signup_before) {
      query = query.lte('created_at', audience.signup_before);
    }

    const { count } = await query;
    targetCount = count || 0;

    // Create campaign
    const { data: campaign, error: createError } = await supabase
      .from('email_campaigns')
      .insert({
        name,
        subject,
        template_key,
        target_audience: audience,
        status: scheduled_at ? 'scheduled' : 'draft',
        scheduled_at: scheduled_at || null,
        total_recipients: targetCount,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating campaign:', createError);
      return NextResponse.json(
        { error: 'Failed to create campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error('Error in POST /api/admin/campaigns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
