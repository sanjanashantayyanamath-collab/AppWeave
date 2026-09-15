'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store/app-context';
import { Organization, UserProfile } from '@/types/platform';
import { AppSwitcher } from './AppSwitcher';
import { NotificationBell } from './NotificationBell';
import {
  Building2,
  Shield,
  Layers,
  ChevronDown,
  UserCheck,
  Zap,
  ExternalLink,
} from 'lucide-react';

export function Navbar() {
  const {
    user,
    organization,
    organizations,
    users,
    switchUser,
    switchOrg,
  } = useAppStore();

  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & App Switcher */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AppWeave
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AS-06
                </span>
              </div>
            </div>
          </Link>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Notion/Linear Style App Switcher */}
          <AppSwitcher />
        </div>

        {/* Center: Live Demo Persona / Org Switcher Quick Bar */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-1 shadow-inner text-xs">
          <span className="text-slate-400 px-2 font-medium flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Org:
          </span>
          <button
            onClick={() => switchOrg('org-studio-one')}
            className={`px-2.5 py-1 rounded-xl transition font-medium flex items-center gap-1.5 ${
              organization.id === 'org-studio-one'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3 h-3" />
            Studio One (1 App)
          </button>
          <button
            onClick={() => switchOrg('org-design-house')}
            className={`px-2.5 py-1 rounded-xl transition font-medium flex items-center gap-1.5 ${
              organization.id === 'org-design-house'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3 h-3" />
            DesignHouse (3 Apps)
          </button>
        </div>

        {/* Right: Notifications, Org Badge, and User Identity */}
        <div className="flex items-center gap-3">
          <NotificationBell />

          {/* Active Org Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="max-w-[110px] truncate">{organization.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                {organization.plan}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isOrgMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Organization
                  </p>
                </div>
                {organizations.map((org: Organization) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      switchOrg(org.id);
                      setIsOrgMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                      org.id === organization.id
                        ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <p>{org.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{org.plan} Plan</p>
                    </div>
                    {org.id === organization.id && (
                      <span className="text-[10px] text-indigo-400 font-bold">Active</span>
                    )}
                  </button>
                ))}
                <div className="mt-2 pt-2 border-t border-slate-800 px-2">
                  <Link
                    href="/settings/entitlements"
                    onClick={() => setIsOrgMenuOpen(false)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center justify-between"
                  >
                    <span>Manage Entitlements</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / One Identity */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              aria-label="User menu"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-100 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 leading-none mt-1">{user.role}</p>
              </div>
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      One Identity Core
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  One-Click Persona Switch (Judge Demo)
                </div>

                {users.map((u: UserProfile) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.email);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                      u.email === user.email
                        ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <img
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.name}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                    <div className="truncate">
                      <p className="font-medium text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </button>
                ))}

                <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 flex justify-between items-center text-xs">
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="text-slate-400 hover:text-white transition py-1 flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Auth Page</span>
                  </Link>
                  <Link
                    href="/settings/audit"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium py-1 flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Audit Trail</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
