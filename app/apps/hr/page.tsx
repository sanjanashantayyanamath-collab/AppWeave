'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Employee, Assignment } from '@/types/hr';
import { Contact } from '@/types/platform';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export default function HRPage() {
  const {
    organization,
    employees,
    contacts,
    assignments,
    addEmployee,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('Architecture & Concept');
  const [skills, setSkills] = useState('Parametric Modeling, LEED AP');

  const orgEmployees = employees.filter((e: Employee) => e.org_id === organization.id);

  const departments = Array.from(
    new Set(orgEmployees.map((e: Employee) => e.department))
  );

  const filteredEmployees = orgEmployees.filter((emp: Employee) => {
    const contact = contacts.find((c: Contact) => c.id === emp.contact_id);
    const matchesSearch =
      Boolean(contact?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    await addEmployee({
      name,
      email,
      designation,
      department,
      skills: skills.split(',').map((s: string) => s.trim()),
    });

    setName('');
    setEmail('');
    setDesignation('');
    setIsModalOpen(false);
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
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">HR & Teams Module</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Royal Purple
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Staffing directory, skill matrices, and capacity allocation directly linked into Projects team tab.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Staff Member</span>
            </button>
          </div>

          {/* KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Practicing Architects & Engineers</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-400">{orgEmployees.length}</span>
                <span className="text-xs text-slate-500">In-house staff</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Active Project Assignments</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{assignments.length}</span>
                <span className="text-xs text-blue-400 font-medium">Cross-allocated</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Shared Contacts Integration</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400">100%</span>
                <span className="text-xs text-emerald-500">Zero duplicate data</span>
              </div>
            </div>
          </div>

          {/* Search & Department Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff, designation, skills..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 flex-shrink-0" />
              <button
                onClick={() => setSelectedDept('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  selectedDept === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                All Departments
              </button>
              {departments.map((dept: string) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    selectedDept === dept
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Staff Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs space-y-3">
                <Users className="w-10 h-10 mx-auto text-slate-600" />
                <p>No team members match your criteria.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Onboard Team Member
                </button>
              </div>
            ) : (
              filteredEmployees.map((emp: Employee) => {
                const contact = contacts.find((c: Contact) => c.id === emp.contact_id);
                const empAssignments = assignments.filter((a: Assignment) => a.employee_id === emp.id);

                return (
                  <Link
                    key={emp.id}
                    href={`/apps/hr/${emp.id}`}
                    className="group bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/60 rounded-3xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-0.5"
                  >
                    <div className="space-y-4">
                      {/* Avatar & Title */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={emp.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={contact?.name || 'Staff'}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20 group-hover:scale-105 transition"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                            {contact?.name || 'Architect'}
                          </h3>
                          <p className="text-xs text-purple-300/90 font-medium">{emp.designation}</p>
                          <p className="text-[11px] text-slate-400">{emp.department}</p>
                        </div>
                      </div>

                      {/* Contact Info (Shared Core) */}
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 text-xs text-slate-300">
                        <p className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{contact?.email}</span>
                        </p>
                        <p className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{contact?.phone || '+1 (555) 444-9876'}</span>
                        </p>
                      </div>

                      {/* Skills Tags */}
                      {emp.skills && emp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {emp.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer: Active Allocations count */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-slate-400 text-[11px]">
                          {empAssignments.length} Active Projects
                        </span>
                      </div>
                      <span className="text-purple-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition text-xs">
                        Profile <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Modal: Onboard Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Onboard Staff Member</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Thorne"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="julian@designhouse.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Parametric Architect"
                  value={designation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Department</label>
                <select
                  value={department}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="Architecture & Concept">Architecture & Concept</option>
                  <option value="Interior & Materials">Interior & Materials</option>
                  <option value="Engineering & 3D">Engineering & 3D</option>
                  <option value="Project Management">Project Management</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-purple-400" />
                This simultaneously creates a record in the platform <code>contacts</code> table (Zero Data Duplication).
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Onboard to HR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
