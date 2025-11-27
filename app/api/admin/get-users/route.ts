import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Coming in Phase 3' },
    { status: 501 }
  );
}