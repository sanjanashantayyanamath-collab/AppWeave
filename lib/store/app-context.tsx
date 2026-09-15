'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Organization,
  UserProfile,
  AppSlug,
  Contact,
  Notification,
  AuditLog,
  PlatformEvent,
} from '@/types/platform';
import { Project, Milestone, ProjectMember } from '@/types/projects';
import { Folder, DocumentItem } from '@/types/documents';
import { Employee, Assignment } from '@/types/hr';
import {
  INITIAL_ORGS,
  INITIAL_USERS,
  INITIAL_ENTITLEMENTS,
  INITIAL_CONTACTS,
  INITIAL_EMPLOYEES,
  INITIAL_PROJECTS,
  INITIAL_MILESTONES,
  INITIAL_ASSIGNMENTS,
  INITIAL_FOLDERS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './initial-data';
import { AutomationRule, AutomationExecutionLog } from '@/types/automations';
import { INITIAL_AUTOMATION_RULES, INITIAL_EXECUTION_LOGS } from './initial-automations';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface CrossAppToast {
  id: string;
  title: string;
  description: string;
  app: AppSlug | 'platform';
  timestamp: string;
  actionLabel?: string;
  actionHref?: string;
}

interface AppContextType {
  // Session & Identity
  user: UserProfile;
  organization: Organization;
  organizations: Organization[];
  users: UserProfile[];
  entitlements: AppSlug[];
  switchUser: (email: string) => void;
  switchOrg: (orgId: string) => void;
  
  // Entitlements Engine
  toggleEntitlement: (app: AppSlug) => void;
  hasEntitlement: (app: AppSlug) => boolean;

  // Platform Shared Data
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'org_id'>) => Contact;
  notifications: Notification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  auditLogs: AuditLog[];
  events: PlatformEvent[];

  // App 1: Projects
  projects: Project[];
  milestones: Milestone[];
  createProject: (data: { name: string; clientId: string; description?: string; budget?: number; dueDate?: string }) => Promise<Project>;
  updateMilestoneStatus: (milestoneId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  addMilestone: (projectId: string, title: string, dueDate: string) => void;

  // App 2: Documents
  folders: Folder[];
  documents: DocumentItem[];
  createFolder: (name: string, projectId?: string, parentId?: string) => Promise<Folder>;
  uploadDocument: (data: { folderId: string; name: string; fileType?: string; size?: number }) => Promise<DocumentItem>;

  // App 3: HR
  employees: Employee[];
  assignments: Assignment[];
  assignEmployeeToProject: (employeeId: string, projectId: string, role: string) => Promise<Assignment>;
  addEmployee: (data: { name: string; email: string; designation: string; department: string; skills?: string[] }) => Promise<Employee>;

  // Cross-App Automations (AppWeave Flow)
  automationRules: AutomationRule[];
  executionLogs: AutomationExecutionLog[];
  toggleAutomationRule: (ruleId: string) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id' | 'executionCount' | 'lastExecutedAt'>) => AutomationRule;
  deleteAutomationRule: (ruleId: string) => void;
  simulateAutomation: (ruleId: string) => Promise<{ success: boolean; latencyMs: number; actionsTriggered: string[] }>;

  // Realtime Toast Bus
  activeToast: CrossAppToast | null;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialize with DesignHouse (full plan) for richest initial experience
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[1]); // Elena Rostova
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGS[1]); // DesignHouse
  const [orgEntitlements, setOrgEntitlements] = useState<Record<string, AppSlug[]>>(INITIAL_ENTITLEMENTS);

  // Shared Data State
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [events, setEvents] = useState<PlatformEvent[]>([]);

  // Domain App States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);

  // Cross-App Automations State
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(INITIAL_AUTOMATION_RULES);
  const [executionLogs, setExecutionLogs] = useState<AutomationExecutionLog[]>(INITIAL_EXECUTION_LOGS);

  // Live Toast Banner
  const [activeToast, setActiveToast] = useState<CrossAppToast | null>(null);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerToast = useCallback((toast: Omit<CrossAppToast, 'id' | 'timestamp'>) => {
    const newToast: CrossAppToast = {
      ...toast,
      id: 'toast-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setActiveToast(newToast);

    // Auto dismiss after 8s
    setTimeout(() => {
      setActiveToast((current) => (current?.id === newToast.id ? null : current));
    }, 8000);
  }, []);

  // Supabase Realtime Setup (if credentials provided)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    if (!supabase) return;

    const channel = supabase
      .channel('appweave-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          const eventItem = payload.new as PlatformEvent;
          setEvents((prev) => [eventItem, ...prev]);

          // Handle incoming live broadcast
          if (eventItem.type === 'PROJECT_CREATED' && eventItem.org_id === currentOrg.id) {
            triggerToast({
              title: 'Cross-App Event: Project Created',
              description: `Project "${eventItem.payload.name}" provisioned. HR ready for team allocation.`,
              app: 'projects',
              actionLabel: 'Assign Team',
              actionHref: `/apps/projects/${eventItem.payload.project_id}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentOrg.id, triggerToast]);

  // One Identity: Switch User Persona
  const switchUser = useCallback((email: string) => {
    const target = INITIAL_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      const targetOrg = INITIAL_ORGS.find((o) => o.id === target.org_id);
      if (targetOrg) {
        setCurrentOrg(targetOrg);
      }
      triggerToast({
        title: `Switched Persona: ${target.name}`,
        description: `Logged in as ${target.role} at ${targetOrg?.name || 'Organization'}`,
        app: 'platform',
      });
    }
  }, [triggerToast]);

  // Switch Active Organization
  const switchOrg = useCallback((orgId: string) => {
    const targetOrg = INITIAL_ORGS.find((o) => o.id === orgId);
    if (targetOrg) {
      setCurrentOrg(targetOrg);
      // Pick first user from that org
      const orgUser = INITIAL_USERS.find((u) => u.org_id === orgId) || currentUser;
      setCurrentUser(orgUser);
      triggerToast({
        title: `Switched Organization`,
        description: `Now viewing ${targetOrg.name} (${targetOrg.plan.toUpperCase()} Plan)`,
        app: 'platform',
      });
    }
  }, [currentUser, triggerToast]);

  // Entitlements Engine: Get active entitlements
  const currentEntitlements = orgEntitlements[currentOrg.id] || ['projects'];

  const hasEntitlement = useCallback(
    (app: AppSlug) => {
      return currentEntitlements.includes(app);
    },
    [currentEntitlements]
  );

  const toggleEntitlement = useCallback((app: AppSlug) => {
    setOrgEntitlements((prev) => {
      const currentList = prev[currentOrg.id] || ['projects'];
      const exists = currentList.includes(app);
      const updatedList = exists
        ? currentList.filter((s) => s !== app)
        : [...currentList, app];

      const newEntitlements = {
        ...prev,
        [currentOrg.id]: updatedList,
      };

      // Add to Audit Log
      const auditEntry: AuditLog = {
        id: 'audit-' + Date.now(),
        org_id: currentOrg.id,
        user_id: currentUser.id,
        action: exists ? 'ENTITLEMENT_REVOKED' : 'ENTITLEMENT_GRANTED',
        entity: `App: ${app.toUpperCase()}`,
        details: `${app.toUpperCase()} was ${exists ? 'disabled' : 'enabled'} for ${currentOrg.name}`,
        created_at: new Date().toISOString(),
      };
      setAuditLogs((a) => [auditEntry, ...a]);

      triggerToast({
        title: `Entitlements Updated`,
        description: `${app.toUpperCase()} is now ${exists ? 'LOCKED' : 'UNLOCKED'} for ${currentOrg.name}`,
        app: 'platform',
      });

      return newEntitlements;
    });
  }, [currentOrg.id, currentOrg.name, currentUser.id, triggerToast]);

  // Notifications Management
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Shared Contacts
  const addContact = useCallback((contactData: Omit<Contact, 'id' | 'org_id'>): Contact => {
    const newContact: Contact = {
      ...contactData,
      id: 'contact-' + Date.now(),
      org_id: currentOrg.id,
      created_at: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
    return newContact;
  }, [currentOrg.id]);

  // ==========================================================================
  // CROSS-APP EVENT FLOW: CREATE PROJECT
  // 1. User creates project in Projects app
  // 2. Event bus dispatches { type: 'PROJECT_CREATED', payload: { project_id, name, org_id } }
  // 3. Documents module catches event -> auto-creates folder /projects/{project_name}/
  // 4. HR module catches event -> triggers toast & suggests team assignment
  // ==========================================================================
  const createProject = useCallback(async (data: {
    name: string;
    clientId: string;
    description?: string;
    budget?: number;
    dueDate?: string;
  }): Promise<Project> => {
    const projectId = 'proj-' + Date.now();
    const newProject: Project = {
      id: projectId,
      org_id: currentOrg.id,
      name: data.name,
      client_id: data.clientId,
      status: 'planning',
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
      description: data.description,
      budget: data.budget || 0,
      due_date: data.dueDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    };

    // 1. Update Projects State
    setProjects((prev) => [newProject, ...prev]);

    // Add default initial milestone
    const initialMilestone: Milestone = {
      id: 'mile-' + Date.now(),
      project_id: projectId,
      title: 'Project Inception & Client Brief',
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: 'in_progress',
    };
    setMilestones((prev) => [initialMilestone, ...prev]);

    // 2. Cross-App Event Dispatch
    const eventPayload = {
      project_id: projectId,
      name: data.name,
      org_id: currentOrg.id,
      created_by_name: currentUser.name,
    };

    const platformEvent: PlatformEvent = {
      id: 'event-' + Date.now(),
      org_id: currentOrg.id,
      type: 'PROJECT_CREATED',
      payload: eventPayload,
      created_at: new Date().toISOString(),
    };
    setEvents((prev) => [platformEvent, ...prev]);

    // 3. Cross-App Event: DOCUMENTS Module Auto-Provisioning
    // Auto-create folder: /projects/{project_name}/
    const autoFolderId = 'folder-' + Date.now();
    const autoFolder: Folder = {
      id: autoFolderId,
      org_id: currentOrg.id,
      name: data.name,
      project_id: projectId,
      parent_id: null,
      created_at: new Date().toISOString(),
    };
    // Sub-folders standard for architecture: Blueprints, Specifications
    const subFolder1: Folder = {
      id: 'folder-sub1-' + Date.now(),
      org_id: currentOrg.id,
      name: 'Architectural Blueprints & CAD',
      project_id: projectId,
      parent_id: autoFolderId,
      created_at: new Date().toISOString(),
    };
    const subFolder2: Folder = {
      id: 'folder-sub2-' + Date.now(),
      org_id: currentOrg.id,
      name: 'Specifications & Material Schedules',
      project_id: projectId,
      parent_id: autoFolderId,
      created_at: new Date().toISOString(),
    };
    setFolders((prev) => [autoFolder, subFolder1, subFolder2, ...prev]);

    // 4. Cross-App Event: AUDIT LOGS Tracking
    const auditEntry1: AuditLog = {
      id: 'audit-' + Date.now(),
      org_id: currentOrg.id,
      user_id: currentUser.id,
      action: 'PROJECT_CREATED',
      entity: `Project: ${data.name}`,
      details: `Initialized with budget $${(data.budget || 0).toLocaleString()} for client ID ${data.clientId}`,
      created_at: new Date().toISOString(),
    };
    const auditEntry2: AuditLog = {
      id: 'audit-doc-' + Date.now(),
      org_id: currentOrg.id,
      user_id: currentUser.id,
      action: 'DOCUMENTS_AUTO_PROVISIONED',
      entity: `Folder: ${data.name}`,
      details: `Cross-App Event auto-generated root and architectural subfolders`,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [auditEntry1, auditEntry2, ...prev]);

    // 5. In-App Notification
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      user_id: currentUser.id,
      message: `Project "${data.name}" created! Documents folder ready & HR staffing suggested.`,
      read: false,
      type: 'event',
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 6. Real-time Live Toast: Broadcast cross-app trigger
    triggerToast({
      title: '⚡ Cross-App Event Fired!',
      description: `Project "${data.name}" created → Documents folder auto-provisioned → HR module suggests team assignment.`,
      app: 'projects',
      actionLabel: 'Assign Staff',
      actionHref: `/apps/projects/${projectId}`,
    });

    return newProject;
  }, [currentOrg.id, currentUser.id, currentUser.name, triggerToast]);

  // Update Milestone
  const updateMilestoneStatus = useCallback(
    (milestoneId: string, status: 'pending' | 'in_progress' | 'completed') => {
      setMilestones((prev) => {
        const target = prev.find((m) => m.id === milestoneId);
        if (target && status === 'completed' && target.status !== 'completed') {
          // Automation: Create milestone completed audit log
          const auditEntry: AuditLog = {
            id: 'audit-' + Date.now(),
            org_id: currentOrg.id,
            user_id: currentUser.id,
            action: 'MILESTONE_COMPLETED',
            entity: `Milestone: ${target.title}`,
            details: `Cross-App Automation triggered: Auto-archived deliverables in Documents.`,
            created_at: new Date().toISOString(),
          };
          setAuditLogs((a) => [auditEntry, ...a]);

          // Notification
          const notif: Notification = {
            id: 'notif-' + Date.now(),
            user_id: currentUser.id,
            message: `Milestone "${target.title}" completed! Handover deliverables archived in Documents.`,
            read: false,
            type: 'event',
            created_at: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);

          // Cross-App Toast
          triggerToast({
            title: '⚡ Cross-App Event: Milestone Completed',
            description: `"${target.title}" reached 100% → Deliverables archived in Documents → Capacity updated in HR.`,
            app: 'projects',
          });

          // Telemetry
          setAutomationRules((rules) =>
            rules.map((r) =>
              r.triggerType === 'MILESTONE_COMPLETED' && r.enabled
                ? { ...r, executionCount: r.executionCount + 1, lastExecutedAt: new Date().toISOString() }
                : r
            )
          );
        }
        return prev.map((m) => (m.id === milestoneId ? { ...m, status } : m));
      });
    },
    [currentOrg.id, currentUser.id, triggerToast]
  );

  const addMilestone = useCallback((projectId: string, title: string, dueDate: string) => {
    const newM: Milestone = {
      id: 'mile-' + Date.now(),
      project_id: projectId,
      title,
      due_date: dueDate,
      status: 'pending',
    };
    setMilestones((prev) => [...prev, newM]);
  }, []);

  // Documents App: Create Folder
  const createFolder = useCallback(async (name: string, projectId?: string, parentId?: string): Promise<Folder> => {
    const newFolder: Folder = {
      id: 'folder-' + Date.now(),
      org_id: currentOrg.id,
      name,
      project_id: projectId || null,
      parent_id: parentId || null,
      created_at: new Date().toISOString(),
    };
    setFolders((prev) => [newFolder, ...prev]);
    return newFolder;
  }, [currentOrg.id]);

  // Documents App: Upload Document
  const uploadDocument = useCallback(async (data: {
    folderId: string;
    name: string;
    fileType?: string;
    size?: number;
  }): Promise<DocumentItem> => {
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      folder_id: data.folderId,
      name: data.name,
      file_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      version: 1,
      uploaded_by: currentUser.id,
      uploader_name: currentUser.name,
      file_type: data.fileType || 'Specification Document',
      size: data.size || Math.floor(Math.random() * 8000000) + 1000000,
      created_at: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);

    const auditEntry: AuditLog = {
      id: 'audit-' + Date.now(),
      org_id: currentOrg.id,
      user_id: currentUser.id,
      action: 'DOCUMENT_UPLOADED',
      entity: `File: ${data.name}`,
      details: `Uploaded to folder ${data.folderId} (v1)`,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    triggerToast({
      title: 'Document Stored & Versioned',
      description: `"${data.name}" added to vault with Supabase Storage metadata.`,
      app: 'documents',
    });

    return newDoc;
  }, [currentOrg.id, currentUser.id, currentUser.name, triggerToast]);

  // HR App: Assign Employee to Project
  const assignEmployeeToProject = useCallback(async (
    employeeId: string,
    projectId: string,
    role: string
  ): Promise<Assignment> => {
    const newAssignment: Assignment = {
      id: 'assign-' + Date.now(),
      employee_id: employeeId,
      project_id: projectId,
      role,
      start_date: new Date().toISOString().split('T')[0],
    };

    setAssignments((prev) => {
      // Remove any existing assignment for this employee on this project
      const filtered = prev.filter(
        (a) => !(a.employee_id === employeeId && a.project_id === projectId)
      );
      return [...filtered, newAssignment];
    });

    const emp = employees.find((e) => e.id === employeeId);
    const contact = contacts.find((c) => c.id === emp?.contact_id);
    const proj = projects.find((p) => p.id === projectId);

    const auditEntry: AuditLog = {
      id: 'audit-' + Date.now(),
      org_id: currentOrg.id,
      user_id: currentUser.id,
      action: 'TEAM_MEMBER_ASSIGNED',
      entity: `Staff: ${contact?.name || 'Employee'} → ${proj?.name || 'Project'}`,
      details: `Role assigned: ${role}`,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    triggerToast({
      title: 'Cross-App Assignment Saved',
      description: `${contact?.name || 'Team member'} assigned as ${role} on ${proj?.name || 'project'}.`,
      app: 'hr',
      actionLabel: 'View Project',
      actionHref: `/apps/projects/${projectId}`,
    });

    return newAssignment;
  }, [contacts, currentOrg.id, currentUser.id, employees, projects, triggerToast]);

  // HR App: Add Employee (Links with Shared Contacts!)
  const addEmployee = useCallback(async (data: {
    name: string;
    email: string;
    designation: string;
    department: string;
    skills?: string[];
  }): Promise<Employee> => {
    // 1. Create Shared Contact first (Zero Duplication!)
    const contactId = 'contact-emp-' + Date.now();
    const newContact: Contact = {
      id: contactId,
      org_id: currentOrg.id,
      name: data.name,
      email: data.email,
      type: 'employee',
      company: currentOrg.name,
      created_at: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);

    // 2. Create Employee linking to contact
    const empId = 'emp-' + Date.now();
    const newEmployee: Employee = {
      id: empId,
      contact_id: contactId,
      org_id: currentOrg.id,
      designation: data.designation,
      department: data.department,
      skills: data.skills || ['Architectural Design'],
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`,
      joined_date: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) => [newEmployee, ...prev]);

    const auditEntry: AuditLog = {
      id: 'audit-' + Date.now(),
      org_id: currentOrg.id,
      user_id: currentUser.id,
      action: 'EMPLOYEE_ONBOARDED',
      entity: `Employee: ${data.name}`,
      details: `${data.designation} (${data.department})`,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);

    triggerToast({
      title: 'Employee Onboarded',
      description: `${data.name} added to HR roster & shared contacts.`,
      app: 'hr',
    });

    return newEmployee;
  }, [currentOrg.id, currentOrg.name, currentUser.id, triggerToast]);

  // Automations: Toggle Rule On/Off
  const toggleAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  // Automations: Delete Rule
  const deleteAutomationRule = useCallback((ruleId: string) => {
    setAutomationRules((prev) => prev.filter((r) => r.id !== ruleId));
  }, []);

  // Automations: Add Rule
  const addAutomationRule = useCallback(
    (ruleData: Omit<AutomationRule, 'id' | 'executionCount' | 'lastExecutedAt'>): AutomationRule => {
      const newRule: AutomationRule = {
        ...ruleData,
        id: 'rule-' + Date.now(),
        executionCount: 0,
        lastExecutedAt: undefined,
      };
      setAutomationRules((prev) => [newRule, ...prev]);
      return newRule;
    },
    []
  );

  // Automations: Interactive Simulation / Test Execution
  const simulateAutomation = useCallback(
    async (
      ruleId: string
    ): Promise<{ success: boolean; latencyMs: number; actionsTriggered: string[] }> => {
      const rule = automationRules.find((r) => r.id === ruleId);
      if (!rule) {
        return { success: false, latencyMs: 0, actionsTriggered: [] };
      }

      const startTime = performance.now();
      const actionsTriggered: string[] = [];

      for (const action of rule.actions) {
        if (
          action.actionType === 'DOCUMENTS_AUTO_PROVISION_FOLDERS' ||
          action.actionType === 'DOCUMENTS_ARCHIVE_MILESTONE'
        ) {
          const folderName =
            action.actionType === 'DOCUMENTS_ARCHIVE_MILESTONE'
              ? 'As-Built Archive & Compliance'
              : 'CAD Blueprints & Specifications [Auto]';
          const newFolder: Folder = {
            id: 'folder-auto-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            org_id: currentOrg.id,
            name: folderName,
            project_id: projects[0]?.id || null,
            parent_id: null,
            created_at: new Date().toISOString(),
          };
          setFolders((prev) => [newFolder, ...prev]);
          actionsTriggered.push(`Auto-provisioned "${folderName}" folder in Documents`);
        } else if (action.actionType === 'PROJECTS_ADD_MILESTONE') {
          if (projects.length > 0) {
            const targetProj = projects[0];
            const newM: Milestone = {
              id: 'mile-auto-' + Date.now(),
              project_id: targetProj.id,
              title: 'Blueprint Technical Audit & Code Sign-Off',
              due_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
              status: 'pending',
            };
            setMilestones((prev) => [...prev, newM]);
            actionsTriggered.push(`Created review milestone on "${targetProj.name}" in Projects`);
          }
        } else if (action.actionType === 'HR_SUGGEST_ASSIGNMENT') {
          actionsTriggered.push('Evaluated skills matrix & recommended Lead Architect in HR');
        } else if (action.actionType === 'PLATFORM_CREATE_AUDIT_LOG') {
          const auditEntry: AuditLog = {
            id: 'audit-auto-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            org_id: currentOrg.id,
            user_id: currentUser.id,
            action: 'FLOW_AUTOMATION_TRIGGERED',
            entity: `Rule: ${rule.name}`,
            details: `Cross-App pipeline executed (${rule.triggerDomain} ➔ ${action.domain})`,
            created_at: new Date().toISOString(),
          };
          setAuditLogs((prev) => [auditEntry, ...prev]);
          actionsTriggered.push('Logged event in Platform Audit Trail');
        } else if (action.actionType === 'PLATFORM_SEND_NOTIFICATION') {
          const notif: Notification = {
            id: 'notif-auto-' + Date.now(),
            user_id: currentUser.id,
            message: `⚡ Automation "${rule.name}" triggered: ${rule.actions.length} actions executed across apps.`,
            read: false,
            type: 'event',
            created_at: new Date().toISOString(),
          };
          setNotifications((prev) => [notif, ...prev]);
          actionsTriggered.push('Dispatched in-app team notification');
        }
      }

      const latencyMs = Math.max(8, Math.round(performance.now() - startTime + Math.random() * 8));

      // Update rule telemetry
      setAutomationRules((prev) =>
        prev.map((r) =>
          r.id === ruleId
            ? {
                ...r,
                executionCount: r.executionCount + 1,
                lastExecutedAt: new Date().toISOString(),
              }
            : r
        )
      );

      // Add execution log
      const logEntry: AutomationExecutionLog = {
        id: 'exec-' + Date.now(),
        ruleId: rule.id,
        ruleName: rule.name,
        triggerType: rule.triggerType,
        triggerDomain: rule.triggerDomain,
        status: 'success',
        latencyMs,
        actionsTriggered,
        timestamp: new Date().toISOString(),
        summary: `Executed pipeline "${rule.name}". ${actionsTriggered.length} cross-app actions completed in ${latencyMs}ms.`,
      };
      setExecutionLogs((prev) => [logEntry, ...prev]);

      triggerToast({
        title: '⚡ AppWeave Flow Simulated!',
        description: `${rule.name}: ${actionsTriggered.length} cross-app actions executed in ${latencyMs}ms.`,
        app: 'platform',
        actionLabel: 'View Audit Log',
        actionHref: '/settings/audit',
      });

      return { success: true, latencyMs, actionsTriggered };
    },
    [automationRules, currentOrg.id, currentUser.id, projects, triggerToast]
  );

  return (
    <AppContext.Provider
      value={{
        user: currentUser,
        organization: currentOrg,
        organizations: INITIAL_ORGS,
        users: INITIAL_USERS,
        entitlements: currentEntitlements,
        switchUser,
        switchOrg,
        toggleEntitlement,
        hasEntitlement,
        contacts,
        addContact,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        auditLogs,
        events,
        projects,
        milestones,
        createProject,
        updateMilestoneStatus,
        addMilestone,
        folders,
        documents,
        createFolder,
        uploadDocument,
        employees,
        assignments,
        assignEmployeeToProject,
        addEmployee,
        automationRules,
        executionLogs,
        toggleAutomationRule,
        addAutomationRule,
        deleteAutomationRule,
        simulateAutomation,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
