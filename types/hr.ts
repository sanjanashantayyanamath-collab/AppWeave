import { Contact } from './platform';
import { Project } from './projects';

export interface Employee {
  id: string;
  contact_id: string;
  org_id: string;
  designation: string;
  department: string;
  contact?: Contact;
  avatar_url?: string;
  active_assignments_count?: number;
  skills?: string[];
  joined_date?: string;
}

export interface Assignment {
  id: string;
  employee_id: string;
  project_id: string;
  role: string;
  start_date: string;
  employee?: Employee;
  project?: Project;
}
