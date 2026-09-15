import { Organization, UserProfile, Entitlement, Contact, Notification, AuditLog, PlatformEvent } from '@/types/platform';
import { Project, Milestone } from '@/types/projects';
import { Folder, DocumentItem } from '@/types/documents';
import { Employee, Assignment } from '@/types/hr';

export const INITIAL_ORGS: Organization[] = [
  {
    id: 'org-studio-one',
    name: 'Studio One Architecture',
    plan: 'basic',
    created_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'org-design-house',
    name: 'DesignHouse Interiors & Build',
    plan: 'enterprise',
    created_at: '2025-02-01T10:00:00Z',
  },
];

export const INITIAL_ENTITLEMENTS: Record<string, ('projects' | 'documents' | 'hr')[]> = {
  'org-studio-one': ['projects'], // Org A: Projects only plan
  'org-design-house': ['projects', 'documents', 'hr'], // Org B: Full plan
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-alex',
    org_id: 'org-studio-one',
    name: 'Alex Mercer',
    email: 'admin@studioone.com',
    role: 'Admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'user-elena',
    org_id: 'org-design-house',
    name: 'Elena Rostova',
    email: 'admin@designhouse.com',
    role: 'Admin',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'user-marcus',
    org_id: 'org-design-house',
    name: 'Marcus Vance',
    email: 'marcus@designhouse.com',
    role: 'Manager',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'user-sophia',
    org_id: 'org-design-house',
    name: 'Sophia Chen',
    email: 'sophia@designhouse.com',
    role: 'Member',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
];

export const INITIAL_CONTACTS: Contact[] = [
  // Org A Client
  {
    id: 'contact-horizon',
    org_id: 'org-studio-one',
    name: 'Horizon Holdings LLC',
    email: 'contact@horizonholdings.com',
    type: 'client',
    phone: '+1 (555) 234-5678',
    company: 'Horizon Real Estate Holdings',
  },
  // Org B Clients
  {
    id: 'contact-apex',
    org_id: 'org-design-house',
    name: 'Apex Retail Group',
    email: 'projects@apexretail.com',
    type: 'client',
    phone: '+1 (555) 890-1234',
    company: 'Apex Retail Corp',
  },
  {
    id: 'contact-lumina',
    org_id: 'org-design-house',
    name: 'Lumina Developments',
    email: 'dev@luminarealestate.com',
    type: 'client',
    phone: '+1 (555) 678-4321',
    company: 'Lumina Luxury Residences',
  },
  // Org B Employees (stored in single shared contacts table!)
  {
    id: 'contact-elena',
    org_id: 'org-design-house',
    name: 'Elena Rostova',
    email: 'admin@designhouse.com',
    type: 'employee',
    phone: '+1 (555) 444-1111',
    company: 'DesignHouse',
  },
  {
    id: 'contact-marcus',
    org_id: 'org-design-house',
    name: 'Marcus Vance',
    email: 'marcus@designhouse.com',
    type: 'employee',
    phone: '+1 (555) 444-2222',
    company: 'DesignHouse',
  },
  {
    id: 'contact-sophia',
    org_id: 'org-design-house',
    name: 'Sophia Chen',
    email: 'sophia@designhouse.com',
    type: 'employee',
    phone: '+1 (555) 444-3333',
    company: 'DesignHouse',
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-elena',
    contact_id: 'contact-elena',
    org_id: 'org-design-house',
    designation: 'Principal Architect & Founder',
    department: 'Architecture & Concept',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    skills: ['Parametric Design', 'Zoning Law', 'Client Pitching', 'BIM Level 3'],
    joined_date: '2022-03-15',
  },
  {
    id: 'emp-marcus',
    contact_id: 'contact-marcus',
    org_id: 'org-design-house',
    designation: 'Senior Interior Designer',
    department: 'Interior & Materials',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skills: ['FF&E Spec', 'Acoustics', 'Travertine Sourcing', 'Lighting Schemes'],
    joined_date: '2023-01-10',
  },
  {
    id: 'emp-sophia',
    contact_id: 'contact-sophia',
    org_id: 'org-design-house',
    designation: 'Lead BIM & Structural Engineer',
    department: 'Engineering & 3D',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skills: ['Revit', 'Rhino Grasshopper', 'HVAC Routing', 'Clash Detection'],
    joined_date: '2023-08-01',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  // Org A
  {
    id: 'proj-loft',
    org_id: 'org-studio-one',
    name: 'Modern Loft Sanctuary',
    client_id: 'contact-horizon',
    status: 'active',
    created_by: 'user-alex',
    created_at: '2025-02-10T14:30:00Z',
    description: 'Industrial warehouse conversion into an ultra-modern dual-level residential sanctuary with exposed steel trusses.',
    budget: 185000,
    due_date: '2025-11-30',
  },
  // Org B
  {
    id: 'proj-villa',
    org_id: 'org-design-house',
    name: 'Villa Renovation',
    client_id: 'contact-apex',
    status: 'active',
    created_by: 'user-elena',
    created_at: '2025-03-01T09:15:00Z',
    description: 'Luxury coastal villa overhaul featuring monolithic travertine kitchen islands, infinity lap pool, and panoramic sliding glass.',
    budget: 420000,
    due_date: '2025-12-15',
  },
  {
    id: 'proj-office',
    org_id: 'org-design-house',
    name: 'Office Interior',
    client_id: 'contact-lumina',
    status: 'planning',
    created_by: 'user-elena',
    created_at: '2025-03-12T11:45:00Z',
    description: '14,000 sq.ft biophilic executive headquarters featuring integrated moss walls, circadian rhythmic lighting, and quiet pods.',
    budget: 310000,
    due_date: '2026-03-01',
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'mile-1',
    project_id: 'proj-villa',
    title: 'Schematic Design & Spatial Flow Signoff',
    due_date: '2025-08-15',
    status: 'completed',
  },
  {
    id: 'mile-2',
    project_id: 'proj-villa',
    title: 'Photorealistic 3D Renders & Material Board',
    due_date: '2025-09-30',
    status: 'in_progress',
  },
  {
    id: 'mile-3',
    project_id: 'proj-villa',
    title: 'MEP Permitting & Contractor Bidding',
    due_date: '2025-10-20',
    status: 'pending',
  },
  {
    id: 'mile-4',
    project_id: 'proj-office',
    title: 'Spatial Programming & Acoustic Analysis',
    due_date: '2025-10-10',
    status: 'completed',
  },
  {
    id: 'mile-5',
    project_id: 'proj-office',
    title: 'Lighting Schedule & Furniture Procurement',
    due_date: '2025-11-05',
    status: 'pending',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    employee_id: 'emp-elena',
    project_id: 'proj-villa',
    role: 'Principal Architect & Client Lead',
    start_date: '2025-03-01',
  },
  {
    id: 'assign-2',
    employee_id: 'emp-marcus',
    project_id: 'proj-villa',
    role: 'Interior Material Specifier',
    start_date: '2025-03-05',
  },
  {
    id: 'assign-3',
    employee_id: 'emp-sophia',
    project_id: 'proj-office',
    role: 'BIM Coordinator & Structural Lead',
    start_date: '2025-03-12',
  },
];

export const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'folder-villa',
    org_id: 'org-design-house',
    name: 'Villa Renovation',
    project_id: 'proj-villa',
    parent_id: null,
    created_at: '2025-03-01T09:15:00Z',
  },
  {
    id: 'folder-villa-blueprints',
    org_id: 'org-design-house',
    name: 'Architectural Blueprints & CAD',
    project_id: 'proj-villa',
    parent_id: 'folder-villa',
    created_at: '2025-03-01T09:20:00Z',
  },
  {
    id: 'folder-villa-specs',
    org_id: 'org-design-house',
    name: 'Material Specifications & Samples',
    project_id: 'proj-villa',
    parent_id: 'folder-villa',
    created_at: '2025-03-02T10:00:00Z',
  },
  {
    id: 'folder-office',
    org_id: 'org-design-house',
    name: 'Office Interior',
    project_id: 'proj-office',
    parent_id: null,
    created_at: '2025-03-12T11:45:00Z',
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    folder_id: 'folder-villa-blueprints',
    name: 'Villa_Floorplan_Revision_C.dwg',
    file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    version: 3,
    uploaded_by: 'user-elena',
    uploader_name: 'Elena Rostova',
    file_type: 'CAD Drawing (.dwg)',
    size: 14850000,
    created_at: '2025-03-14T16:00:00Z',
  },
  {
    id: 'doc-2',
    folder_id: 'folder-villa-blueprints',
    name: 'Structural_Load_Calculations.pdf',
    file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    version: 1,
    uploaded_by: 'user-sophia',
    uploader_name: 'Sophia Chen',
    file_type: 'PDF Document',
    size: 4200000,
    created_at: '2025-03-15T11:20:00Z',
  },
  {
    id: 'doc-3',
    folder_id: 'folder-villa-specs',
    name: 'Travertine_Finish_Schedule.xlsx',
    file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    version: 2,
    uploaded_by: 'user-marcus',
    uploader_name: 'Marcus Vance',
    file_type: 'Spreadsheet (.xlsx)',
    size: 1950000,
    created_at: '2025-03-16T14:45:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-elena',
    message: 'Welcome to AppWeave. Projects, Documents, and HR apps are active.',
    read: true,
    type: 'info',
    created_at: '2025-03-01T09:00:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-elena',
    message: 'Villa Renovation milestone "Photorealistic 3D Renders" due in 3 days.',
    read: false,
    type: 'warning',
    created_at: '2025-03-15T08:30:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    org_id: 'org-design-house',
    user_id: 'user-elena',
    action: 'PROJECT_CREATED',
    entity: 'Project: Villa Renovation',
    details: 'Project initialized with budget $420,000 for client Apex Retail Group',
    created_at: '2025-03-01T09:15:00Z',
  },
  {
    id: 'audit-2',
    org_id: 'org-design-house',
    user_id: 'user-elena',
    action: 'CROSS_APP_EVENT_DISPATCHED',
    entity: 'Event: PROJECT_CREATED',
    details: 'Documents auto-provisioned folder "/projects/Villa Renovation"',
    created_at: '2025-03-01T09:15:01Z',
  },
  {
    id: 'audit-3',
    org_id: 'org-design-house',
    user_id: 'user-marcus',
    action: 'TEAM_ASSIGNED',
    entity: 'Assignment: Marcus Vance -> Villa Renovation',
    details: 'Assigned as Interior Material Specifier',
    created_at: '2025-03-05T10:00:00Z',
  },
];
