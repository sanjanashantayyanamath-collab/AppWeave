'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/app-context';
import { APP_CATALOG } from '@/lib/entitlements';
import { AppSlug } from '@/types/platform';
import { FolderKanban, FileText, Users, Lock, ChevronDown, Check, Sparkles } from 'lucide-react';

export function AppSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { hasEntitlement, organization } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine current active app based on pathname
  const currentAppSlug: AppSlug | 'dashboard' = pathname.includes('/apps/projects')
    ? 'projects'
    : pathname.includes('/apps/documents')
    ? 'documents'
    : pathname.includes('/apps/hr')
    ? 'hr'
    : 'dashboard';

  const icons: Record<AppSlug, React.ReactNode> = {
    projects: <FolderKanban className="w-4 h-4 text-blue-400" />,
    documents: <FileText className="w-4 h-4 text-amber-400" />,
    hr: <Users className="w-4 h-4 text-purple-400" />,
  };

  const activeAppMeta = currentAppSlug !== 'dashboard' ? APP_CATALOG[currentAppSlug] : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200 text-sm font-medium transition shadow-sm"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {activeAppMeta ? (
            <>
              <span className="p-1 rounded-md bg-slate-800 border border-slate-700">
                {icons[activeAppMeta.slug]}
              </span>
              <span className="font-semibold">{activeAppMeta.name}</span>
            </>
          ) : (
            <>
              <span className="p-1 rounded-md bg-slate-800 border border-slate-700 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="font-semibold">AppWeave Core</span>
            </>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              {organization.name} Ecosystem
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Switch modular applications</p>
          </div>

          <div className="space-y-1">
            {(['projects', 'documents', 'hr'] as AppSlug[]).map((slug: AppSlug) => {
              const app = APP_CATALOG[slug];
              const entitled = hasEntitlement(slug);
              const isActive = currentAppSlug === slug;
              const targetUrl = entitled ? `/apps/${slug}` : `/upgrade?app=${slug}`;

              return (
                <Link
                  key={slug}
                  href={targetUrl}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition group ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-medium border border-slate-700'
                      : entitled
                      ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                      : 'opacity-60 hover:opacity-100 hover:bg-slate-800/30 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:scale-105 transition">
                      {icons[slug]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{app.name}</span>
                        {!entitled && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Locked
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{app.tagline}</p>
                    </div>
                  </div>

                  {isActive && <Check className="w-4 h-4 text-blue-400" />}
                </Link>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 flex justify-between items-center text-xs">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition py-1"
            >
              Unified Dashboard
            </Link>
            <Link
              href="/settings/entitlements"
              onClick={() => setIsOpen(false)}
              className="text-blue-400 hover:text-blue-300 font-medium py-1"
            >
              Manage Apps →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
