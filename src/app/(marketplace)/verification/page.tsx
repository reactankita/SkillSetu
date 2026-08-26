'use client';

import React, { useState } from 'react';
import { useSkillSetuStore } from '@/lib/data/store';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { SkillSetuIdCard } from '@/components/brand/SkillSetuIdCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VerificationPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();

  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [year, setYear] = useState(student.year);
  const [idNumber, setIdNumber] = useState('210050042');
  const [collegeEmail, setCollegeEmail] = useState(student.email);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isStudent = role === 'student';
  const currentStatus = isStudent ? student.verification_status : client.verification_status;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      store.submitStudentVerification({
        college,
        course,
        year,
        collegeIdNumber: idNumber,
        collegeEmail,
      });

      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}

      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verification & Trust Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          SkillSetu requires credential verification to maintain marketplace integrity and protect client payments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form & Verification Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Current Verification Status</h3>
              <VerificationBadge status={currentStatus} size="md" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentStatus === 'verified'
                ? 'Your credentials have been verified by SkillSetu moderation. You have unlocked active marketplace publishing, instant booking receipt, and verified badges.'
                : 'Please submit your official institutional credentials below. Submissions are processed within minutes in our demonstration environment.'}
            </p>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <span className="font-bold block">1. Form Submission</span>
                <span className="text-[10px] text-emerald-600">Details provided</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <span className="font-bold block">2. Document Check</span>
                <span className="text-[10px] text-emerald-600">ID proof validated</span>
              </div>
              <div className={`p-2.5 rounded-xl text-xs border ${
                currentStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <span className="font-bold block">3. Verified Badge</span>
                <span className="text-[10px]">{currentStatus === 'verified' ? 'Active' : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              {isStudent ? 'Student College Identification Proof' : 'Client Organization Identification'}
            </h3>

            {isStudent ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">College / University Name</label>
                    <Input
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Course & Department</label>
                    <Input
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Current Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Student Roll / ID Number</label>
                    <Input
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">College Email Address (.edu / .ac.in)</label>
                  <Input
                    type="email"
                    required
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Upload College Physical ID Card</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 block">
                      Drag and drop college ID photo or PDF
                    </span>
                    <span className="text-[10px] text-slate-400">
                      PNG, JPG or PDF up to 5MB (Simulated upload)
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Organization Name / Startup</label>
                  <Input defaultValue={client.organization_name || 'Tech Fest Committee'} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Registration Document / Authorization Letter</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 block">
                      Upload proof of organization / club registration
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="font-bold px-6 text-xs h-10 shadow-xs"
              >
                {loading ? 'Submitting Credentials...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Visual ID Card */}
        <div className="lg:col-span-1 space-y-4 sticky top-20">
          <SkillSetuIdCard user={isStudent ? student : client} type={isStudent ? 'student' : 'client'} />

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900">Privacy & Data Governance</h4>
            <p className="leading-relaxed text-[11px]">
              Institutional documents are encrypted and reviewed solely for marketplace authentication. SkillSetu never stores government national IDs or exposes student documents publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
