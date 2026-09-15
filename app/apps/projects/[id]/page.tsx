'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Project, Milestone } from '@/types/projects';
import { Contact } from '@/types/platform';
import { Assignment, Employee } from '@/types/hr';
import { Folder, DocumentItem } from '@/types/documents';
import {
  FolderKanban,
  ArrowLeft,
  Calendar,
  Building,
  Plus,
  FileText,
  Users,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const {
    projects,
    contacts,
    milestones,
    assignments,
    employees,
    folders,
    documents,
    updateMilestoneStatus,
    addMilestone,
    assignEmployeeToProject,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'team'>('overview');

  // Milestone modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDueDate, setMilestoneDueDate] = useState('2025-12-01');

  // Assign member modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [assignedRole, setAssignedRole] = useState('Project Architect');

  const project = projects.find((p: Project) => p.id === projectId);
  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Project Not Found</h2>
            <Link href="/apps/projects" className="text-blue-400 text-sm hover:underline">
              ← Return to Projects
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const client = contacts.find((c: Contact) => c.id === project.client_id);
  const projectMilestones = milestones.filter((m: Milestone) => m.project_id === projectId);
  const projectAssignments = assignments.filter((a: Assignment) => a.project_id === projectId);
  const projectFolder = folders.find((f: Folder) => f.project_id === projectId);
  const projectDocuments = documents.filter((d: DocumentItem) => projectFolder && d.folder_id === projectFolder.id);

  const completedMilestones = projectMilestones.filter((m: Milestone) => m.status === 'completed').length;
  const progressPercent = projectMilestones.length > 0
    ? Math.round((completedMilestones / projectMilestones.length) * 100)
    : 0;

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;
    addMilestone(projectId, milestoneTitle, milestoneDueDate);
    setMilestoneTitle('');
    setIsMilestoneModalOpen(false);
  };

  const handleAssignMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const empId = selectedEmpId || employees[0]?.id;
    if (!empId) return;

    await assignEmployeeToProject(empId, projectId, assignedRole);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Back link & Title */}
          <div className="space-y-3">
            <Link
              href="/apps/projects"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Roster
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {project.name}
                  </h1>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  Client: <strong className="text-slate-300">{client?.name || 'Private Client'}</strong>
                  <span>•</span>
                  <span>ID: {project.id}</span>
                </p>
              </div>

              {/* Fast links to Documents */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/apps/documents?project_id=${project.id}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Documents Vault</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Overview & Scope
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'milestones'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>Milestones</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {projectMilestones.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>Team & Allocation (HR Link)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-purple-300 font-bold">
                {projectAssignments.length}
              </span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description card */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                  <h3 className="text-sm font-bold text-white">Project Scope & Narrative</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {project.description ||
                      'Detailed spatial plans, architectural engineering, materials board, and site management.'}
                  </p>
                </div>

                {/* Cross-App Documents Auto-Binding Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Cross-App Documents Binding</h4>
                        <p className="text-[11px] text-slate-400">
                          Auto-generated when this project was initialized via event bus
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/apps/documents?project_id=${project.id}`}
                      className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      View Vault <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono">/projects/{project.name}/</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                      Event Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Commercials Card */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
                    Commercials & Schedule
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contract Budget</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        ${(project.budget || 0).toLocaleString()} USD
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Delivery</span>
                      <span className="font-medium text-white">{project.due_date || '2026-06-30'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Milestone Progress</span>
                      <span className="font-medium text-blue-400">{progressPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Client Contact Record (Zero duplication) */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white">Client Directory Record</h3>
                    <span className="text-[10px] text-slate-500">Shared Contacts Core</span>
                  </div>

                  {client ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-semibold text-white">{client.name}</p>
                        <p className="text-slate-400 text-[11px]">{client.company}</p>
                      </div>
                      <div className="text-slate-400 pt-1">
                        <p>Email: <span className="text-slate-200">{client.email}</span></p>
                        <p>Phone: <span className="text-slate-200">{client.phone || '+1 (555) 000-0000'}</span></p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No client details linked.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MILESTONES */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Deliverable Milestones</h3>
                  <p className="text-xs text-slate-400">Click a milestone status badge to toggle progression</p>
                </div>
                <button
                  onClick={() => setIsMilestoneModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
              </div>

              <div className="space-y-2">
                {projectMilestones.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No milestones added yet. Click "Add Milestone" to set targets.
                  </div>
                ) : (
                  projectMilestones.map((m: Milestone) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Due: {m.due_date}</span>
                        </div>
                      </div>

                      {/* Status toggle button */}
                      <button
                        onClick={() => {
                          const nextStatus =
                            m.status === 'pending'
                              ? 'in_progress'
                              : m.status === 'in_progress'
                              ? 'completed'
                              : 'pending';
                          updateMilestoneStatus(m.id, nextStatus);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize border transition cursor-pointer ${
                          m.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : m.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Click to cycle status"
                      >
                        {m.status.replace('_', ' ')} ↺
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TEAM TAB (SHARED DATA FROM HR APP) */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">Assigned Project Staff</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                      Live HR Link (Zero Copy)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Team member records are pulled directly from the HR Module without duplicate records.
                  </p>
                </div>

                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-600/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Assign Staff Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectAssignments.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                    No staff assigned yet. Click "Assign Staff Member" to link architects from HR.
                  </div>
                ) : (
                  projectAssignments.map((assign: Assignment) => {
                    const emp = employees.find((e: Employee) => e.id === assign.employee_id);
                    const contact = contacts.find((c: Contact) => c.id === emp?.contact_id);

                    return (
                      <div
                        key={assign.id}
                        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3 hover:border-purple-500/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={emp?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={contact?.name || 'Staff'}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/30"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{contact?.name || 'Staff Member'}</h4>
                            <p className="text-[11px] text-purple-400 font-medium">{assign.role}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Department:</span>
                            <span className="text-slate-300">{emp?.department || 'Architecture'}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Designation:</span>
                            <span className="text-slate-300">{emp?.designation}</span>
                          </div>
                          <div className="flex justify-between text-slate-400 text-[11px]">
                            <span>Assigned Since:</span>
                            <span className="text-slate-300">{assign.start_date}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/apps/hr/${emp?.id}`}
                            className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                          >
                            View HR Profile <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add Milestone */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Add Project Milestone</h3>
              <button onClick={() => setIsMilestoneModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Milestone Deliverable</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Interior Finishes Specification"
                  value={milestoneTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMilestoneTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Due Date</label>
                <input
                  type="date"
                  required
                  value={milestoneDueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMilestoneDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Team Member from HR */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Assign Staff Member from HR</h3>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAssignMember} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Staff Member (from HR App)</label>
                <select
                  value={selectedEmpId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {employees.map((emp: Employee) => {
                    const c = contacts.find((item: Contact) => item.id === emp.contact_id);
                    return (
                      <option key={emp.id} value={emp.id}>
                        {c?.name || 'Staff'} — {emp.designation} ({emp.department})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Project Role Assignment</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Interior Specifier"
                  value={assignedRole}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignedRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                This writes to the platform <code>assignments</code> table. No employee data is duplicated.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-lg shadow-purple-600/25"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
