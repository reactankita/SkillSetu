'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSkillSetuStore } from '@/lib/data/store';
import { ClientType, OrganizationType } from '@/types';
import {
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClientRegisterPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const currentStudent = store.getCurrentStudent();

  // Step 1: Client Type Selection (Individual vs Organization vs Student acting as Client)
  // Step 2: Details & Verification
  // Step 3: Confirmation / Generated Verification ID
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientType, setClientType] = useState<ClientType>('individual');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [password, setPassword] = useState('');

  // Organization fields
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState<OrganizationType>('startup');
  const [roleDesignation, setRoleDesignation] = useState('Founder / Event Lead');
  const [website, setWebsite] = useState('');
  const [docUploaded, setDocUploaded] = useState(false);

  // Individual verification demo
  const [idVerified, setIdVerified] = useState(true);

  // Generated Client ID
  const [generatedId, setGeneratedId] = useState('SK-CL-104827');
  const [loading, setLoading] = useState(false);

  const handleSelectClientType = (type: ClientType) => {
    setClientType(type);
    if (type === 'student_client') {
      // Immediate 1-click activation for student hiring student
      setLoading(true);
      setTimeout(() => {
        store.registerClient({
          full_name: currentStudent.full_name,
          email: currentStudent.email,
          phone: currentStudent.phone || '+91 98200 00000',
          city: currentStudent.location || 'Pune / Mumbai',
          client_type: 'student_client',
          is_student_client: true,
          organization_name: `${currentStudent.college} Student Club`,
          verification_status: 'verified',
        });
        store.setUserRole('client');
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {}
        setLoading(false);
        router.push('/browse');
      }, 500);
      return;
    }
    setStep(2);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newSkillSetuId = `SK-CL-${randomSuffix}`;
    setGeneratedId(newSkillSetuId);

    setTimeout(() => {
      store.registerClient({
        full_name: fullName,
        email: email,
        phone: phone,
        city: city,
        client_type: clientType,
        organization_name: clientType === 'organization' ? organizationName : undefined,
        organization_type: clientType === 'organization' ? organizationType : undefined,
        role_designation: clientType === 'organization' ? roleDesignation : undefined,
        website: clientType === 'organization' ? website : undefined,
        verification_status: clientType === 'individual' ? 'verified' : 'under_review',
        skillsetu_id: newSkillSetuId,
      });

      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}

      setLoading(false);
      setStep(3);
    }, 600);
  };

  const handleProceedToBrowse = () => {
    store.setUserRole('client');
    router.push('/browse');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {step === 1
            ? 'What type of client are you?'
            : step === 2
            ? `Complete ${clientType === 'individual' ? 'Individual Client' : 'Organization'} Registration`
            : 'Client Account Ready'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {step === 1
            ? 'Select your hiring profile to customize verification and payment preferences'
            : step === 2
            ? 'Verified client credentials protect talent bookings and ensure zero ghosting'
            : 'Your client identity has been generated with protected payment access'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-lg rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          {/* STEP 1: CLIENT TYPE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3.5">
                {/* 1. Individual Client */}
                <button
                  type="button"
                  onClick={() => handleSelectClientType('individual')}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 bg-white dark:bg-slate-900 text-left transition-all hover:shadow-sm cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors">
                          1. Individual Client
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Hiring for personal projects, tutoring, photography, portfolio websites, or custom artwork.
                      </p>
                    </div>
                  </div>
                </button>

                {/* 2. Startup / Company / Organization */}
                <button
                  type="button"
                  onClick={() => handleSelectClientType('organization')}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 bg-white dark:bg-slate-900 text-left transition-all hover:shadow-sm cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
                          2. Startup / Company / Organization
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Hiring for company deliverables, fest committees, college clubs, NGOs, or agency overflow.
                      </p>
                    </div>
                  </div>
                </button>

                {/* 3. Student Acting as Client */}
                <button
                  type="button"
                  onClick={() => handleSelectClientType('student_client')}
                  disabled={loading}
                  className="p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-400 bg-white dark:bg-slate-900 text-left transition-all hover:shadow-sm cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            3. Student acting as Client
                          </h3>
                          <Badge variant="orange" className="text-[10px]">Instant 1-Click</Badge>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Are you a student hiring peers for your project or college club? Uses your existing student identity with zero friction.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login/client" className="font-bold text-orange-600 hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTRATION FORM */}
          {step === 2 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Client Type</span>
                </button>
                <Badge variant={clientType === 'individual' ? 'orange' : 'teal'} className="text-[10px] capitalize">
                  {clientType}
                </Badge>
              </div>

              {/* Shared Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Contact Person Name</label>
                  <Input
                    required
                    placeholder="e.g. Rohan Kapoor"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Address</label>
                  <Input
                    type="email"
                    required
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Phone Number</label>
                  <Input
                    type="tel"
                    required
                    placeholder="+91 98201 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">City / Location</label>
                  <Input
                    required
                    placeholder="e.g. Pune / Mumbai / Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Organization-Specific Fields */}
              {clientType === 'organization' && (
                <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Organization Name</label>
                      <Input
                        required
                        placeholder="e.g. Tech Fest Committee / Bloom Studios"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Organization Type</label>
                      <select
                        value={organizationType}
                        onChange={(e) => setOrganizationType(e.target.value as OrganizationType)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="startup">Startup</option>
                        <option value="company">Company / Enterprise</option>
                        <option value="college">College / Student Club / Fest</option>
                        <option value="ngo">NGO / Non-Profit</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Your Role / Designation</label>
                      <Input
                        placeholder="e.g. Founder / Design Head / Convener"
                        value={roleDesignation}
                        onChange={(e) => setRoleDesignation(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Website / Social URL (Optional)</label>
                      <Input
                        type="url"
                        placeholder="https://..."
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Supporting Verification Document */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Supporting Verification Document</label>
                    <div
                      onClick={() => setDocUploaded((prev) => !prev)}
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                        docUploaded
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Upload className="w-5 h-5 mx-auto mb-1 opacity-70" />
                      <span className="text-xs font-semibold block">
                        {docUploaded ? '✓ Authorization Document Attached (Click to remove)' : 'Upload Authorization Letter / Registration proof'}
                      </span>
                      <span className="text-[10px] text-slate-400">PDF, JPG, PNG up to 5MB (Simulated)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Simulated Identity Verification */}
              {clientType === 'individual' && (
                <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 text-xs text-orange-900 dark:text-orange-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Instant Client Verification</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-orange-800 dark:text-orange-300">
                    Individual clients receive an instant <strong className="font-semibold">Verified Client</strong> badge upon registration. SkillSetu never asks for or stores national ID/Aadhaar numbers.
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Account Password</label>
                <Input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="w-full font-bold h-11 text-sm mt-3 shadow-md"
              >
                {loading ? 'Creating Client Account...' : 'Complete Client Registration'}
              </Button>
            </form>
          )}

          {/* STEP 3: REGISTRATION SUCCESS & ID CARD PREVIEW */}
          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Client Account Verified
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You are now authenticated to discover talent and book services with Protected Payments.
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">SkillSetu Client Pass</span>
                  <Badge variant="emerald" className="text-[10px]">Verified Client</Badge>
                </div>
                <div>
                  <div className="text-sm font-bold">{fullName || 'Client Name'}</div>
                  <div className="text-xs text-slate-300">
                    {clientType === 'organization' ? organizationName : 'Individual Client'} • {city}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1">
                  ID: <span className="text-white font-bold">{generatedId}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="default"
                onClick={handleProceedToBrowse}
                className="w-full font-bold h-11 text-sm shadow-md"
              >
                Explore Skills & Services →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
