'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/app-context';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  Sliders,
  ShieldAlert,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AppSlug } from '@/types/platform';

interface SidebarAppItem {
  slug: AppSlug;
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  activeBg: string;
  borderActive: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const { organization, hasEntitlement } = useAppStore();

  const apps: SidebarAppItem[] = [
    {
      slug: 'projects',
      name: 'Projects',
      href: '/apps/projects',
      icon: <FolderKanban className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400',
      activeBg: 'bg-blue-600/10 text-blue-400 font-semibold',
      borderActive: 'border-l-2 border-blue-500',
    },
    {
      slug: 'documents',
      name: 'Documents',
      href: '/apps/documents',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-400',
      activeBg: 'bg-amber-600/10 text-amber-400 font-semibold',
      borderActive: 'border-l-2 border-amber-500',
    },
    {
      slug: 'hr',
      name: 'HR & Teams',
      href: '/apps/hr',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-400',
      activeBg: 'bg-purple-600/10 text-purple-400 font-semibold',
      borderActive: 'border-l-2 border-purple-500',
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between p-4 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex">
      <div className="space-y-6">
        {/* Main Dashboard Link */}
        <div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              pathname === '/dashboard'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-indigo-400" />
            <span>Unified Dashboard</span>
          </Link>
        </div>

        {/* Modular Apps Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Modular Apps
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {apps.filter((a: SidebarAppItem) => hasEntitlement(a.slug)).length}/3 Active
            </span>
          </div>

          <div className="space-y-1">
            {apps.map((app: SidebarAppItem) => {
              const isEntitled = hasEntitlement(app.slug);
              const isActive = pathname.startsWith(app.href);
              const targetUrl = isEntitled ? app.href : `/upgrade?app=${app.slug}`;

              return (
                <Link
                  key={app.slug}
                  href={targetUrl}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition group ${
                    isActive && isEntitled
                      ? `${app.activeBg} ${app.borderActive}`
                      : isEntitled
                      ? 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                      : 'text-slate-500 hover:text-slate-400 hover:bg-slate-900/40 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-lg bg-slate-900 border border-slate-800/80 group-hover:border-slate-700 transition">
                      {app.icon}
                    </div>
                    <span>{app.name}</span>
                  </div>

                  {!isEntitled && (
                    <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Platform Shared Core Section */}
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Platform Core
            </span>
          </div>

          <div className="space-y-1">
            <Link
              href="/settings/entitlements"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                pathname === '/settings/entitlements'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Entitlements Engine</span>
            </Link>

            <Link
              href="/settings/automations"
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                pathname === '/settings/automations'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Cross-App Flow</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                AS-06
              </span>
            </Link>

            <Link
              href="/settings/audit"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                pathname === '/settings/audit'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>Audit Trail</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Plan Status Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400">Current Plan</span>
          <span
            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
              organization.plan === 'enterprise'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}
          >
            {organization.plan}
          </span>
        </div>

        <p className="text-xs text-slate-300 font-medium leading-tight">
          {organization.name}
        </p>

        {organization.plan === 'basic' ? (
          <Link
            href="/upgrade"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/10 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade to Full Plan</span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            All 3 modules unlocked
          </div>
        )}
      </div>
    </aside>
  );
}
