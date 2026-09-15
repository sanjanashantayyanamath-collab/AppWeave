'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Project, ProjectStatus, Milestone } from '@/types/projects';
import { Contact } from '@/types/platform';
import { Assignment } from '@/types/hr';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Users,
  Building,
  Zap,
} from 'lucide-react';

export default function ProjectsPage() {
  const {
    organization,
    projects,
    contacts,
    assignments,
    milestones,
    createProject,
  } = useAppStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [budget, setBudget] = useState(350000);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-06-30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orgProjects = projects.filter((p: Project) => p.org_id === organization.id);
  const clientContacts = contacts.filter((c: Contact) => c.org_id === organization.id && c.type === 'client');

  const filteredProjects = orgProjects.filter((proj: Project) => {
    const matchesFilter = filterStatus === 'all' || proj.status === filterStatus;
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalBudget = orgProjects.reduce((sum: number, p: Project) => sum + (p.budget || 0), 0);
  const activeCount = orgProjects.filter((p: Project) => p.status === 'active').length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const selectedClient = clientId || clientContacts[0]?.id || 'contact-apex';

    await createProject({
      name,
      clientId: selectedClient,
      budget: Number(budget),
      description,
      dueDate,
    });

    setName('');
    setDescription('');
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'planning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Projects Module</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Electric Blue
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural commissions, interior scopes, milestones, and cross-module team allocations.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-700 font-mono">Event Bus</span>
            </button>
          </div>

          {/* Metric KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Active Commissions</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{activeCount}</span>
                <span className="text-xs text-blue-400 font-medium">of {orgProjects.length} total</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Total Pipeline Value</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  ${(totalBudget / 1000).toFixed(0)}k
                </span>
                <span className="text-xs text-slate-500">USD</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Milestones Tracked</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{milestones.length}</span>
                <span className="text-xs text-purple-400 font-medium">across active scopes</span>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
              {(['all', 'planning', 'active', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-sm space-y-3">
                <FolderKanban className="w-10 h-10 mx-auto text-slate-600" />
                <p>No projects match your filter.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              filteredProjects.map((proj: Project) => {
                const client = contacts.find((c: Contact) => c.id === proj.client_id);
                const projAssignments = assignments.filter((a: Assignment) => a.project_id === proj.id);
                const projMilestones = milestones.filter((m: Milestone) => m.project_id === proj.id);
                const completedMilestones = projMilestones.filter((m: Milestone) => m.status === 'completed').length;
                const progress =
                  projMilestones.length > 0
                    ? Math.round((completedMilestones / projMilestones.length) * 100)
                    : 0;

                return (
                  <Link
                    key={proj.id}
                    href={`/apps/projects/${proj.id}`}
                    className="group bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/60 rounded-3xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-0.5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(proj.status)}`}>
                          {proj.status}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">
                          ${(proj.budget || 0).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {proj.description || 'No description specified.'}
                        </p>
                      </div>

                      {/* Shared Client Record */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                        <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">Client: <strong className="text-slate-300">{client?.name || 'Private Client'}</strong></span>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Milestone Progress</span>
                          <span className="font-semibold text-white">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer with Staff Avatars & Arrow */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-slate-400 text-[11px]">
                          {projAssignments.length} Staff Assigned
                        </span>
                      </div>

                      <span className="text-blue-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition text-xs">
                        Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Modal: Create Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Architecture Project</h3>
                  <p className="text-xs text-slate-400">Dispatches real-time event to Documents & HR</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Waterfront Residence"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Client (Shared Core)</label>
                  <select
                    value={clientId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClientId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {clientContacts.map((c: Contact) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Budget (USD)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Scope Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the architectural scope, materials, and target deliverables..."
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 space-y-1">
                <p className="font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  Live Event Trigger
                </p>
                <p className="text-[11px] text-blue-200/80">
                  Creating this project immediately broadcasts a <code>PROJECT_CREATED</code> event.
                  The Documents app will auto-create the folder, and HR will suggest staffing.
                </p>
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
