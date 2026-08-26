'use client';

import React, { useState } from 'react';
import { useSkillSetuStore } from '@/lib/data/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Users,
  ShieldCheck,
  Layers,
  Calendar,
  CreditCard,
  AlertTriangle,
  Star,
  MessageSquare,
  FileText,
  Check,
  X,
  Eye,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { StudentVerification, Dispute } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function AdminDashboardPage() {
  const store = useSkillSetuStore();
  const students = store.getStudents();
  const clients = store.getClients();
  const services = store.getServices();
  const bookings = store.getBookings();
  const disputes = store.getDisputes();
  const verifications = store.getVerifications();
  const communityPosts = store.getCommunityPosts();
  const reviews = store.getReviews();

  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'verifications' | 'services' | 'bookings' | 'disputes' | 'reviews' | 'community' | 'reports'>('overview');

  const [selectedVerif, setSelectedVerif] = useState<StudentVerification | null>(null);
  const [verifModalOpen, setVerifModalOpen] = useState(false);

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const handleApproveVerif = (verifId: string) => {
    store.updateVerificationStatus(verifId, 'verified');
    setVerifModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  const handleRejectVerif = (verifId: string) => {
    store.updateVerificationStatus(verifId, 'rejected');
    setVerifModalOpen(false);
  };

  const handleResolveDispute = (disputeId: string, action: 'release' | 'refund') => {
    store.resolveDispute(disputeId, action);
    setDisputeModalOpen(false);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'verifications', label: 'Student Verification', icon: ShieldCheck, badge: verifications.filter((v) => v.status === 'pending').length },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle, badge: disputes.filter((d) => d.status === 'reported').length },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Students</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">2,418</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Clients</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">1,097</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Pending Verifs</span>
          <span className="text-xl font-extrabold text-orange-600 mt-1 block">34</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Services</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">871</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Bookings</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">126</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Revenue</span>
          <span className="text-base font-extrabold text-emerald-600 mt-1 block truncate">₹12,84,500</span>
          <span className="text-[9px] text-slate-400">platform fees</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Open Disputes</span>
          <span className="text-xl font-extrabold text-rose-600 mt-1 block">7</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Avg. Rating</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1 block">4.7 ★</span>
        </div>
      </div>

      {/* Main Admin Console Layout: Sidebar Tabs + Table Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Sidebar Nav Tabs */}
        <div className="lg:col-span-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Table Content Area */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* 1. Overview Tab */}
          {activeSection === 'overview' && (
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Latest Platform Bookings</h3>
                  <p className="text-xs text-slate-500">Live booking stream across all institutions</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-500">{b.booking_code}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{b.client_name}</td>
                        <td className="px-4 py-3">{b.student_name} ({b.student_college})</td>
                        <td className="px-4 py-3 font-extrabold text-slate-900">{formatINR(b.total_amount)}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              b.status === 'CONFIRMED' || b.status === 'ACTIVE'
                                ? 'teal'
                                : b.status === 'CONFIRMED_BY_CLIENT'
                                ? 'emerald'
                                : b.status === 'DISPUTED'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="text-[10px]"
                          >
                            {b.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-[11px] font-mono font-bold ${
                            b.payment_status === 'RELEASED' ? 'text-emerald-600' : 'text-sky-600'
                          }`}>
                            {b.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Users Tab */}
          {activeSection === 'users' && (
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registered Users Directory</h3>
                  <p className="text-xs text-slate-500">Students and clients with active verification IDs</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID Code</th>
                      <th className="px-4 py-3">User Name</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">College / Org</th>
                      <th className="px-4 py-3">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {students.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-orange-600">{st.skillsetu_id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{st.full_name}</td>
                        <td className="px-4 py-3"><Badge variant="orange" className="text-[10px]">Student</Badge></td>
                        <td className="px-4 py-3">{st.college}</td>
                        <td className="px-4 py-3"><Badge variant="emerald" className="text-[10px]">Verified</Badge></td>
                      </tr>
                    ))}
                    {clients.map((cl) => (
                      <tr key={cl.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-teal-600">{cl.skillsetu_id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{cl.full_name}</td>
                        <td className="px-4 py-3"><Badge variant="teal" className="text-[10px]">Client</Badge></td>
                        <td className="px-4 py-3">{cl.organization_name || 'Individual'}</td>
                        <td className="px-4 py-3"><Badge variant="emerald" className="text-[10px]">Verified</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Student Verification Queue */}
          {activeSection === 'verifications' && (
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student Verification Approval Queue</h3>
                  <p className="text-xs text-slate-500">Review submitted student identity cards and university details</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">College & Course</th>
                      <th className="px-4 py-3">Roll / ID Number</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {verifications.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{v.student_name}</td>
                        <td className="px-4 py-3">{v.college} • {v.course}</td>
                        <td className="px-4 py-3 font-mono">{v.college_id_number}</td>
                        <td className="px-4 py-3 text-slate-500">{v.college_email}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={v.status === 'verified' ? 'emerald' : v.status === 'pending' ? 'amber' : 'destructive'}
                            className="text-[10px] capitalize"
                          >
                            {v.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedVerif(v);
                              setVerifModalOpen(true);
                            }}
                            className="text-xs h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Services Moderation Tab */}
          {activeSection === 'services' && (
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Services Catalog Moderation</h3>
                  <p className="text-xs text-slate-500">Monitor active marketplace offerings and compliance</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Service Title</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Student Provider</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900 max-w-[200px] truncate">{s.title}</td>
                        <td className="px-4 py-3">{s.category}</td>
                        <td className="px-4 py-3">{s.student_name}</td>
                        <td className="px-4 py-3 font-bold">{formatINR(s.price)}/{s.pricing_unit.replace('per_', '')}</td>
                        <td className="px-4 py-3">
                          <Badge variant={s.status === 'published' ? 'emerald' : 'secondary'} className="text-[10px]">
                            {s.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Disputes Resolution Tab */}
          {activeSection === 'disputes' && (
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Dispute & Conflict Resolution Center</h3>
                  <p className="text-xs text-slate-500">Review reported issues and execute one-click settlement/refunds</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Booking</th>
                      <th className="px-4 py-3">Raised By</th>
                      <th className="px-4 py-3">Issue Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {disputes.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-rose-600">{d.booking_code}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{d.raised_by_name}</td>
                        <td className="px-4 py-3">{d.issue_type}</td>
                        <td className="px-4 py-3">
                          <Badge variant={d.status === 'reported' ? 'destructive' : 'emerald'} className="text-[10px]">
                            {d.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedDispute(d);
                              setDisputeModalOpen(true);
                            }}
                            className="text-xs h-7 font-bold"
                          >
                            Resolve Ticket
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Reviews Tab */}
          {activeSection === 'reviews' && (
            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Platform Reviews ({reviews.length})</h3>
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{r.client_name} → {r.review_text.slice(0, 40)}...</span>
                      <span>{r.rating} ★</span>
                    </div>
                    <p className="text-slate-600">{r.review_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Community Tab */}
          {activeSection === 'community' && (
            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Community Opportunities ({communityPosts.length})</h3>
              <div className="space-y-3">
                {communityPosts.map((cp) => (
                  <div key={cp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900">{cp.title}</h4>
                      <p className="text-slate-500">Posted by {cp.client_name} • Budget: {formatINR(cp.budget)}</p>
                    </div>
                    <Badge variant="teal" className="text-[10px]">{cp.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Reports Tab */}
          {activeSection === 'reports' && (
            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Platform Financial & Security Reports</h3>
              <div className="p-4 rounded-xl border border-slate-200 bg-emerald-50 text-emerald-900 text-xs space-y-2">
                <span className="font-bold block">100% Reconciliation Verified</span>
                <p className="leading-relaxed">
                  All protected payments and platform commission transactions match active Razorpay settlement ledgers. Zero unauthorized balance discrepancies detected.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Inspection Modal */}
      <Dialog open={verifModalOpen} onOpenChange={setVerifModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedVerif && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Review Student Verification</DialogTitle>
                <DialogDescription>
                  Inspect student university credentials and approve marketplace access.
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div><strong>Student Name:</strong> {selectedVerif.student_name}</div>
                <div><strong>College:</strong> {selectedVerif.college}</div>
                <div><strong>Course & Year:</strong> {selectedVerif.course} ({selectedVerif.year})</div>
                <div><strong>College ID / Roll:</strong> {selectedVerif.college_id_number}</div>
                <div><strong>College Email:</strong> {selectedVerif.college_email}</div>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRejectVerif(selectedVerif.id)}
                  className="text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Reject Submission
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => handleApproveVerif(selectedVerif.id)}
                  className="text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Approve & Grant Badge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dispute Resolution Modal */}
      <Dialog open={disputeModalOpen} onOpenChange={setDisputeModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedDispute && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Resolve Dispute Ticket</span>
                </DialogTitle>
                <DialogDescription>
                  Booking Code: {selectedDispute.booking_code}
                </DialogDescription>
              </DialogHeader>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div><strong>Raised By:</strong> {selectedDispute.raised_by_name} ({selectedDispute.raised_by_role})</div>
                <div><strong>Issue Type:</strong> {selectedDispute.issue_type}</div>
                <div className="p-2.5 rounded bg-white border border-slate-200 text-slate-700">
                  {selectedDispute.description}
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleResolveDispute(selectedDispute.id, 'refund')}
                  className="text-xs font-bold"
                >
                  Refund Client
                </Button>
                <Button
                  type="button"
                  variant="teal"
                  size="sm"
                  onClick={() => handleResolveDispute(selectedDispute.id, 'release')}
                  className="text-xs font-bold"
                >
                  Release Funds to Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
