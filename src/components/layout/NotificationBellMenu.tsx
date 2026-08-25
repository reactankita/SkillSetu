'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Clock, ShieldCheck, CreditCard, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useSkillSetuStore } from '@/lib/data/store';
import { NotificationItem } from '@/types';

export function NotificationBellMenu() {
  const store = useSkillSetuStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const notifications = mounted ? store.getNotifications() : [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-sky-600" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Notification Menu Card */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in-80 zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => store.markAllNotificationsAsRead()}
                  className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto space-y-2 divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  You have no notifications.
                </div>
              ) : (
                notifications.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className={`pt-2 first:pt-0 p-2.5 rounded-xl transition-colors ${
                      item.is_read ? 'bg-white hover:bg-slate-50' : 'bg-orange-50/50 hover:bg-orange-50 border border-orange-100/60'
                    }`}
                  >
                    <Link
                      href={item.link_url}
                      onClick={() => {
                        store.markNotificationAsRead(item.id);
                        setOpen(false);
                      }}
                      className="block group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-100 shadow-2xs shrink-0">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                              {item.title}
                            </h5>
                            {!item.is_read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3 text-center">
              <Link
                href="/bookings"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-orange-600 transition-colors"
              >
                <span>View all activity</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
