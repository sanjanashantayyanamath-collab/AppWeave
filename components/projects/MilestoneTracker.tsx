'use client';

import React from 'react';
import { Milestone } from '@/types/projects';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  onStatusChange?: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

export function MilestoneTracker({ milestones, onStatusChange }: MilestoneTrackerProps) {
  if (milestones.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/50 border border-slate-800">
        No milestones scheduled yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-white">{m.title}</h4>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Due {m.due_date}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!onStatusChange) return;
              const next =
                m.status === 'pending'
                  ? 'in_progress'
                  : m.status === 'in_progress'
                  ? 'completed'
                  : 'pending';
              onStatusChange(m.id, next);
            }}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition ${
              m.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : m.status === 'in_progress'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {m.status.replace('_', ' ')}
          </button>
        </div>
      ))}
    </div>
  );
}
