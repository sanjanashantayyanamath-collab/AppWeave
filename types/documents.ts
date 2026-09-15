export interface Folder {
  id: string;
  org_id: string;
  name: string;
  project_id?: string | null;
  parent_id?: string | null;
  created_at: string;
  item_count?: number;
}

export interface DocumentItem {
  id: string;
  folder_id: string;
  name: string;
  file_url: string;
  version: number;
  uploaded_by: string;
  uploader_name?: string;
  size?: number; // in bytes
  file_type?: string;
  created_at: string;
}
