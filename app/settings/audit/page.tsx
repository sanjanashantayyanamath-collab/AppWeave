'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { AuditLog, UserProfile } from '@/types/platform';
import {
  ShieldAlert,
  Search,
  Clock,
  User,
  Activity,
} from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs, organization, users } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const orgLogs = auditLogs.filter((log: AuditLog) => log.org_id === organization.id);
  const filteredLogs = orgLogs.filter(
    (log: AuditLog) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(log.details?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Platform Audit Trail
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Principle #3 Compliance
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Immutable activity log capturing all project creations, document uploads, HR assignments, and entitlement mutations.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Logged System Actions ({filteredLogs.length})
              </h3>
              <span className="text-xs text-slate-500">Tenant: {organization.name}</span>
            </div>

            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No audit entries found matching query.
                </div>
              ) : (
                filteredLogs.map((log: AuditLog) => {
                  const userRecord = users.find((u: UserProfile) => u.id === log.user_id);

                  return (
                    <div
                      key={log.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sky-400">{log.action}</span>
                          <span className="text-slate-200 font-semibold">{log.entity}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{log.details}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <User className="w-3 h-3" />
                          <span>Initiated by: {userRecord?.name || 'System / Elena Rostova'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
