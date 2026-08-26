'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { useSkillSetuStore } from '@/lib/data/store';
import { ClientType, VerificationStatus } from '@/types';
import {
  User,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
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

  const currentStudent = mounted ? store.getCurrentStudent() : null;

  // Flow State: 'select' | 'form' | 'complete'
  const [viewState, setViewState] = useState<'select' | 'form' | 'complete'>('select');
  const [clientType, setClientType] = useState<ClientType | null>(null);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student-specific Fields
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [useExistingStudentVerif, setUseExistingStudentVerif] = useState(true);

  // Organization-specific Fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Student Committee');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgRepName, setOrgRepName] = useState('');
  const [orgRepRole, setOrgRepRole] = useState('Coordinator');
  const [orgRepPhone, setOrgRepPhone] = useState('');
  const [orgRepEmail, setOrgRepEmail] = useState('');

  // Business-specific Fields
  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState('Startup');
  const [bizIndustry, setBizIndustry] = useState('Tech & Software');
  const [bizWebsite, setBizWebsite] = useState('');
  const [bizRepName, setBizRepName] = useState('');
  const [bizRepRole, setBizRepRole] = useState('Founder');
  const [bizRepPhone, setBizRepPhone] = useState('');
  const [bizRepEmail, setBizRepEmail] = useState('');

  // Verification & Status
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [showDigiLockerModal, setShowDigiLockerModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [assignedSkillSetuId, setAssignedSkillSetuId] = useState('');
  const [assignedClientType, setAssignedClientType] = useState<ClientType>('individual');
  const [error, setError] = useState('');

  // Auto-populate when selecting student if student session exists
  const handleSelectClientType = (type: ClientType) => {
    setClientType(type);
    setError('');

    if (type === 'student' && currentStudent) {
      setFullName(currentStudent.full_name);
      setEmail(currentStudent.email);
      setCollege(currentStudent.college);
      setCourse(currentStudent.course);
      setYear(currentStudent.year);
      setCity(currentStudent.location || 'Mumbai, MH');
      if (currentStudent.verification_status === 'verified') {
        setVerificationStatus('verified');
      }
    }

    setViewState('form');
  };

  // DigiLocker Simulation for Individuals
  const handleDigiLockerSimulate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowDigiLockerModal(false);
      setVerificationStatus('verified');
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!clientType) return;

    if (clientType === 'individual') {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim()) {
        setError('Please fill in all required personal details.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
    }

    if (clientType === 'student') {
      if (!fullName.trim() || !email.trim() || !college.trim() || !course.trim()) {
        setError('Please fill in all student information.');
        return;
      }
    }

    if (clientType === 'organization') {
      if (!orgName.trim() || !email.trim() || !orgRepName.trim()) {
        setError('Please provide organization and representative details.');
        return;
      }
    }

    if (clientType === 'business') {
      if (!bizName.trim() || !email.trim() || !bizRepName.trim()) {
        setError('Please provide business and representative details.');
        return;
      }
    }

    setIsVerifying(true);

    setTimeout(() => {
      const finalStatus: VerificationStatus =
        clientType === 'individual'
          ? verificationStatus
          : clientType === 'student' && useExistingStudentVerif && currentStudent?.verification_status === 'verified'
          ? 'verified'
          : verificationStatus === 'verified'
          ? 'verified'
          : 'under_review';

      const registered = store.registerClient({
        full_name:
          clientType === 'organization'
            ? orgRepName
            : clientType === 'business'
            ? bizRepName
            : fullName,
        email: email,
        phone:
          clientType === 'organization'
            ? orgRepPhone || phone
            : clientType === 'business'
            ? bizRepPhone || phone
            : phone,
        client_type: clientType,
        location: city || 'Mumbai, MH',
        organization_name:
          clientType === 'organization' ? orgName : clientType === 'business' ? bizName : undefined,
        organization_type: clientType === 'organization' ? orgType : undefined,
        business_type: clientType === 'business' ? bizType : undefined,
        industry: clientType === 'business' ? bizIndustry : undefined,
        website: clientType === 'organization' ? orgWebsite : clientType === 'business' ? bizWebsite : undefined,
        representative_name:
          clientType === 'organization' ? orgRepName : clientType === 'business' ? bizRepName : undefined,
        representative_role:
          clientType === 'organization' ? orgRepRole : clientType === 'business' ? bizRepRole : undefined,
        college: clientType === 'student' ? college : undefined,
        course: clientType === 'student' ? course : undefined,
        year: clientType === 'student' ? year : undefined,
        about: `Registered as ${clientType} client on SkillSetu.`,
        verification_status: finalStatus,
      });

      setAssignedSkillSetuId(registered.skillsetu_id);
      setAssignedClientType(clientType);
      setVerificationStatus(finalStatus);
      setIsVerifying(false);
      setViewState('complete');

      try {
        confetti({ particleCount: 75, spread: 65 });
      } catch {}
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {viewState === 'select'
            ? 'Create your SkillSetu client account'
            : viewState === 'complete'
            ? 'Your SkillSetu client account is ready'
            : clientType === 'individual'
            ? 'Create your individual account'
            : clientType === 'student'
            ? 'Create your student client account'
            : clientType === 'organization'
            ? 'Organization Details'
            : 'Business / Startup Details'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {viewState === 'select'
            ? 'Tell us how you plan to use SkillSetu so we can provide the right verification and account experience.'
            : viewState === 'complete'
            ? 'Start discovering verified student talent, creating gig requests, and hiring with protected payments.'
            : 'Provide your details and complete verification to start hiring verified student talent.'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-md rounded-2xl border border-slate-200 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. FIRST SCREEN: WHAT TYPE OF CLIENT ARE YOU? (4 EQUAL VISUAL CARDS)      */}
          {/* ========================================================================= */}
          {viewState === 'select' && (
            <div className="space-y-6">
              <div className="text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                  Account Category
                </h3>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  What type of client are you?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Individual */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Individual</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        For personal projects, events, tutoring and services.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectClientType('individual')}
                    className="w-full text-xs font-bold justify-between h-9"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* 2. Student */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Student</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Hire another student using your student identity.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectClientType('student')}
                    className="w-full text-xs font-bold justify-between h-9"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* 3. Organization / Committee */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Organization / Committee</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        For colleges, clubs, committees, NGOs and institutions.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectClientType('organization')}
                    className="w-full text-xs font-bold justify-between h-9"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* 4. Business / Startup */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Business / Startup</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        For startups, companies, businesses and agencies.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSelectClientType('business')}
                    className="w-full text-xs font-bold justify-between h-9"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Already have a client account?</span>
                <Link href="/login/client" className="font-bold text-orange-600 hover:underline">
                  Sign In →
                </Link>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. REGISTRATION FORM BY CLIENT TYPE                                       */}
          {/* ========================================================================= */}
          {viewState === 'form' && clientType && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Back to selector */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setViewState('select')}
                  className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Change Account Type
                </button>
                <Badge variant="outline" className="text-[11px] capitalize font-mono">
                  {clientType} Account
                </Badge>
              </div>

              {/* ----------------- 4. INDIVIDUAL FORM ----------------- */}
              {clientType === 'individual' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Full Name *</label>
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ananya Deshmukh"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
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
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, MH"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Password *</label>
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Confirm Password *</label>
                      <Input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Identity Verification Section */}
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Identity Verification</h4>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Identity verification helps SkillSetu maintain a trusted marketplace.
                      </p>
                      <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                        🔒 <strong>Privacy Protected:</strong> SkillSetu uses authorized verification channels and never stores raw Aadhaar numbers or government documents.
                      </div>
                      {verificationStatus === 'verified' ? (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>✓ Verified Client (DigiLocker Identity Verified)</span>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowDigiLockerModal(true)}
                          className="w-full text-xs font-bold h-9"
                        >
                          <ShieldCheck className="w-4 h-4 mr-1.5 text-orange-600" />
                          Continue with DigiLocker (Prototype verification)
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- 5. STUDENT AS CLIENT FORM ----------------- */}
              {clientType === 'student' && (
                <div className="space-y-4">
                  {currentStudent && currentStudent.verification_status === 'verified' && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>✓ Existing student verification found (<strong>{currentStudent.college}</strong>)</span>
                      </div>
                      <Badge variant="emerald" className="text-[10px]">Use my existing student verification</Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Full Name *</label>
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sarah Chen"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Student Email *</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.chen@iitb.ac.in"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">College / University *</label>
                      <Input
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Bombay"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Course *</label>
                      <Input
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Academic Year</label>
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
                      <label className="text-xs font-bold text-slate-800">Password *</label>
                      <Input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- 6. ORGANIZATION / COMMITTEE FORM ----------------- */}
              {clientType === 'organization' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Organization Name *</label>
                      <Input
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. Tech Fest Committee / Rotaract"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Organization Type *</label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="College / Institution">College / Institution</option>
                        <option value="Student Committee">Student Committee</option>
                        <option value="College Club">College Club</option>
                        <option value="NGO">NGO</option>
                        <option value="Society">Society</option>
                        <option value="Community Organization">Community Organization</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Official Email *</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@techfest.org"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Website (Optional)</label>
                      <Input
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                        placeholder="https://techfest.org"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Location *</label>
                      <Input
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai, MH"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Representative Details */}
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Representative Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Representative Full Name *</label>
                        <Input
                          required
                          value={orgRepName}
                          onChange={(e) => setOrgRepName(e.target.value)}
                          placeholder="e.g. Rohan Kapoor"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Role / Position *</label>
                        <select
                          value={orgRepRole}
                          onChange={(e) => setOrgRepRole(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Coordinator">Coordinator</option>
                          <option value="Committee Member">Committee Member</option>
                          <option value="Representative">Representative</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Phone *</label>
                        <Input
                          type="tel"
                          required
                          value={orgRepPhone}
                          onChange={(e) => setOrgRepPhone(e.target.value)}
                          placeholder="+91 98200 00000"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Password *</label>
                        <Input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- 7. BUSINESS / STARTUP FORM ----------------- */}
              {clientType === 'business' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Business / Startup Name *</label>
                      <Input
                        required
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                        placeholder="e.g. Startup Sprint Labs"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Organization Type *</label>
                      <select
                        value={bizType}
                        onChange={(e) => setBizType(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Startup">Startup</option>
                        <option value="Company">Company</option>
                        <option value="Small Business">Small Business</option>
                        <option value="Agency">Agency</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Industry</label>
                      <Input
                        value={bizIndustry}
                        onChange={(e) => setBizIndustry(e.target.value)}
                        placeholder="e.g. Tech & Software"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Business Email *</label>
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@startupsprint.co"
                        className="text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Website</label>
                      <Input
                        value={bizWebsite}
                        onChange={(e) => setBizWebsite(e.target.value)}
                        placeholder="https://startupsprint.co"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Representative Details */}
                  <div className="pt-2 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Representative Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Representative Full Name *</label>
                        <Input
                          required
                          value={bizRepName}
                          onChange={(e) => setBizRepName(e.target.value)}
                          placeholder="e.g. Sneha Pillai"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Role *</label>
                        <select
                          value={bizRepRole}
                          onChange={(e) => setBizRepRole(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Founder">Founder</option>
                          <option value="Co-founder">Co-founder</option>
                          <option value="HR">HR</option>
                          <option value="Project Manager">Project Manager</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Phone *</label>
                        <Input
                          type="tel"
                          required
                          value={bizRepPhone}
                          onChange={(e) => setBizRepPhone(e.target.value)}
                          placeholder="+91 98451 00000"
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-800">Password *</label>
                        <Input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 8 characters"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setViewState('select')}
                  className="text-xs font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isVerifying}
                  className="font-bold text-xs px-6 h-10 shadow-xs"
                >
                  {isVerifying ? 'Creating Account...' : 'Complete Registration →'}
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. COMPLETION SCREEN                                                      */}
          {/* ========================================================================= */}
          {viewState === 'complete' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Your SkillSetu client account is ready
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {verificationStatus === 'verified'
                    ? 'Your client credentials are fully verified. You can now discover talent and hire students.'
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
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      {assignedClientType === 'organization'
                        ? orgName
                        : assignedClientType === 'business'
                        ? bizName
                        : fullName}
                    </h4>
                  </div>
                  <VerificationBadge
                    status={verificationStatus}
                    label={
                      verificationStatus === 'verified'
                        ? assignedClientType === 'organization'
                          ? 'Verified Organization'
                          : assignedClientType === 'business'
                          ? 'Verified Business'
                          : assignedClientType === 'student'
                          ? 'Verified Student'
                          : 'Verified Client'
                        : undefined
                    }
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {assignedClientType}
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
                User: <strong>{fullName || 'Individual Client'}</strong> ({email || 'client@email.com'})
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
                onClick={handleDigiLockerSimulate}
                className="text-xs font-bold h-9"
              >
                {isVerifying ? 'Connecting...' : 'Authorize & Verify (Prototype)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
