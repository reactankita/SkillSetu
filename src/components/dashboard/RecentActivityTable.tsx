'use client';

import React from 'react';
import Link from 'next/link';
import { Check, X, ShieldAlert, CheckCircle2, Star, Clock, AlertTriangle } from 'lucide-react';
import { Booking, BookingStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatINR, formatDate } from '@/lib/utils';
import { useSkillSetuStore } from '@/lib/data/store';

interface RecentActivityTableProps {
  bookings: Booking[];
  role?: 'student' | 'client' | 'admin';
  onReviewClick?: (booking: Booking) => void;
  onDisputeClick?: (booking: Booking) => void;
}

export function RecentActivityTable({
  bookings,
  role = 'student',
  onReviewClick,
  onDisputeClick,
}: RecentActivityTableProps) {
  const store = useSkillSetuStore();

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Clock className="w-3 h-3 text-sky-600" />
            <span>Active</span>
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Upcoming</span>
          </span>
        );
      case 'COMPLETED_BY_STUDENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            <span>Delivered</span>
          </span>
        );
      case 'CONFIRMED_BY_CLIENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <X className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Disputed</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-3 h-3" />
            <span>Resolved</span>
          </span>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStudentComplete = (bookingId: string) => {
    store.updateBookingStatus(bookingId, 'COMPLETED_BY_STUDENT');
  };

  const handleClientConfirm = (bookingId: string) => {
    store.updateBookingStatus(bookingId, 'CONFIRMED_BY_CLIENT', 'RELEASED');
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-xs">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">{role === 'student' ? 'Client' : 'Student Provider'}</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300">
          {bookings.map((booking) => {
            const isCompleted = booking.status === 'CONFIRMED_BY_CLIENT';
            const isDelivered = booking.status === 'COMPLETED_BY_STUDENT';
            const isActive = booking.status === 'ACTIVE' || booking.status === 'CONFIRMED';
            const isDisputed = booking.status === 'DISPUTED';

            return (
              <tr key={booking.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {booking.booking_code}
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">
                  {role === 'student' ? (
                    <div>
                      <div>{booking.client_name}</div>
                      {booking.client_org && (
                        <div className="text-xs text-slate-400 font-normal">{booking.client_org}</div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div>{booking.student_name}</div>
                      <div className="text-xs text-slate-400 font-normal">{booking.student_college}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                  {booking.service_title}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(booking.booking_date)}
                </td>
                <td className="px-4 py-3.5 font-extrabold text-slate-900 dark:text-slate-100">
                  {formatINR(booking.total_amount)}
                </td>
                <td className="px-4 py-3.5">{getStatusBadge(booking.status)}</td>
                <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                  {/* Student Actions */}
                  {role === 'student' && isActive && (
                    <Button
                      size="sm"
                      variant="teal"
                      onClick={() => handleStudentComplete(booking.id)}
                      className="text-xs h-7"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark Delivered
                    </Button>
                  )}

                  {/* Client Actions */}
                  {role === 'client' && isDelivered && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleClientConfirm(booking.id)}
                      className="text-xs h-7 font-bold"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Confirm & Release
                    </Button>
                  )}

                  {role === 'client' && isCompleted && onReviewClick && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReviewClick(booking)}
                      className="text-xs h-7"
                    >
                      <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-400" />
                      Review
                    </Button>
                  )}

                  {(isActive || isDelivered) && onDisputeClick && (
                    <button
                      type="button"
                      onClick={() => onDisputeClick(booking)}
                      className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2 py-1 transition-colors cursor-pointer"
                    >
                      Report Issue
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
