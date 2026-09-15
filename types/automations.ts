import { AppSlug } from './platform';

export type AutomationTriggerDomain = AppSlug | 'platform';
export type AutomationActionDomain = AppSlug | 'platform';

export type AutomationTriggerType =
  | 'PROJECT_CREATED'
  | 'MILESTONE_COMPLETED'
  | 'DOCUMENT_UPLOADED'
  | 'TEAM_ASSIGNED'
  | 'ENTITLEMENT_UPDATED';

export type AutomationActionType =
  | 'DOCUMENTS_AUTO_PROVISION_FOLDERS'
  | 'HR_SUGGEST_ASSIGNMENT'
  | 'PROJECTS_ADD_MILESTONE'
  | 'PLATFORM_CREATE_AUDIT_LOG'
  | 'PLATFORM_SEND_NOTIFICATION'
  | 'DOCUMENTS_ARCHIVE_MILESTONE';

export interface AutomationAction {
  id: string;
  domain: AutomationActionDomain;
  actionType: AutomationActionType;
  title: string;
  description: string;
  config?: Record<string, any>;
}

export interface AutomationCondition {
  field?: string;
  operator?: 'equals' | 'greater_than' | 'contains' | 'always';
  value?: any;
  label: string;
}

export interface AutomationRule {
  id: string;
  org_id: string;
  name: string;
  description: string;
  category: 'kickoff' | 'compliance' | 'delivery' | 'custom';
  enabled: boolean;
  triggerDomain: AutomationTriggerDomain;
  triggerType: AutomationTriggerType;
  triggerLabel: string;
  condition: AutomationCondition;
  actions: AutomationAction[];
  executionCount: number;
  lastExecutedAt?: string;
}

export interface AutomationExecutionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerType: string;
  triggerDomain: AutomationTriggerDomain;
  status: 'success' | 'filtered' | 'failed';
  latencyMs: number;
  actionsTriggered: string[];
  timestamp: string;
  summary: string;
}
