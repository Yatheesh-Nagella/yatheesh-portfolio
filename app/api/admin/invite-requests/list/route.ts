import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase
      .from('invite_code_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invite requests:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invite requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({ requests: data || [] });
  } catch (error) {
    console.error('Error in invite requests list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
