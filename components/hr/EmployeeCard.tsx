'use client';

import React from 'react';
import Link from 'next/link';
import { Employee } from '@/types/hr';
import { Contact } from '@/types/platform';
import { Briefcase, Mail, ArrowRight } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  contact?: Contact;
  activeProjectCount?: number;
}

export function EmployeeCard({ employee, contact, activeProjectCount = 0 }: EmployeeCardProps) {
  return (
    <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-purple-500/40 transition space-y-3">
      <div className="flex items-center gap-3">
        <img
          src={employee.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={contact?.name || 'Staff'}
          className="w-11 h-11 rounded-xl object-cover ring-1 ring-purple-500/30"
        />
        <div className="truncate">
          <h4 className="text-sm font-bold text-white truncate">{contact?.name || 'Architect'}</h4>
          <p className="text-xs text-purple-400 font-medium truncate">{employee.designation}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
        <p className="truncate">Dept: <span className="text-slate-200">{employee.department}</span></p>
        <p className="flex items-center gap-1.5 text-[11px]">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span>{activeProjectCount} Active Projects</span>
        </p>
      </div>

      <div className="pt-1 flex justify-end">
        <Link
          href={`/apps/hr/${employee.id}`}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1"
        >
          <span>View Allocations</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
