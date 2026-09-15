export type AppSlug = 'projects' | 'documents' | 'hr';

export type UserRole = 'Admin' | 'Manager' | 'Member';

export type SubscriptionPlan = 'basic' | 'enterprise';

export interface Organization {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  created_at: string;
}

export interface UserProfile {
  id: string;
  org_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Entitlement {
  org_id: string;
  app_slug: AppSlug;
}

export type ContactType = 'client' | 'vendor' | 'employee';

export interface Contact {
  id: string;
  org_id: string;
  name: string;
  email: string;
  type: ContactType;
  phone?: string;
  company?: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  type?: 'info' | 'success' | 'warning' | 'event';
  link?: string;
}

export interface AuditLog {
  id: string;
  org_id: string;
  user_id: string;
  action: string;
  entity: string;
  details?: string;
  created_at: string;
}

export interface PlatformEvent<T = any> {
  id: string;
  org_id: string;
  type: 'PROJECT_CREATED' | 'DOCUMENT_UPLOADED' | 'TEAM_ASSIGNED' | 'ENTITLEMENT_UPDATED' | 'MILESTONE_COMPLETED';
  payload: T;
  created_at: string;
}
