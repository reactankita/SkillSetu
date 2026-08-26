'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { useSkillSetuStore } from '@/lib/data/store';
import { ClientType, VerificationStatus } from '@/types';
import {
  User,
  Briefcase,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  AlertCircle,
  FileText,
  Upload,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClientRegisterPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole = mounted ? store.getUserRole() : 'client';
  const currentStudent = mounted ? store.getCurrentStudent() : null;

  // Onboarding Step State (0 = Type Select, 1 = Account, 2 = Details, 3 = Verification, 4 = Complete)
  const [step, setStep] = useState<number>(0);

  // Form Fields
  const [clientType, setClientType] = useState<ClientType>('individual');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Mumbai, MH');

  // Type-specific fields
  const [hiringPurposes, setHiringPurposes] = useState<string[]>(['Personal project']);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology & Software');
  const [representativeRole, setRepresentativeRole] = useState('Founder & CEO');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Event Committee');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [academicYear, setAcademicYear] = useState('3rd Year');
  const [aboutBio, setAboutBio] = useState('');

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [assignedSkillSetuId, setAssignedSkillSetuId] = useState('');
  const [error, setError] = useState('');

  // Prepopulate if student is already logged in and selects "Student as Client"
  useEffect(() => {
    if (clientType === 'student_client' && currentStudent) {
      setFullName(currentStudent.full_name);
      setEmail(currentStudent.email);
      setPhone(currentStudent.phone || '+91 98200 11223');
      setCollegeName(currentStudent.college);
      setCourseName(currentStudent.course);
      setAcademicYear(currentStudent.year);
      if (currentStudent.verification_status === 'verified') {
        setVerificationStatus('verified');
        setVerificationDone(true);
      }
    }
  }, [clientType, currentStudent]);

  const togglePurpose = (purpose: string) => {
    setHiringPurposes((prev) =>
      prev.includes(purpose) ? prev.filter((p) => p !== purpose) : [...prev, purpose]
    );
  };

  // Step Navigations & Validations
  const handleNextFromType = () => {
    setStep(1);
  };

  const handleNextFromAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required account fields.');
      return;
    }
    setStep(2);
  };

  const handleNextFromDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (clientType === 'company' && !companyName.trim()) {
      setError('Please enter your company / startup name.');
      return;
    }
    if (clientType === 'organization' && !orgName.trim()) {
      setError('Please enter your organization name.');
      return;
    }
    setStep(3);
  };

  // Simulated DigiLocker Verification for Individuals
  const handleSimulateDigiLocker = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowDigiLockerModal(false);
      setVerificationDone(true);
      setVerificationStatus('verified');
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
    }, 1200);
  };

  // Submit Final Registration
  const handleFinalSubmit = () => {
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      const registered = store.registerClient({
        full_name: fullName,
        email: email,
        phone: phone,
        client_type: clientType,
        location: location,
        organization_name:
          clientType === 'company' ? companyName : clientType === 'organization' ? orgName : undefined,
        organization_type: clientType === 'organization' ? orgType : undefined,
        website: clientType === 'company' ? companyWebsite : clientType === 'organization' ? orgWebsite : undefined,
        industry: clientType === 'company' ? industry : undefined,
        representative_role: representativeRole,
        hiring_purpose: hiringPurposes,
        college: clientType === 'student_client' ? collegeName : undefined,
        course: clientType === 'student_client' ? courseName : undefined,
        year: clientType === 'student_client' ? academicYear : undefined,
        about: aboutBio || `Registered as ${clientType} client on SkillSetu.`,
        verification_status: verificationStatus,
      });

      setAssignedSkillSetuId(registered.skillsetu_id);
      setIsVerifying(false);
      setStep(4);

      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch {}
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {step === 0
            ? 'Welcome to SkillSetu'
            : step === 4
            ? 'Your Client Account is Ready'
            : 'Set Up Your Client Account'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {step === 0
            ? 'Tell us a little about yourself so we can set up the right client account.'
            : step === 4
            ? 'Start discovering verified student talent, creating gig requests, and hiring with protected payments.'
            : 'Complete your onboarding in a few quick steps to begin hiring verified student talent.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-md rounded-2xl border border-slate-200 space-y-6">
          {/* Progress Indicator (Steps 1–3) */}
          {step >= 1 && step <= 3 && (
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {step === 1 && 'Step 1 — Account Information'}
                  {step === 2 && 'Step 2 — Client & Organization Details'}
                  {step === 3 && 'Step 3 — Identity & Verification'}
                </span>
                <span className="font-semibold text-slate-500 font-mono">Step {step} of 3</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full ${step >= 1 ? 'bg-orange-600' : 'bg-slate-200'}`} />
                <div className={`h-1.5 rounded-full ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200'}`} />
                <div className={`h-1.5 rounded-full ${step >= 3 ? 'bg-orange-600' : 'bg-slate-200'}`} />
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 0: CHOOSE CLIENT TYPE (4 EQUAL VISUAL CARDS)                         */}
          {/* ========================================================================= */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-base font-bold text-slate-900">What type of client are you?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the category that best describes how you will hire student talent on SkillSetu.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Individual */}
                <div
                  onClick={() => setClientType('individual')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-2.5 ${
                    clientType === 'individual'
                      ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Individual</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For people hiring students for personal projects, events, tutoring, creative work, etc.
                    </p>
                  </div>
                </div>

                {/* 2. Startup / Company */}
                <div
                  onClick={() => setClientType('company')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-2.5 ${
                    clientType === 'company'
                      ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Startup / Company</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For startups, companies and businesses hiring student talent.
                    </p>
                  </div>
                </div>

                {/* 3. Organization / Institution */}
                <div
                  onClick={() => setClientType('organization')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-2.5 ${
                    clientType === 'organization'
                      ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Organization / Institution</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For colleges, clubs, NGOs, societies, event committees and other organizations.
                    </p>
                  </div>
                </div>

                {/* 4. Student as Client */}
                <div
                  onClick={() => setClientType('student_client')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer text-left space-y-2.5 ${
                    clientType === 'student_client'
                      ? 'border-orange-500 bg-orange-50/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Student as Client</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For students who want to hire another student for a project, event or service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link href="/login/client" className="text-xs font-semibold text-slate-600 hover:underline">
                  Already have an account? Sign In
                </Link>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNextFromType}
                  className="font-bold text-xs px-6 h-10 shadow-xs"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 1: ACCOUNT INFORMATION                                               */}
          {/* ========================================================================= */}
          {step === 1 && (
            <form onSubmit={handleNextFromAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {clientType === 'company' || clientType === 'organization'
                      ? 'Authorized Representative Name *'
                      : 'Full Name *'}
                  </label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rohan Kapoor"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    {clientType === 'company'
                      ? 'Work / Business Email *'
                      : clientType === 'organization'
                      ? 'Official Organization Email *'
                      : clientType === 'student_client'
                      ? 'Student Email (.edu / .ac.in) *'
                      : 'Email Address *'}
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Phone Number *</label>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">City / Location *</label>
                  <Input
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, MH"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Account Password *</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(0)}
                  className="text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back
                </Button>
                <Button type="submit" variant="default" className="font-bold text-xs px-6 h-10 shadow-xs">
                  Continue to Details →
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: CLIENT / ORGANIZATION DETAILS                                     */}
          {/* ========================================================================= */}
          {step === 2 && (
            <form onSubmit={handleNextFromDetails} className="space-y-5">
              {/* Individual Form */}
              {clientType === 'individual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      What do you plan to hire students for? (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Personal project',
                        'Event & Photography',
                        'Tutoring & Academics',
                        'Creative & Design',
                        'Software & Web',
                        'Other',
                      ].map((item) => {
                        const active = hiringPurposes.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => togglePurpose(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              active
                                ? 'bg-orange-50 border-orange-300 text-orange-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {active && <Check className="w-3 h-3 inline mr-1 text-orange-600 -mt-0.5" />}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Short Bio / About (Optional)</label>
                    <Textarea
                      rows={3}
                      value={aboutBio}
                      onChange={(e) => setAboutBio(e.target.value)}
                      placeholder="Brief note about the types of projects or assistance you need..."
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Startup / Company Form */}
              {clientType === 'company' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Company / Startup Name *</label>
                      <Input
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. GrowthCraft Labs"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Company Website</label>
                      <Input
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        placeholder="https://company.com"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Industry</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Technology & Software">Technology & Software</option>
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="Media & Creative Agency">Media & Creative Agency</option>
                        <option value="EdTech & Education">EdTech & Education</option>
                        <option value="FinTech & Finance">FinTech & Finance</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Other Industry">Other Industry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Your Role / Designation</label>
                      <select
                        value={representativeRole}
                        onChange={(e) => setRepresentativeRole(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Founder / Co-Founder">Founder / Co-Founder</option>
                        <option value="HR & Talent Lead">HR & Talent Lead</option>
                        <option value="Project / Product Manager">Project / Product Manager</option>
                        <option value="Marketing Lead">Marketing Lead</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Other Role">Other Role</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization / Institution Form */}
              {clientType === 'organization' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Organization Name *</label>
                      <Input
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. Mood Indigo Fest Committee"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Organization Type</label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="College / University">College / University</option>
                        <option value="Student Club / Society">Student Club / Society</option>
                        <option value="Event Committee">Event Committee</option>
                        <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                        <option value="Educational Institution">Educational Institution</option>
                        <option value="Community Organization">Community Organization</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Official Website or Portal</label>
                    <Input
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      placeholder="https://fest-organization.org"
                      className="text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Student as Client Form */}
              {clientType === 'student_client' && (
                <div className="space-y-4">
                  {currentStudent && currentStudent.verification_status === 'verified' && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Your existing student verification (<strong>{currentStudent.college}</strong>) will be
                        automatically applied to your client profile.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">College / University *</label>
                      <Input
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="e.g. IIT Bombay"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Course & Department *</label>
                      <Input
                        required
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back
                </Button>
                <Button type="submit" variant="default" className="font-bold text-xs px-6 h-10 shadow-xs">
                  Continue to Verification →
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: IDENTITY & BUSINESS VERIFICATION                                  */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {clientType === 'individual'
                    ? 'Identity Verification'
                    : clientType === 'student_client'
                    ? 'Student Credential Sync'
                    : 'Organization Authenticity Check'}
                </h3>
                <p className="text-xs text-slate-500">
                  Verify your identity to become a trusted SkillSetu client and post opportunities.
                </p>
              </div>

              {/* INDIVIDUAL CLIENT: DIGILOCKER SIMULATION */}
              {clientType === 'individual' && (
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0 text-orange-700 font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        DigiLocker Identity Verification
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Verify identity via government-authorized DigiLocker channel. SkillSetu never stores raw Aadhaar numbers or documents.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-[11px] space-y-1">
                    <span className="font-bold text-slate-700 block">🔒 Privacy & Compliance Note</span>
                    <p>
                      Identity verification confirms your client authenticity to student freelancers. Simulated verification is used in this environment.
                    </p>
                  </div>

                  {verificationDone ? (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>DigiLocker Identity Verification Complete (Verified Status Active)</span>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => setShowDigiLockerModal(true)}
                      className="w-full text-xs font-bold h-10 shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      Continue with DigiLocker (Simulated)
                    </Button>
                  )}
                </div>
              )}

              {/* COMPANY / ORGANIZATION VERIFICATION */}
              {(clientType === 'company' || clientType === 'organization') && (
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center shrink-0 text-teal-700">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">
                        {clientType === 'company' ? 'Work Domain & Business Authentication' : 'Official Letterhead & Club Verification'}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Organizations are initially placed in <strong>Verification Pending</strong> and fast-tracked by moderation.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Verification Factor</span>
                      <Badge variant="orange" className="text-[10px]">Work Email & Domain</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Domain: <strong>{email.split('@')[1] || 'organization.org'}</strong> (Simulated automated check)
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <span>Initial Status: <strong>Verification Pending (Under Review)</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setVerificationStatus('verified');
                        setVerificationDone(true);
                      }}
                      className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
                    >
                      {verificationDone ? '✓ Verified (Simulated)' : 'Simulate 1-Click Approval'}
                    </button>
                  </div>
                </div>
              )}

              {/* STUDENT AS CLIENT */}
              {clientType === 'student_client' && (
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                    <h4 className="text-xs font-bold text-slate-900">Student Identity Linked</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your student verification status is synchronized with your client profile, enabling you to switch roles seamlessly.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="default"
                  disabled={isVerifying}
                  onClick={handleFinalSubmit}
                  className="font-bold text-xs px-6 h-10 shadow-xs"
                >
                  {isVerifying ? 'Finalizing Account...' : 'Complete Registration →'}
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: COMPLETION SCREEN                                                 */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="text-center space-y-6 py-2">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Your SkillSetu Client Account is Ready
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {verificationStatus === 'verified'
                    ? 'Your client credentials are fully verified. You can now hire students with protected payments.'
                    : 'Your account is ready. Verification is currently under review by our moderation team.'}
                </p>
              </div>

              {/* Client Summary Pass */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white text-left space-y-4 max-w-md mx-auto shadow-lg border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Client ID Pass
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{fullName}</h4>
                  </div>
                  <VerificationBadge status={verificationStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {clientType.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">SkillSetu ID</span>
                    <span className="font-mono font-bold text-orange-400">{assignedSkillSetuId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => router.push('/browse')}
                  className="w-full sm:w-auto font-bold text-xs px-6 h-10 shadow-xs"
                >
                  Browse Services →
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/profile')}
                  className="w-full sm:w-auto text-xs font-semibold h-10"
                >
                  View Client Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIGILOCKER SIMULATION MODAL */}
      {showDigiLockerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                  DL
                </div>
                <h4 className="text-sm font-bold text-slate-900">DigiLocker Verification Gateway</h4>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Prototype Sandbox</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="leading-relaxed">
                SkillSetu securely checks identity verification status through the authorized DigiLocker consent framework without storing government identity numbers.
              </p>
              <div className="font-mono text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-800">
                User: <strong>{fullName}</strong> ({email})
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDigiLockerModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                disabled={isVerifying}
                onClick={handleSimulateDigiLocker}
                className="text-xs font-bold h-9"
              >
                {isVerifying ? 'Connecting to DigiLocker...' : 'Authorize & Verify (Simulated)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
