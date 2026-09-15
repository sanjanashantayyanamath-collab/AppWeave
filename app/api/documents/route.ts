import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_FOLDERS, INITIAL_DOCUMENTS } from '@/lib/store/initial-data';
import { eventBus } from '@/lib/events';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('project_id');
  const orgId = searchParams.get('org_id');

  let folders = INITIAL_FOLDERS;
  if (orgId) {
    folders = folders.filter((f) => f.org_id === orgId);
  }
  if (projectId) {
    folders = folders.filter((f) => f.project_id === projectId);
  }

  return NextResponse.json({
    folders,
    documents: INITIAL_DOCUMENTS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { folderId, name, orgId, fileType } = body;

    const newDoc = {
      id: 'doc-' + Date.now(),
      folder_id: folderId,
      name,
      file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      version: 1,
      uploaded_by: 'user-elena',
      file_type: fileType || 'CAD Drawing',
      size: 4200000,
      created_at: new Date().toISOString(),
    };

    if (orgId) {
      await eventBus.publish({
        org_id: orgId,
        type: 'DOCUMENT_UPLOADED',
        payload: {
          document_id: newDoc.id,
          name: newDoc.name,
          folder_id: folderId,
        },
      });
    }

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
