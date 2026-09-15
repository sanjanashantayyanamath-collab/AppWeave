'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { APP_CATALOG } from '@/lib/entitlements';
import { AppSlug } from '@/types/platform';
import {
  Lock,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
} from 'lucide-react';

function UpgradeContent() {
  const searchParams = useSearchParams();
  const targetAppSlug = (searchParams.get('app') as AppSlug) || 'documents';
  const targetApp = APP_CATALOG[targetAppSlug] || APP_CATALOG.documents;

  const { organization, toggleEntitlement, hasEntitlement } = useAppStore();

  const isAlreadyEntitled = hasEntitlement(targetAppSlug);

  const handleUnlockNow = () => {
    if (!isAlreadyEntitled) {
      toggleEntitlement(targetAppSlug);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full flex flex-col justify-center items-center py-12 space-y-8">
          {/* Header Banner */}
          <div className="text-center space-y-3 max-w-xl">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-1">
              <Lock className="w-8 h-8" />
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Unlock the {targetApp.name} Module
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed">
              Your organization <strong className="text-white">{organization.name}</strong> is currently on the{' '}
              <span className="uppercase font-bold text-blue-400">{organization.plan} Plan</span>, which grants access to{' '}
              <strong className="text-blue-400">Projects</strong> only.
            </p>
          </div>

          {/* Pricing / Plan Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Current Basic Plan */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">Basic</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Essential Practice</h3>
                  <p className="text-xs text-slate-400 mt-1">Single-app project delivery</p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-blue-400 font-medium">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Projects &amp; Milestone Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-4 h-4 text-center font-bold">✕</span>
                    <span>Documents &amp; CAD Vault (Locked)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="w-4 h-4 text-center font-bold">✕</span>
                    <span>HR &amp; Team Allocation (Locked)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="w-full py-2.5 rounded-xl bg-slate-800/80 text-slate-400 text-xs text-center font-medium">
                  Currently Active
                </div>
              </div>
            </div>

            {/* Enterprise Multi-App Plan */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 space-y-5 flex flex-col justify-between">
              <div className="absolute -top-3 right-6">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md">
                  Recommended Ecosystem
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Unified Stack</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">Enterprise</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Full Modular Suite</h3>
                  <p className="text-xs text-slate-400 mt-1">Cross-App Realtime Data Bus enabled</p>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Projects &amp; Client Management</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Documents &amp; Supabase CAD/BIM Vault</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>HR Staff Directory &amp; Cross-Allocations</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Realtime Cross-App Event Synchronization</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                {isAlreadyEntitled ? (
                  <Link
                    href={`/apps/${targetAppSlug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition"
                  >
                    <span>Module Unlocked — Enter Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    onClick={handleUnlockNow}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-xl shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Instant Demo Upgrade: Unlock {targetApp.name}</span>
                  </button>
                )}

                <p className="text-[10px] text-center text-slate-500">
                  Demo mode: instantly activates subscription entitlements via App Entitlements Engine.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/settings/entitlements"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
            >
              <span>Or manage app toggles directly in Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <UpgradeContent />
    </Suspense>
  );
}
