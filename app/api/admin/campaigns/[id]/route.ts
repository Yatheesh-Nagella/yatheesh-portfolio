/**
 * Individual Campaign API
 * GET /api/admin/campaigns/[id] - Get campaign details
 * PUT /api/admin/campaigns/[id] - Update campaign
 * DELETE /api/admin/campaigns/[id] - Delete campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession, getAdminServiceClient } from '@/lib/admin-auth';

/**
 * GET /api/admin/campaigns/[id]
 * Get campaign details with stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get campaign with creator info
    const { data: campaign, error } = await supabase
      .from('email_campaigns')
      .select(`
        *,
        created_by_admin:admin_users!email_campaigns_created_by_admin_id_fkey(
          id,
          email,
          full_name
        ),
        email_template:email_templates(
          template_key,
          template_name,
          category
        )
      `)
      .eq('id', params.id)
      .single();

    if (error || !campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error in GET /api/admin/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/campaigns/[id]
 * Update campaign (only allowed for draft/scheduled campaigns)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { token, name, subject, target_audience, scheduled_at } = body;

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

    // Get existing campaign
    const { data: existing, error: fetchError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Only allow updates to draft or scheduled campaigns
    if (existing.status !== 'draft' && existing.status !== 'scheduled') {
      return NextResponse.json(
        { error: 'Cannot update campaign that is already sent or sending' },
        { status: 400 }
      );
    }

    // Recalculate target count if audience changed
    let targetCount = existing.total_recipients;
    if (target_audience) {
      let query = supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

      if (target_audience.active_only) {
        query = query.eq('is_active', true);
      }

      if (target_audience.signup_after) {
        query = query.gte('created_at', target_audience.signup_after);
      }

      if (target_audience.signup_before) {
        query = query.lte('created_at', target_audience.signup_before);
      }

      const { count } = await query;
      targetCount = count || 0;
    }

    // Update campaign
    const updates: any = {};
    if (name) updates.name = name;
    if (subject) updates.subject = subject;
    if (target_audience) {
      updates.target_audience = target_audience;
      updates.total_recipients = targetCount;
    }
    if (scheduled_at !== undefined) {
      updates.scheduled_at = scheduled_at;
      updates.status = scheduled_at ? 'scheduled' : 'draft';
    }

    const { data: campaign, error: updateError } = await supabase
      .from('email_campaigns')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating campaign:', updateError);
      return NextResponse.json(
        { error: 'Failed to update campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error('Error in PUT /api/admin/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/campaigns/[id]
 * Delete campaign (only allowed for draft campaigns)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get existing campaign
    const { data: existing, error: fetchError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of draft campaigns
    if (existing.status !== 'draft') {
      return NextResponse.json(
        { error: 'Cannot delete campaign that is not in draft status' },
        { status: 400 }
      );
    }

    // Delete campaign
    const { error: deleteError } = await supabase
      .from('email_campaigns')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting campaign:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete campaign' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/campaigns/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
