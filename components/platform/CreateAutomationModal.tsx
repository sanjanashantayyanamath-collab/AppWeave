'use client';

import React, { useState } from 'react';
import {
  AutomationRule,
  AutomationTriggerDomain,
  AutomationTriggerType,
  AutomationAction,
  AutomationActionType,
} from '@/types/automations';
import {
  X,
  Zap,
  FolderKanban,
  FileText,
  Users,
  ShieldAlert,
  Plus,
  Check,
  Filter,
} from 'lucide-react';

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: Omit<AutomationRule, 'id' | 'executionCount' | 'lastExecutedAt'>) => void;
  orgId: string;
}

export function CreateAutomationModal({
  isOpen,
  onClose,
  onSave,
  orgId,
}: CreateAutomationModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerDomain, setTriggerDomain] = useState<AutomationTriggerDomain>('projects');
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>('PROJECT_CREATED');
  const [conditionOperator, setConditionOperator] = useState<'always' | 'greater_than' | 'contains'>('always');
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'DOCUMENTS_AUTO_PROVISION_FOLDERS',
    'HR_SUGGEST_ASSIGNMENT',
  ]);

  if (!isOpen) return null;

  const handleDomainChange = (domain: AutomationTriggerDomain) => {
    setTriggerDomain(domain);
    if (domain === 'projects') setTriggerType('PROJECT_CREATED');
    if (domain === 'documents') setTriggerType('DOCUMENT_UPLOADED');
    if (domain === 'hr') setTriggerType('TEAM_ASSIGNED');
  };

  const toggleAction = (actionKey: string) => {
    if (selectedActions.includes(actionKey)) {
      if (selectedActions.length > 1) {
        setSelectedActions(selectedActions.filter((a) => a !== actionKey));
      }
    } else {
      setSelectedActions([...selectedActions, actionKey]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const actionDefinitions: Record<string, Omit<AutomationAction, 'id'>> = {
      DOCUMENTS_AUTO_PROVISION_FOLDERS: {
        domain: 'documents',
        actionType: 'DOCUMENTS_AUTO_PROVISION_FOLDERS',
        title: 'Provision CAD Vault Folders',
        description: 'Auto-creates project folder structure in Documents.',
      },
      HR_SUGGEST_ASSIGNMENT: {
        domain: 'hr',
        actionType: 'HR_SUGGEST_ASSIGNMENT',
        title: 'Recommend Lead Architect',
        description: 'Recommends available specialized staff in HR.',
      },
      PROJECTS_ADD_MILESTONE: {
        domain: 'projects',
        actionType: 'PROJECTS_ADD_MILESTONE',
        title: 'Schedule Review Milestone',
        description: 'Adds follow-up sign-off milestone to Projects tracker.',
      },
      PLATFORM_CREATE_AUDIT_LOG: {
        domain: 'platform',
        actionType: 'PLATFORM_CREATE_AUDIT_LOG',
        title: 'Compliance Audit Entry',
        description: 'Records immutable compliance trace in Audit Trail.',
      },
      PLATFORM_SEND_NOTIFICATION: {
        domain: 'platform',
        actionType: 'PLATFORM_SEND_NOTIFICATION',
        title: 'Broadcast Toast & Alert',
        description: 'Dispatches real-time notification to project team.',
      },
    };

    const actions: AutomationAction[] = selectedActions.map((key, idx) => ({
      ...actionDefinitions[key],
      id: `act-new-${idx}-${Date.now()}`,
    }));

    const triggerLabels: Record<AutomationTriggerType, string> = {
      PROJECT_CREATED: 'New Project Commission Initialized',
      MILESTONE_COMPLETED: 'Milestone Marked Completed',
      DOCUMENT_UPLOADED: 'New Drawing / Document Uploaded',
      TEAM_ASSIGNED: 'Architect Assigned to Project',
      ENTITLEMENT_UPDATED: 'Organization Plan Changed',
    };

    const conditionLabels = {
      always: 'Always execute (Unconditional)',
      greater_than: 'If budget exceeds $500,000',
      contains: 'If file is architectural drawing (.dwg, .cad, .bim)',
    };

    onSave({
      org_id: orgId,
      name,
      description: description || 'Custom cross-app automated flow.',
      category: 'custom',
      enabled: true,
      triggerDomain,
      triggerType,
      triggerLabel: triggerLabels[triggerType] || 'Trigger Event',
      condition: {
        operator: conditionOperator,
        label: conditionLabels[conditionOperator],
      },
      actions,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Create AppWeave Flow</h2>
              <p className="text-xs text-slate-400">
                Design a cross-app automated pipeline connecting Projects, Documents, and HR.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Flow Name & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Flow Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LEED Certification Fast-Track"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this workflow accomplishes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Step 2: Source Trigger App */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              1. When this happens in: (Source App)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleDomainChange('projects')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  triggerDomain === 'projects'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FolderKanban className="w-5 h-5 text-blue-400 mb-2" />
                <span className="text-xs font-bold block">Projects</span>
                <span className="text-[10px] text-slate-400">Project / Milestone</span>
              </button>

              <button
                type="button"
                onClick={() => handleDomainChange('documents')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  triggerDomain === 'documents'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 text-amber-400 mb-2" />
                <span className="text-xs font-bold block">Documents</span>
                <span className="text-[10px] text-slate-400">Drawings / CAD</span>
              </button>

              <button
                type="button"
                onClick={() => handleDomainChange('hr')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  triggerDomain === 'hr'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Users className="w-5 h-5 text-purple-400 mb-2" />
                <span className="text-xs font-bold block">HR & Teams</span>
                <span className="text-[10px] text-slate-400">Staff Allocation</span>
              </button>
            </div>
          </div>

          {/* Trigger Event Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Specific Trigger Event
            </label>
            <select
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value as AutomationTriggerType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {triggerDomain === 'projects' && (
                <>
                  <option value="PROJECT_CREATED">PROJECT_CREATED (New Project Initialized)</option>
                  <option value="MILESTONE_COMPLETED">MILESTONE_COMPLETED (Milestone Marked Complete)</option>
                </>
              )}
              {triggerDomain === 'documents' && (
                <option value="DOCUMENT_UPLOADED">DOCUMENT_UPLOADED (New Drawing or Spec Stored)</option>
              )}
              {triggerDomain === 'hr' && (
                <option value="TEAM_ASSIGNED">TEAM_ASSIGNED (Architect Staffed to Project)</option>
              )}
            </select>
          </div>

          {/* Step 3: Condition Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Condition Gate</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConditionOperator('always')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                  conditionOperator === 'always'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Always Execute
              </button>
              <button
                type="button"
                onClick={() => setConditionOperator('greater_than')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                  conditionOperator === 'greater_than'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Budget &gt; $500k
              </button>
              <button
                type="button"
                onClick={() => setConditionOperator('contains')}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition ${
                  conditionOperator === 'contains'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                Is Blueprint / CAD
              </button>
            </div>
          </div>

          {/* Step 4: Multi-App Target Actions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              3. Automatically execute in other apps:
            </label>
            <div className="space-y-2">
              {[
                {
                  key: 'DOCUMENTS_AUTO_PROVISION_FOLDERS',
                  app: 'Documents',
                  color: 'border-amber-500/30 text-amber-400',
                  title: 'Auto-Provision CAD / BIM Folders',
                  desc: 'Creates root and blueprint folder hierarchy in Documents.',
                },
                {
                  key: 'HR_SUGGEST_ASSIGNMENT',
                  app: 'HR & Teams',
                  color: 'border-purple-500/30 text-purple-400',
                  title: 'Recommend Lead Architect Staffing',
                  desc: 'Queries skills matrix and suggests certified architect.',
                },
                {
                  key: 'PROJECTS_ADD_MILESTONE',
                  app: 'Projects',
                  color: 'border-blue-500/30 text-blue-400',
                  title: 'Schedule Review Milestone',
                  desc: 'Adds code compliance audit to milestone tracker.',
                },
                {
                  key: 'PLATFORM_CREATE_AUDIT_LOG',
                  app: 'Platform Core',
                  color: 'border-sky-500/30 text-sky-400',
                  title: 'Log Immutable Audit Record',
                  desc: 'Records governance compliance in Audit Trail.',
                },
                {
                  key: 'PLATFORM_SEND_NOTIFICATION',
                  app: 'Platform Core',
                  color: 'border-emerald-500/30 text-emerald-400',
                  title: 'Dispatch Team Notification',
                  desc: 'Triggers real-time notification bell and toast.',
                },
              ].map((act) => {
                const isSelected = selectedActions.includes(act.key);
                return (
                  <div
                    key={act.key}
                    onClick={() => toggleAction(act.key)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'border-indigo-500/60 bg-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${act.color}`}>
                          {act.app}
                        </span>
                        <span className="text-xs font-semibold text-white">{act.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy AppWeave Flow</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
