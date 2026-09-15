import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/store/initial-data';
import { eventBus } from '@/lib/events';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('org_id');

  const filtered = orgId
    ? INITIAL_PROJECTS.filter((p) => p.org_id === orgId)
    : INITIAL_PROJECTS;

  return NextResponse.json({ projects: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, clientId, orgId, budget, description, userId } = body;

    if (!name || !clientId || !orgId) {
      return NextResponse.json(
        { error: 'name, clientId, and orgId are required' },
        { status: 400 }
      );
    }

    const newProject = {
      id: 'proj-' + Date.now(),
      org_id: orgId,
      name,
      client_id: clientId,
      status: 'planning',
      created_by: userId || 'user-elena',
      created_at: new Date().toISOString(),
      description: description || '',
      budget: Number(budget) || 0,
      due_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    };

    // Broadcast Cross-App Event: PROJECT_CREATED
    await eventBus.publish({
      org_id: orgId,
      type: 'PROJECT_CREATED',
      payload: {
        project_id: newProject.id,
        name: newProject.name,
        org_id: orgId,
      },
    });

    return NextResponse.json({
      success: true,
      project: newProject,
      eventDispatched: 'PROJECT_CREATED',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
