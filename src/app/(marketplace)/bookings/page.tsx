'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { Booking, BookingStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { ReviewModal } from '@/components/marketplace/ReviewModal';
import { DisputeModal } from '@/components/marketplace/DisputeModal';
import { Calendar, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function BookingsPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const allBookings = store.getBookings();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState<Booking | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const roleBookings = allBookings.filter((b) =>
    role === 'student' ? b.student_id === student.id : b.client_id === client.id
  );

  const filterBookings = (statusFilter: string) => {
    if (statusFilter === 'all') return roleBookings;
    if (statusFilter === 'active') return roleBookings.filter((b) => b.status === 'ACTIVE' || b.status === 'CONFIRMED');
    if (statusFilter === 'completed') return roleBookings.filter((b) => b.status === 'CONFIRMED_BY_CLIENT' || b.status === 'COMPLETED_BY_STUDENT');
    if (statusFilter === 'disputed') return roleBookings.filter((b) => b.status === 'DISPUTED' || b.status === 'RESOLVED');
    if (statusFilter === 'cancelled') return roleBookings.filter((b) => b.status === 'CANCELLED');
    return roleBookings;
  };

  const handleReviewClick = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewModalOpen(true);
  };

  const handleDisputeClick = (booking: Booking) => {
    setSelectedBookingForDispute(booking);
    setDisputeModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {role === 'student' ? 'Client Bookings & Orders' : 'My Hired Bookings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {role === 'student'
              ? 'Manage incoming project schedules, mark work delivered, and track protected payouts.'
              : 'Track active student deliveries, confirm completed jobs to release protected payments, and leave reviews.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'student' ? (
            <Link href="/create">
              <Button variant="default" size="sm" className="font-bold text-xs">
                Create Listing
              </Button>
            </Link>
          ) : (
            <Link href="/browse">
              <Button variant="default" size="sm" className="font-bold text-xs">
                Find More Talent
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({roleBookings.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active / Scheduled ({filterBookings('active').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterBookings('completed').length})
          </TabsTrigger>
          <TabsTrigger value="disputed">
            Disputed ({filterBookings('disputed').length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({filterBookings('cancelled').length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <RecentActivityTable
            bookings={filterBookings(activeTab)}
            role={role}
            onReviewClick={handleReviewClick}
            onDisputeClick={handleDisputeClick}
          />
        </div>
      </Tabs>

      {/* Review Modal */}
      <ReviewModal
        booking={selectedBookingForReview}
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
      />

      {/* Dispute Modal */}
      <DisputeModal
        booking={selectedBookingForDispute}
        open={disputeModalOpen}
        onOpenChange={setDisputeModalOpen}
      />
    </div>
  );
}
