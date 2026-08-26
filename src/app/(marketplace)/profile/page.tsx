'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { SkillSetuIdCard } from '@/components/brand/SkillSetuIdCard';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  User,
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProfilePage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const portfolio = store.getPortfolioByStudentId(student.id);

  const isStudent = role === 'student';
  const currentUser = isStudent ? student : client;

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98201 44102');
  const [location, setLocation] = useState(currentUser.location);
  const [about, setAbout] = useState(currentUser.about);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Account Profile & ID
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, credentials, and digital SkillSetu verification badge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* STUDENT PORTFOLIO CALLOUT CARD */}
          {isStudent && (
            <div className="p-5 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Student Portfolio Builder</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {portfolio?.status === 'published'
                      ? `Portfolio Published (${portfolio.projects.length} featured projects)`
                      : 'Showcase your projects and deliverables to get hired faster.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/portfolio">
                  <Button variant="default" size="sm" className="font-bold text-xs shadow-xs">
                    {portfolio ? 'Manage Portfolio →' : 'Create Portfolio'}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
              <VerificationBadge status={currentUser.verification_status} size="sm" />
            </div>

            {saved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile changes updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Name</label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Address</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Contact Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">City / Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {isStudent && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">College / Institution</label>
                  <Input value={student.college} readOnly className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Course & Year</label>
                  <Input value={`${student.course} (${student.year})`} readOnly className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300" />
                </div>
              </div>
            )}

            {!isStudent && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Organization / Startup Name</label>
                <Input defaultValue={client.organization_name || 'Individual Client'} />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">About Bio</label>
              <Textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="default" className="font-bold text-xs px-6 h-10 shadow-xs">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Digital ID Card */}
        <div className="lg:col-span-1 space-y-4 sticky top-20">
          <SkillSetuIdCard user={currentUser} type={isStudent ? 'student' : 'client'} />

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Verified Marketplace Pass</span>
            <p className="leading-relaxed text-[11px]">
              This digital pass verifies your status in the SkillSetu network. Use your unique ID code ({currentUser.skillsetu_id}) when contacting support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
