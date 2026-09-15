import { AppSlug, SubscriptionPlan } from '@/types/platform';

export interface AppMetadata {
  slug: AppSlug;
  name: string;
  description: string;
  tagline: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  ringColor: string;
  iconName: string;
  defaultPlan: SubscriptionPlan;
}

export const APP_CATALOG: Record<AppSlug, AppMetadata> = {
  projects: {
    slug: 'projects',
    name: 'Projects',
    description: 'Create and manage client architecture & design projects, milestones, and deliverables.',
    tagline: 'Precision project delivery',
    accentColor: '#2563eb', // Electric Blue
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/30 hover:border-blue-500',
    ringColor: 'ring-blue-500/20',
    iconName: 'FolderKanban',
    defaultPlan: 'basic',
  },
  documents: {
    slug: 'documents',
    name: 'Documents',
    description: 'Centralized BIM files, CAD blueprints, contracts, and versioned specification sheets.',
    tagline: 'Real-time versioned asset vault',
    accentColor: '#d97706', // Warm Amber
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30 hover:border-amber-500',
    ringColor: 'ring-amber-500/20',
    iconName: 'FileText',
    defaultPlan: 'enterprise',
  },
  hr: {
    slug: 'hr',
    name: 'HR & Teams',
    description: 'Manage architecture specialists, interior designers, engineers, and project allocations.',
    tagline: 'Staffing & capacity intelligence',
    accentColor: '#9333ea', // Royal Purple
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500/30 hover:border-purple-500',
    ringColor: 'ring-purple-500/20',
    iconName: 'Users',
    defaultPlan: 'enterprise',
  },
};

export const PLAN_DEFAULT_ENTITLEMENTS: Record<SubscriptionPlan, AppSlug[]> = {
  basic: ['projects'],
  enterprise: ['projects', 'documents', 'hr'],
};

export function hasAppEntitlement(
  userEntitlements: AppSlug[] | undefined,
  targetApp: AppSlug
): boolean {
  if (!userEntitlements) return false;
  return userEntitlements.includes(targetApp);
}

export function getAppMetadata(slug: AppSlug): AppMetadata {
  return APP_CATALOG[slug] || APP_CATALOG.projects;
}
