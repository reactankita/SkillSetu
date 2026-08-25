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
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            <span>Active</span>
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Upcoming</span>
          </span>
        );
      case 'COMPLETED_BY_STUDENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            <span>Delivered</span>
          </span>
        );
      case 'CONFIRMED_BY_CLIENT':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <X className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Disputed</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
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
        <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
          {bookings.map((booking) => {
            const isCompleted = booking.status === 'CONFIRMED_BY_CLIENT';
            const isDelivered = booking.status === 'COMPLETED_BY_STUDENT';
            const isActive = booking.status === 'ACTIVE' || booking.status === 'CONFIRMED';
            const isDisputed = booking.status === 'DISPUTED';

            return (
              <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5 font-mono text-xs text-slate-500 font-bold">
                  {booking.booking_code}
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-900">
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
                <td className="px-4 py-3.5 text-xs text-slate-600 max-w-[200px] truncate">
                  {booking.service_title}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {formatDate(booking.booking_date)}
                </td>
                <td className="px-4 py-3.5 font-extrabold text-slate-900">
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
                      className="text-xs text-slate-400 hover:text-rose-600 font-medium px-2 py-1 transition-colors cursor-pointer"
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
