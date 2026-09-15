'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { AutomationFlowDiagram } from '@/components/platform/AutomationFlowDiagram';
import { CreateAutomationModal } from '@/components/platform/CreateAutomationModal';
import { AutomationRule, AutomationExecutionLog } from '@/types/automations';
import {
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Search,
  Sliders,
  Sparkles,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AutomationsPage() {
  const {
    organization,
    automationRules,
    executionLogs,
    toggleAutomationRule,
    addAutomationRule,
    simulateAutomation,
  } = useAppStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter rules by category
  const filteredRules = automationRules.filter((rule) => {
    if (activeCategory === 'all') return true;
    return rule.category === activeCategory;
  });

  // Filter execution logs
  const filteredLogs = executionLogs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.ruleName.toLowerCase().includes(q) ||
      log.triggerType.toLowerCase().includes(q) ||
      log.summary.toLowerCase().includes(q) ||
      log.actionsTriggered.some((act) => act.toLowerCase().includes(q))
    );
  });

  const totalExecutions = automationRules.reduce((acc, r) => acc + r.executionCount, 0);
  const activeCount = automationRules.filter((r) => r.enabled).length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                  <Zap className="w-5 h-5 fill-white/20" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  AppWeave Flow
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Problem AS-06
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Visual event-driven automation engine connecting{' '}
                <span className="text-blue-400 font-medium">Projects</span>,{' '}
                <span className="text-amber-400 font-medium">Documents</span>, and{' '}
                <span className="text-purple-400 font-medium">HR</span> into a unified, autonomous operating system.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Flow</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Active Pipelines</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {activeCount} <span className="text-xs text-slate-500 font-normal">/ {automationRules.length}</span>
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                ● 100% operational
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Total Executions</span>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {totalExecutions}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across {organization.name}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Avg Event Latency</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                12 <span className="text-xs text-slate-500 font-normal">ms</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Synchronous in-memory bus
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">Connected Domains</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                3 <span className="text-xs text-slate-500 font-normal">Apps</span>
              </div>
              <span className="text-[11px] text-purple-400 mt-1 block">
                Projects • Docs • HR
              </span>
            </div>
          </div>

          {/* Section: Category Filter & Rules List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Filter Pipelines:
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Flows' },
                    { id: 'kickoff', label: 'Project Kickoff' },
                    { id: 'compliance', label: 'Code & Compliance' },
                    { id: 'delivery', label: 'Handover & Milestones' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        activeCategory === tab.id
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Click <strong>"Test & Run"</strong> to simulate live node traversal</span>
              </div>
            </div>

            {/* List of Automated Flow Pipelines */}
            <div className="space-y-4">
              {filteredRules.map((rule: AutomationRule) => (
                <AutomationFlowDiagram
                  key={rule.id}
                  rule={rule}
                  onSimulate={simulateAutomation}
                  onToggle={toggleAutomationRule}
                />
              ))}
            </div>
          </div>

          {/* Section: Live Execution History & Telemetry Feed */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Execution Telemetry & Audit Stream
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time log of automated cross-app events dispatched through the AppWeave event bus.
                </p>
              </div>

              {/* Search Log */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter executions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Telemetry Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Pipeline</th>
                    <th className="py-3 px-4">Trigger Domain</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Triggered Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 bg-slate-950/40">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        No executions matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log: AutomationExecutionLog) => (
                      <tr key={log.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {log.ruleName}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${
                              log.triggerDomain === 'projects'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : log.triggerDomain === 'documents'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : log.triggerDomain === 'hr'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            }`}
                          >
                            {log.triggerDomain}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              log.status === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : log.status === 'filtered'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          {log.latencyMs}ms
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {log.actionsTriggered.length === 0 ? (
                              <span className="text-[11px] text-slate-500 italic">No side-effects (Filtered)</span>
                            ) : (
                              log.actionsTriggered.map((act, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                                >
                                  {act}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Create Flow Modal */}
      <CreateAutomationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={addAutomationRule}
        orgId={organization.id}
      />
    </div>
  );
}
