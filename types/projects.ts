import { Contact } from './platform';

export type ProjectStatus = 'planning' | 'active' | 'in_review' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  org_id: string;
  name: string;
  client_id: string;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  description?: string;
  budget?: number;
  due_date?: string;
  client?: Contact;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  designation?: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
}
