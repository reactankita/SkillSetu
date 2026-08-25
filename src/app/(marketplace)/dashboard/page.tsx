'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  CheckCircle2,
  Star,
  Layers,
  Eye,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  CreditCard,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { useSkillSetuStore } from '@/lib/data/store';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EarningsChart } from '@/components/dashboard/EarningsChart';
import { RecentActivityTable } from '@/components/dashboard/RecentActivityTable';
import { StudentCard } from '@/components/marketplace/StudentCard';
import { ReviewModal } from '@/components/marketplace/ReviewModal';
import { DisputeModal } from '@/components/marketplace/DisputeModal';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import { formatINR } from '@/lib/utils';

export default function DashboardPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const allBookings = store.getBookings();
  const allServices = store.getServices();
  const allStudents = store.getStudents();

  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const [selectedBookingForDispute, setSelectedBookingForDispute] = useState<Booking | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const handleReviewClick = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewModalOpen(true);
  };

  const handleDisputeClick = (booking: Booking) => {
    setSelectedBookingForDispute(booking);
    setDisputeModalOpen(true);
  };

  // Student specific bookings & listings
  const studentBookings = allBookings.filter((b) => b.student_id === student.id);
  const studentServices = allServices.filter((s) => s.student_id === student.id && s.status === 'published');

  // Client specific bookings
  const clientBookings = allBookings.filter((b) => b.client_id === client.id);

  // Dynamic calculations
  const studentTotalEarnings = studentBookings
    .filter((b) => b.status === 'CONFIRMED_BY_CLIENT' || b.payment_status === 'RELEASED')
    .reduce((acc, b) => acc + b.service_price, 45680); // Base historical + live

  const clientTotalSpent = clientBookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((acc, b) => acc + b.total_amount, client.total_spent);

  const clientProtectedPayments = clientBookings
    .filter((b) => b.payment_status === 'PROTECTED')
    .reduce((acc, b) => acc + b.total_amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Student View */}
      {role === 'student' ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {student.full_name.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Here is how your skills and client bookings are performing this month.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/create">
                <Button variant="default" className="font-bold text-xs shadow-xs">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Create Service
                </Button>
              </Link>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Earnings"
              value={formatINR(studentTotalEarnings)}
              trend={{ value: '+18% vs last month', isPositive: true }}
              icon={DollarSign}
            />
            <MetricCard
              title="Completed Bookings"
              value={student.completed_bookings_count}
              subtitle="4 this week"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Average Rating"
              value={`${student.rating} ★`}
              subtitle={`from ${student.review_count} reviews`}
              icon={Star}
              iconColor="text-amber-500"
            />
            <MetricCard
              title="Active Listings"
              value={studentServices.length || 5}
              subtitle="1 draft pending"
              icon={Layers}
              iconColor="text-teal-600"
            />
          </div>

          {/* Charts & Growth Tips Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EarningsChart />
            </div>

            <div className="space-y-6">
              {/* Growth Tips Card */}
              <Card className="p-5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <Lightbulb className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-bold text-slate-900">Growth Tips</h3>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-100/80 leading-relaxed">
                    <strong className="text-orange-900 block font-semibold mb-0.5">Add 2 More Portfolio Samples</strong>
                    Profiles with 4+ portfolio images receive 3.2x more client booking requests.
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-100/80 leading-relaxed">
                    <strong className="text-teal-900 block font-semibold mb-0.5">Enable Team Mode</strong>
                    Unlock larger fest and event budgets by offering collaborative team services.
                  </div>
                </div>
              </Card>

              {/* Earned Badges */}
              <Card className="p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Earned Badges</h3>
                <div className="flex flex-wrap gap-1.5">
                  {student.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity Table */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <CardTitle className="text-base">Recent Booking Activity</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Your incoming and active client orders</p>
              </div>
              <Link
                href="/bookings"
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                All Bookings →
              </Link>
            </CardHeader>
            <RecentActivityTable
              bookings={studentBookings.length > 0 ? studentBookings : allBookings.slice(0, 6)}
              role="student"
              onDisputeClick={handleDisputeClick}
            />
          </Card>
        </>
      ) : (
        /* Client View */
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Client Workspace — {client.organization_name || client.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Track your hired student talent, protected payments, and project deliverables.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/community">
                <Button variant="default" className="font-bold text-xs shadow-xs">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Post Requirement
                </Button>
              </Link>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Protected Payments"
              value={formatINR(clientProtectedPayments || 4148)}
              subtitle="Safely secured until completion"
              icon={CreditCard}
              iconColor="text-sky-600"
            />
            <MetricCard
              title="Students Hired"
              value={client.hired_count || 14}
              subtitle="Verified college talent"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
            />
            <MetricCard
              title="Total Spent"
              value={formatINR(clientTotalSpent)}
              subtitle="Across all bookings"
              icon={DollarSign}
            />
            <MetricCard
              title="Rating Given Avg"
              value={`${client.rating_given_avg} ★`}
              subtitle="Fair client score"
              icon={Star}
              iconColor="text-amber-500"
            />
          </div>

          {/* Active Bookings Action Table */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <CardTitle className="text-base">Active & Recent Hires</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Confirm completed work to release protected funds</p>
              </div>
              <Link href="/bookings" className="text-xs font-bold text-orange-600 hover:underline">
                View All Bookings →
              </Link>
            </CardHeader>
            <RecentActivityTable
              bookings={clientBookings.length > 0 ? clientBookings : allBookings.slice(0, 6)}
              role="client"
              onReviewClick={handleReviewClick}
              onDisputeClick={handleDisputeClick}
            />
          </Card>

          {/* Recommended Students For You */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recommended Student Talent</h3>
                <p className="text-xs text-slate-500">Top performers matching your previous hiring categories</p>
              </div>
              <Link href="/browse" className="text-xs font-bold text-orange-600 hover:underline">
                Browse All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {allStudents.slice(0, 3).map((st) => (
                <StudentCard key={st.id} student={st} />
              ))}
            </div>
          </div>
        </>
      )}

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
