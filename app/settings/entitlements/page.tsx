'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { APP_CATALOG } from '@/lib/entitlements';
import { AppSlug } from '@/types/platform';
import {
  Sliders,
  Shield,
  FolderKanban,
  FileText,
  Users,
  Check,
  Lock,
  Sparkles,
  Building2,
  RefreshCw,
  Info,
} from 'lucide-react';

export default function EntitlementsSettingsPage() {
  const {
    organization,
    organizations,
    switchOrg,
    entitlements,
    toggleEntitlement,
    hasEntitlement,
  } = useAppStore();

  const appSlugs: AppSlug[] = ['projects', 'documents', 'hr'];

  const appIcons = {
    projects: <FolderKanban className="w-5 h-5 text-blue-400" />,
    documents: <FileText className="w-5 h-5 text-amber-400" />,
    hr: <Users className="w-5 h-5 text-purple-400" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                App Entitlements Engine
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Admin Controls
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Configure which modular applications are entitled and accessible for your active tenant organization.
            </p>
          </div>

          {/* Org Selector Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select Organization to Configure
              </span>
              <span className="text-[11px] text-slate-400">Current: <strong className="text-white">{organization.name}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => switchOrg(org.id)}
                  className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    org.id === organization.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-white shadow-inner'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">{org.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {org.plan} Plan ({org.id === 'org-studio-one' ? '1 App' : '3 Apps'})
                    </p>
                  </div>
                  {org.id === organization.id && (
                    <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Entitlement Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-white">Module Access Matrix</h2>
              <span className="text-xs text-slate-400">Click switch to grant or revoke instantly</span>
            </div>

            <div className="space-y-3">
              {appSlugs.map((slug) => {
                const app = APP_CATALOG[slug];
                const entitled = hasEntitlement(slug);

                return (
                  <div
                    key={slug}
                    className={`p-5 rounded-3xl border transition flex items-center justify-between gap-4 ${
                      entitled
                        ? 'bg-slate-900/90 border-slate-700/80 shadow-lg'
                        : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
                        {appIcons[slug]}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{app.name}</h3>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              entitled
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {entitled ? 'Entitled' : 'Revoked'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{app.description}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Route: /apps/{slug} • Database Table: <code>{slug}</code>
                        </p>
                      </div>
                    </div>

                    {/* Interactive Toggle Switch */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleEntitlement(slug)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          entitled ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                        role="switch"
                        aria-checked={entitled}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            entitled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hackathon Principle Explainer Alert */}
          <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Info className="w-4 h-4" />
              <span>Architectural Principle #2: App Entitlements Engine</span>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              In AppWeave, each organization has a subscription plan stored in PostgreSQL.
              The JWT token or session profile carries entitlement claims (<code className="bg-blue-900/40 px-1 rounded">projects</code>,{' '}
              <code className="bg-blue-900/40 px-1 rounded">documents</code>, <code className="bg-blue-900/40 px-1 rounded">hr</code>).
              Sidebar navigation, app switchers, and route guards enforce this dynamically without separate codebases.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
