'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store/app-context';
import { Notification } from '@/types/platform';
import { Bell, CheckCheck, Trash2, Clock, Sparkles } from 'lucide-react';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
  } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 hover:text-white transition"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-slate-950 animate-pulse">
            {unreadNotificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                  {unreadNotificationCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 flex items-center gap-1 transition"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto my-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                No new notifications. Everything is in sync!
              </div>
            ) : (
              notifications.map((notif: Notification) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-2.5 transition cursor-pointer hover:bg-slate-800/40 rounded-xl my-0.5 ${
                    !notif.read ? 'bg-blue-500/5 border-l-2 border-blue-500 pl-3' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs leading-relaxed ${!notif.read ? 'font-medium text-slate-100' : 'text-slate-400'}`}>
                      {notif.message}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(notif.created_at).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500">Real-time cross-app event bus active</span>
          </div>
        </div>
      )}
    </div>
  );
}
