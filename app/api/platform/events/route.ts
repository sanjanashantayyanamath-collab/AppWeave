import { NextRequest, NextResponse } from 'next/server';
import { eventBus } from '@/lib/events';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    bus: 'Supabase Realtime + Modular In-Memory Event Bus',
    supportedEvents: [
      'PROJECT_CREATED',
      'DOCUMENT_UPLOADED',
      'TEAM_ASSIGNED',
      'ENTITLEMENT_UPDATED',
      'MILESTONE_COMPLETED',
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { org_id, type, payload } = body;

    if (!org_id || !type) {
      return NextResponse.json(
        { error: 'org_id and type are required' },
        { status: 400 }
      );
    }

    const event = await eventBus.publish({
      org_id,
      type,
      payload: payload || {},
    });

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
