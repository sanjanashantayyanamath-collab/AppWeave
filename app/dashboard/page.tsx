'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { APP_CATALOG } from '@/lib/entitlements';
import { Project } from '@/types/projects';
import { Folder } from '@/types/documents';
import { Employee } from '@/types/hr';
import { Contact, AuditLog, AppSlug } from '@/types/platform';
import {
  FolderKanban,
  FileText,
  Users,
  Lock,
  ArrowRight,
  Plus,
  Zap,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    user,
    organization,
    hasEntitlement,
    projects,
    folders,
    documents,
    employees,
    assignments,
    contacts,
    auditLogs,
    createProject,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjBudget, setNewProjBudget] = useState(250000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter clients from shared contacts
  const clientContacts = contacts.filter((c: Contact) => c.type === 'client');

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    setIsSubmitting(true);
    const clientId = newProjClient || clientContacts[0]?.id || 'contact-apex';

    await createProject({
      name: newProjName,
      clientId,
      budget: Number(newProjBudget),
      description: 'Architectural design & interior construction package.',
    });

    setNewProjName('');
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const appCards = [
    {
      slug: 'projects' as AppSlug,
      icon: <FolderKanban className="w-6 h-6 text-blue-400" />,
      accentColor: 'blue',
      borderClass: 'border-blue-500/30 hover:border-blue-500/60',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      statLabel: 'Active Projects',
      statValue: projects.filter((p: Project) => p.org_id === organization.id).length,
      secondaryStat: `${projects.reduce((acc: number, p: Project) => acc + (p.budget || 0), 0).toLocaleString()} USD Total Value`,
      href: '/apps/projects',
      buttonText: 'Open Projects',
    },
    {
      slug: 'documents' as AppSlug,
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      accentColor: 'amber',
      borderClass: 'border-amber-500/30 hover:border-amber-500/60',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      statLabel: 'Storage Vaults',
      statValue: folders.filter((f: Folder) => f.org_id === organization.id).length,
      secondaryStat: `${documents.length} CAD & BIM files versioned`,
      href: '/apps/documents',
      buttonText: 'Open Documents',
    },
    {
      slug: 'hr' as AppSlug,
      icon: <Users className="w-6 h-6 text-purple-400" />,
      accentColor: 'purple',
      borderClass: 'border-purple-500/30 hover:border-purple-500/60',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      statLabel: 'Design & Build Staff',
      statValue: employees.filter((e: Employee) => e.org_id === organization.id).length,
      secondaryStat: `${assignments.length} Active project allocations`,
      href: '/apps/hr',
      buttonText: 'Open HR & Teams',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner: Greeting & Ecosystem Context */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    {organization.name}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    Plan: {organization.plan.toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Welcome back, {user.name}
                </h1>
                <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                  AppWeave harmonizes your projects, technical drawings, and architectural staff in one unified ecosystem.
                  Data flows without duplication.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-mono">⚡ Cross-App</span>
                </button>

                <Link
                  href="/settings/entitlements"
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:bg-slate-850 text-slate-200 text-sm font-medium transition"
                >
                  Subscription Engine
                </Link>
              </div>
            </div>
          </div>

          {/* Modular Apps Grid (Entitlement Aware) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Modular App Modules
                </h2>
                <p className="text-xs text-slate-400">
                  Access is governed live by your organization's subscription entitlements
                </p>
              </div>

              <span className="text-xs text-slate-400 hidden sm:block">
                {appCards.filter((a) => hasEntitlement(a.slug)).length} of 3 Apps Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {appCards.map((card) => {
                const entitled = hasEntitlement(card.slug);
                const meta = APP_CATALOG[card.slug];

                return (
                  <div
                    key={card.slug}
                    className={`relative rounded-3xl p-6 transition flex flex-col justify-between border backdrop-blur-xl ${
                      entitled
                        ? `bg-slate-900/80 ${card.borderClass} shadow-xl hover:shadow-2xl`
                        : 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700/60 shadow-inner">
                          {card.icon}
                        </div>

                        {entitled ? (
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${card.badgeBg}`}>
                            Active Module
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Upgrade Required
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white">{meta.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{meta.description}</p>
                      </div>

                      {entitled ? (
                        <div className="pt-3 border-t border-slate-800/80 space-y-1">
                          <div className="flex items-baseline justify-between">
                            <span className="text-xs text-slate-400">{card.statLabel}</span>
                            <span className="text-xl font-extrabold text-white">{card.statValue}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{card.secondaryStat}</p>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                          <p className="text-xs text-amber-300/90 font-medium">
                            Not included in {organization.plan.toUpperCase()} plan.
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Upgrade your subscription or toggle in admin settings to unlock.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-6">
                      {entitled ? (
                        <Link
                          href={card.href}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-white text-xs font-semibold border border-slate-700 transition group"
                        >
                          <span>{card.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </Link>
                      ) : (
                        <Link
                          href={`/upgrade?app=${card.slug}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Upgrade to Unlock</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shared Platform Core Status & Live Event Bus */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Shared Data Core (Contacts, One Identity) */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Shared Data Core (Zero Duplication)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Single source of truth shared seamlessly across Projects, Documents & HR
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Unified Contacts Directory</p>
                    <p className="text-[11px] text-slate-400">Clients & team members stored in shared platform core</p>
                  </div>
                  <span className="text-sm font-bold text-white px-2.5 py-1 rounded-xl bg-slate-800">
                    {contacts.filter((c: Contact) => c.org_id === organization.id).length} Records
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">HR Staff → Project Member Link</p>
                    <p className="text-[11px] text-slate-400">Employee IDs link directly without copy-pasting records</p>
                  </div>
                  <span className="text-sm font-bold text-white px-2.5 py-1 rounded-xl bg-slate-800">
                    {assignments.length} Links
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Documents Auto-Binding</p>
                    <p className="text-[11px] text-slate-400">Project folders automatically mapped via cross-app event</p>
                  </div>
                  <span className="text-sm font-bold text-white px-2.5 py-1 rounded-xl bg-slate-800">
                    {folders.filter((f: Folder) => Boolean(f.project_id)).length} Bound
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Real-Time Cross-App Event Bus Log */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Live Cross-App Event Bus
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supabase Realtime event propagation and auto-triggers
                  </p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Listening Live
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {auditLogs.slice(0, 4).map((log: AuditLog) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{log.action}</span>
                        <span className="text-[10px] text-slate-400">{log.entity}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{log.details || 'Event processed successfully.'}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Create Project (Triggers Cross-App Event) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create New Project</h3>
                  <p className="text-xs text-slate-400">Will fire live cross-app event across Documents & HR</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Luxury Penthouse"
                  value={newProjName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProjName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Client (Shared Contacts Table)</label>
                <select
                  value={newProjClient}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewProjClient(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {clientContacts.map((c: Contact) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || 'Client'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Budget (USD)</label>
                <input
                  type="number"
                  value={newProjBudget}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProjBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  What happens on submit:
                </p>
                <ul className="list-disc list-inside text-[11px] text-blue-200/80 space-y-0.5">
                  <li>Project created in database</li>
                  <li>Realtime Event <code className="bg-blue-900/40 px-1 rounded">PROJECT_CREATED</code> dispatched</li>
                  <li>Documents module automatically creates folder <code className="bg-blue-900/40 px-1 rounded">/projects/{'{name}'}/</code></li>
                  <li>HR module pops live toast suggesting team assignment</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  {isSubmitting ? 'Dispatching Events...' : 'Create & Fire Cross-App Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
