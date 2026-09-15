'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Employee, Assignment } from '@/types/hr';
import { Contact } from '@/types/platform';
import { Project } from '@/types/projects';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Plus,
  ExternalLink,
  FolderKanban,
} from 'lucide-react';

export default function EmployeeDetailPage() {
  const params = useParams();
  const empId = params.id as string;

  const {
    employees,
    contacts,
    assignments,
    projects,
    assignEmployeeToProject,
  } = useAppStore();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [roleName, setRoleName] = useState('Senior Consultant');

  const employee = employees.find((e: Employee) => e.id === empId);
  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8 text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Staff Member Not Found</h2>
            <Link href="/apps/hr" className="text-purple-400 text-sm hover:underline">
              ← Return to HR Roster
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const contact = contacts.find((c: Contact) => c.id === employee.contact_id);
  const empAssignments = assignments.filter((a: Assignment) => a.employee_id === empId);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const projId = selectedProjectId || projects[0]?.id;
    if (!projId) return;

    await assignEmployeeToProject(empId, projId, roleName);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Breadcrumb */}
          <div className="space-y-2">
            <Link
              href="/apps/hr"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to HR Roster
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={employee.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={contact?.name || 'Employee'}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/30"
                />
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {contact?.name || 'Staff Member'}
                  </h1>
                  <p className="text-sm text-purple-400 font-semibold">{employee.designation}</p>
                  <p className="text-xs text-slate-400">{employee.department}</p>
                </div>
              </div>

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Allocate to Project</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Contact info & Skills */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Staff Information</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                    Shared Contact
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>{contact?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{contact?.phone || '+1 (555) 444-9876'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span>{contact?.company || 'DesignHouse'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Joined: {employee.joined_date || '2023-01-10'}</span>
                  </div>
                </div>
              </div>

              {/* Skills Card */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                <h3 className="text-sm font-bold text-white">Verified Skills & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {employee.skills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Active Project Assignments */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">Active Project Allocations</h3>
                  <p className="text-xs text-slate-400">
                    Cross-module links between this employee and active client projects
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {empAssignments.length} Assignments
                </span>
              </div>

              <div className="space-y-3">
                {empAssignments.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                    <p>No project assignments on record.</p>
                    <button
                      onClick={() => setIsAssignModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                    >
                      Assign to Project
                    </button>
                  </div>
                ) : (
                  empAssignments.map((assign: Assignment) => {
                    const proj = projects.find((p: Project) => p.id === assign.project_id);

                    return (
                      <div
                        key={assign.id}
                        className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-blue-500/40 transition flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            <FolderKanban className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{proj?.name || 'Project'}</h4>
                            <p className="text-xs text-purple-400 font-medium">{assign.role}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Allocated Since: {assign.start_date}
                            </p>
                          </div>
                        </div>

                        {proj && (
                          <Link
                            href={`/apps/projects/${proj.id}`}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            <span>View Project</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: Allocate to Project */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Allocate {contact?.name} to Project</h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAssign} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {projects.map((p: Project) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Role on Project</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Concept Architect"
                  value={roleName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoleName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
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
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
