import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_EMPLOYEES, INITIAL_ASSIGNMENTS } from '@/lib/store/initial-data';
import { eventBus } from '@/lib/events';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('org_id');

  const filtered = orgId
    ? INITIAL_EMPLOYEES.filter((e) => e.org_id === orgId)
    : INITIAL_EMPLOYEES;

  return NextResponse.json({
    employees: filtered,
    assignments: INITIAL_ASSIGNMENTS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, projectId, role, orgId } = body;

    const newAssignment = {
      id: 'assign-' + Date.now(),
      employee_id: employeeId,
      project_id: projectId,
      role,
      start_date: new Date().toISOString().split('T')[0],
    };

    if (orgId) {
      await eventBus.publish({
        org_id: orgId,
        type: 'TEAM_ASSIGNED',
        payload: {
          assignment_id: newAssignment.id,
          employee_id: employeeId,
          project_id: projectId,
          role,
        },
      });
    }

    return NextResponse.json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
