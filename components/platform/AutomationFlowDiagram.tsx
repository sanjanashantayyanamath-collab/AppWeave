'use client';

import React, { useState } from 'react';
import { AutomationRule } from '@/types/automations';
import {
  FolderKanban,
  FileText,
  Users,
  ShieldCheck,
  Bell,
  FolderPlus,
  UserCheck,
  CheckCircle2,
  Zap,
  Filter,
  ArrowRight,
  Play,
  RotateCw,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface AutomationFlowDiagramProps {
  rule: AutomationRule;
  onSimulate: (ruleId: string) => Promise<any>;
  onToggle: (ruleId: string) => void;
}

export function AutomationFlowDiagram({
  rule,
  onSimulate,
  onToggle,
}: AutomationFlowDiagramProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedSuccess, setSimulatedSuccess] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setSimulatedSuccess(false);
    try {
      // Small simulated step animation delay
      const result = await onSimulate(rule.id);
      setLastLatency(result.latencyMs);
      setSimulatedSuccess(true);
      setTimeout(() => {
        setSimulatedSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const getDomainTheme = (domain: string) => {
    switch (domain) {
      case 'projects':
        return {
          border: 'border-blue-500/40',
          bg: 'bg-blue-950/40',
          badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          glow: 'shadow-blue-500/10',
          icon: <FolderKanban className="w-4 h-4 text-blue-400" />,
          accent: 'text-blue-400',
        };
      case 'documents':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-amber-950/40',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          glow: 'shadow-amber-500/10',
          icon: <FileText className="w-4 h-4 text-amber-400" />,
          accent: 'text-amber-400',
        };
      case 'hr':
        return {
          border: 'border-purple-500/40',
          bg: 'bg-purple-950/40',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          glow: 'shadow-purple-500/10',
          icon: <Users className="w-4 h-4 text-purple-400" />,
          accent: 'text-purple-400',
        };
      default:
        return {
          border: 'border-sky-500/40',
          bg: 'bg-sky-950/40',
          badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          glow: 'shadow-sky-500/10',
          icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
          accent: 'text-sky-400',
        };
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'DOCUMENTS_AUTO_PROVISION_FOLDERS':
      case 'DOCUMENTS_ARCHIVE_MILESTONE':
        return <FolderPlus className="w-4 h-4 text-amber-400" />;
      case 'HR_SUGGEST_ASSIGNMENT':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'PROJECTS_ADD_MILESTONE':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'PLATFORM_SEND_NOTIFICATION':
        return <Bell className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-sky-400" />;
    }
  };

  const triggerTheme = getDomainTheme(rule.triggerDomain);

  return (
    <div
      className={`rounded-2xl border bg-slate-900/60 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-lg ${
        rule.enabled ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-70'
      } ${isSimulating ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/10' : ''}`}
    >
      {/* Top Bar: Rule Title & Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${triggerTheme.bg} ${triggerTheme.border}`}
          >
            {triggerTheme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">{rule.name}</h3>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                  rule.enabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {rule.enabled ? 'Active Pipeline' : 'Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">{rule.description}</p>
          </div>
        </div>

        {/* Right Header Controls: Run & Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Telemetry Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {rule.executionCount} runs {lastLatency ? `• ${lastLatency}ms` : ''}
            </span>
          </div>

          {/* Test / Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border shadow-sm ${
              simulatedSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:border-indigo-500/60'
            }`}
          >
            {isSimulating ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>Simulating...</span>
              </>
            ) : simulatedSuccess ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Triggered!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>Test & Run</span>
              </>
            )}
          </button>

          {/* Enable / Disable Toggle */}
          <button
            onClick={() => onToggle(rule.id)}
            title={rule.enabled ? 'Pause Pipeline' : 'Enable Pipeline'}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            {rule.enabled ? (
              <ToggleRight className="w-7 h-7 text-indigo-400 hover:text-indigo-300" />
            ) : (
              <ToggleLeft className="w-7 h-7 text-slate-600 hover:text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Visual Flow Canvas */}
      <div className="p-4 sm:p-6 bg-slate-950/20 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between gap-3 relative py-2">
          {/* Node 1: Trigger */}
          <div
            className={`w-52 p-3.5 rounded-xl border bg-slate-950/80 backdrop-blur-md shadow-md transition-all duration-300 ${
              triggerTheme.border
            } ${isSimulating ? 'scale-105 ring-2 ring-indigo-500' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Trigger Event
              </span>
              <span
                className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${triggerTheme.badge}`}
              >
                {rule.triggerDomain}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              {triggerTheme.icon}
              <span className="text-xs font-semibold text-white truncate">{rule.triggerLabel}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block truncate">
              event: {rule.triggerType}
            </span>
          </div>

          {/* Connector 1: Arrow & Wave */}
          <div className="flex-1 flex flex-col items-center justify-center px-1">
            <div className="w-full h-0.5 relative bg-slate-800">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-amber-500 transition-all duration-700 ${
                  isSimulating ? 'opacity-100 animate-pulse' : 'opacity-30'
                }`}
              />
            </div>
            <ArrowRight
              className={`w-3.5 h-3.5 text-slate-500 -mt-2 transition ${
                isSimulating ? 'text-amber-400 translate-x-2' : ''
              }`}
            />
          </div>

          {/* Node 2: Condition / Filter Gate */}
          <div
            className={`w-44 p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-md shadow-md text-left ${
              isSimulating ? 'border-amber-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Condition Gate
              </span>
              <Filter className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-xs font-medium text-slate-200 line-clamp-2">
              {rule.condition.label}
            </div>
            <span className="text-[9px] text-slate-500 block mt-1 uppercase font-semibold">
              Rule: {rule.condition.operator || 'Always'}
            </span>
          </div>

          {/* Connector 2: Branch Arrow */}
          <div className="flex-1 flex flex-col items-center justify-center px-1">
            <div className="w-full h-0.5 relative bg-slate-800">
              <div
                className={`absolute inset-0 bg-gradient-to-r from-amber-500 via-purple-500 to-sky-500 transition-all duration-700 ${
                  isSimulating ? 'opacity-100 animate-pulse' : 'opacity-30'
                }`}
              />
            </div>
            <ArrowRight
              className={`w-3.5 h-3.5 text-slate-500 -mt-2 transition ${
                isSimulating ? 'text-purple-400 translate-x-2' : ''
              }`}
            />
          </div>

          {/* Node 3: Cross-App Action Branch */}
          <div className="w-64 space-y-2">
            {rule.actions.map((act) => {
              const actTheme = getDomainTheme(act.domain);
              return (
                <div
                  key={act.id}
                  className={`p-2.5 rounded-xl border bg-slate-950/90 shadow-sm transition-all duration-300 ${
                    actTheme.border
                  } ${isSimulating ? 'scale-102 ring-1 ring-purple-500/50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {getActionIcon(act.actionType)}
                      <span className="text-xs font-semibold text-white truncate max-w-[130px]">
                        {act.title}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${actTheme.badge}`}
                    >
                      {act.domain}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{act.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
