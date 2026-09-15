'use client';

import React from 'react';
import { useAppStore } from '@/lib/store/app-context';
import { Sparkles, X, ArrowRight, FolderKanban, FileText, Users, Bell } from 'lucide-react';
import Link from 'next/link';

export function EventToast() {
  const { activeToast, dismissToast } = useAppStore();

  if (!activeToast) return null;

  const appIcons = {
    projects: <FolderKanban className="w-5 h-5 text-blue-400" />,
    documents: <FileText className="w-5 h-5 text-amber-400" />,
    hr: <Users className="w-5 h-5 text-purple-400" />,
    platform: <Bell className="w-5 h-5 text-emerald-400" />,
  };

  const borderColors = {
    projects: 'border-blue-500/40 shadow-blue-500/10',
    documents: 'border-amber-500/40 shadow-amber-500/10',
    hr: 'border-purple-500/40 shadow-purple-500/10',
    platform: 'border-emerald-500/40 shadow-emerald-500/10',
  };

  const badgeBgs = {
    projects: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    documents: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hr: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    platform: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`bg-slate-900/95 border backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col gap-3 relative overflow-hidden ${
          borderColors[activeToast.app] || 'border-slate-700'
        }`}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-amber-500 to-purple-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shadow-inner">
              {appIcons[activeToast.app] || <Sparkles className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeBgs[activeToast.app]}`}>
                  {activeToast.app}
                </span>
                <span className="text-xs text-slate-400">{activeToast.timestamp}</span>
              </div>
              <h4 className="text-sm font-semibold text-white mt-1">{activeToast.title}</h4>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-1">
          {activeToast.description}
        </p>

        {activeToast.actionLabel && activeToast.actionHref && (
          <div className="flex justify-end pt-1">
            <Link
              href={activeToast.actionHref}
              onClick={dismissToast}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition"
            >
              {activeToast.actionLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
