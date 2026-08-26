'use client';

import React, { useState, useRef } from 'react';
import { useSkillSetuStore } from '@/lib/data/store';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { SkillSetuIdCard } from '@/components/brand/SkillSetuIdCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileCheck,
  Clock,
  FileText,
  Trash2,
  RefreshCw,
  Lock,
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

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    type: string;
    previewUrl?: string;
  } | null>(student.id_card_doc_url ? {
    name: 'college_id_document.pdf',
    size: 1420000,
    type: 'application/pdf',
  } : null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isStudent = role === 'student';
  const currentStatus = isStudent ? student.verification_status : client.verification_status;

  const validateAndProcessFile = (file: File) => {
    setUploadError(null);

    // Max 5 MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
      setUploadError('Unsupported file format. Please upload a JPG, JPEG, PNG, or PDF document.');
      return;
    }

    // Simulate private storage upload
    setIsUploading(true);
    setUploadProgress(25);

    setTimeout(() => setUploadProgress(70), 200);
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);

      const isImage = file.type.startsWith('image/');
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    }, 450);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudent && !selectedFile) {
      setUploadError('Please upload your college ID card before submitting for verification.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (isStudent) {
        store.submitStudentVerification({
          college,
          course,
          year,
          collegeIdNumber: idNumber,
          collegeEmail,
          idCardDocUrl: selectedFile?.name || 'college_id.pdf',
        });
      }

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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Verification & Trust Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          SkillSetu requires credential verification to maintain marketplace integrity and protect client payments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form & Verification Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Current Verification Status</h3>
              <VerificationBadge status={currentStatus} size="md" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStatus === 'verified'
                ? 'Your credentials have been verified by SkillSetu moderation. You have unlocked active marketplace publishing, instant booking receipt, and verified badges.'
                : 'Please submit your official institutional credentials below. Submissions are processed within minutes in our demonstration environment.'}
            </p>

            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs">
                <span className="font-bold block">1. Form Submission</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Details provided</span>
              </div>
              <div className={`p-2.5 rounded-xl text-xs border ${
                selectedFile || currentStatus === 'verified'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}>
                <span className="font-bold block">2. Document Check</span>
                <span className="text-[10px]">{selectedFile ? 'Document Uploaded' : 'Pending Upload'}</span>
              </div>
              <div className={`p-2.5 rounded-xl text-xs border ${
                currentStatus === 'verified'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}>
                <span className="font-bold block">3. Verified Badge</span>
                <span className="text-[10px]">{currentStatus === 'verified' ? 'Active' : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              {isStudent ? 'Student College Identification Proof' : 'Client Organization Identification'}
            </h3>

            {isStudent ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">College / University Name</label>
                    <Input
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Course & Department</label>
                    <Input
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Current Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Student Roll / ID Number</label>
                    <Input
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">College Email Address (.edu / .ac.in)</label>
                  <Input
                    type="email"
                    required
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                  />
                </div>

                {/* REAL PHYSICAL COLLEGE ID UPLOAD SECTION */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Upload College Physical ID Card <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" /> Private & Encrypted
                    </span>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    id="college-id-file-upload"
                  />

                  {uploadError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2.5" />
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        Click to select or drag and drop college ID proof
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                        Accepts JPG, JPEG, PNG, or PDF (Max 5 MB)
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3 text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Choose File from Computer
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[280px]">
                            {selectedFile.name}
                          </span>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                            <span>•</span>
                            <span className="uppercase">{selectedFile.type.replace('application/', '').replace('image/', '')}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">Validated</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 text-xs font-semibold"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1" />
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-8 text-xs px-2.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Securing file in private Supabase vault...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-600 rounded-full transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Organization Name / Startup</label>
                  <Input defaultValue={client.organization_name || 'Tech Fest Committee'} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Registration Document / Authorization Letter</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/40">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
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
                disabled={loading || isUploading}
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

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Privacy & Security Guarantee
            </h4>
            <p className="leading-relaxed text-[11px]">
              Institutional ID proofs are stored inside encrypted private Supabase Storage buckets. Documents are accessible strictly by SkillSetu compliance reviewers and are NEVER exposed on public marketplace profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
