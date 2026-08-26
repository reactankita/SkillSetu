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
  Trash2,
  FileText,
  ImageIcon,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadedFileInfo {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export default function VerificationPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();

  const isStudent = role === 'student';
  const currentStatus = isStudent ? student.verification_status : client.verification_status;

  // Form Fields
  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [year, setYear] = useState(student.year);
  const [idNumber, setIdNumber] = useState('210050042');
  const [collegeEmail, setCollegeEmail] = useState(student.email);
  const [orgName, setOrgName] = useState(client.organization_name || 'Tech Fest Committee');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string>('');

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

  const validateAndProcessFile = (file: File) => {
    setUploadError('');

    // Type validation
    const isValidType =
      ALLOWED_TYPES.includes(file.type) ||
      file.name.toLowerCase().endsWith('.png') ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isValidType) {
      setUploadError('Unsupported file type. Please upload a PNG, JPG, or PDF document.');
      return;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
      return;
    }

    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
      previewUrl,
    });
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemoveFile = () => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Guard: Required fields + ID file must be present
  const isFormValid = isStudent
    ? college.trim() !== '' &&
      course.trim() !== '' &&
      idNumber.trim() !== '' &&
      collegeEmail.trim() !== '' &&
      uploadedFile !== null
    : orgName.trim() !== '' && uploadedFile !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setTimeout(() => {
      if (isStudent) {
        store.submitStudentVerification({
          college,
          course,
          year,
          collegeIdNumber: idNumber,
          collegeEmail,
          documentName: uploadedFile?.name,
          status: 'pending',
        });
      }

      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}

      setLoading(false);
      setSubmittedMessage('Verification submitted! Your institutional ID is currently Under Review.');
      setTimeout(() => setSubmittedMessage(''), 5000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verification & Trust Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          SkillSetu verifies institutional credentials to maintain marketplace authenticity and protect client transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Progression Card */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Current Status</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {currentStatus === 'verified'
                    ? 'Verified Marketplace Talent'
                    : currentStatus === 'pending'
                    ? 'Credentials Under Review'
                    : 'Institutional Verification Required'}
                </h3>
              </div>
              <VerificationBadge status={currentStatus} size="md" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentStatus === 'verified'
                ? 'Your student credentials have been confirmed. You have unlocked active marketplace publishing, instant booking checkout, and verified badges on all your services.'
                : currentStatus === 'pending'
                ? 'Your documents have been submitted to SkillSetu moderation. Applications are typically processed within 15–30 minutes.'
                : 'Upload your college physical ID card or official department letter to activate your marketplace profile.'}
            </p>

            {/* Stepper Progression */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  1. Details
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">Academic info filled</span>
              </div>

              <div className={`p-3 rounded-xl text-xs border ${
                uploadedFile || currentStatus === 'verified' || currentStatus === 'pending'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <span className="font-bold flex items-center gap-1">
                  {uploadedFile || currentStatus === 'verified' || currentStatus === 'pending' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block" />
                  )}
                  2. ID Upload
                </span>
                <span className="text-[10px] block mt-0.5">
                  {uploadedFile ? 'Document attached' : 'Card photo/PDF'}
                </span>
              </div>

              <div className={`p-3 rounded-xl text-xs border ${
                currentStatus === 'pending'
                  ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                  : currentStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <span className="font-bold flex items-center gap-1">
                  {currentStatus === 'verified' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : currentStatus === 'pending' ? (
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block" />
                  )}
                  3. Review
                </span>
                <span className="text-[10px] block mt-0.5">
                  {currentStatus === 'verified' ? 'Approved' : currentStatus === 'pending' ? 'In Progress' : 'Pending'}
                </span>
              </div>

              <div className={`p-3 rounded-xl text-xs border ${
                currentStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
                <span className="font-bold flex items-center gap-1">
                  {currentStatus === 'verified' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block" />
                  )}
                  4. Badge
                </span>
                <span className="text-[10px] block mt-0.5">
                  {currentStatus === 'verified' ? 'Active' : 'Locked'}
                </span>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {submittedMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {isStudent ? 'College Enrollment & Identification Proof' : 'Client Organization Identification'}
            </h3>

            {isStudent ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">College / University Name *</label>
                    <Input
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. IIT Bombay, COEP Pune, BITS Pilani"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Course & Department *</label>
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
                    <label className="text-xs font-bold text-slate-800">Current Academic Year *</label>
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
                    <label className="text-xs font-bold text-slate-800">Student Roll / ID Number *</label>
                    <Input
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="e.g. 210050042"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">College Email Address (.edu / .ac.in) *</label>
                  <Input
                    type="email"
                    required
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    placeholder="sarah.chen@iitb.ac.in"
                    className="text-xs"
                  />
                </div>

                {/* File Upload Section */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Upload College Physical ID Card *</label>
                    <span className="text-[10px] text-slate-400">PNG, JPG, or PDF up to 5 MB</span>
                  </div>

                  {/* Hidden Native File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleNativeFileChange}
                    accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                    className="hidden"
                  />

                  {/* Upload Dropzone / Attached File View */}
                  {!uploadedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-7 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                          : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-400'
                      }`}
                    >
                      <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-slate-800 block">
                        Click to browse or drag and drop college ID file
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Clear photo of ID card (front side) or student bonafide PDF
                      </span>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                          {uploadedFile.type.includes('pdf') ? (
                            <FileText className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-emerald-700" />
                          )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate block">
                              {uploadedFile.name}
                            </span>
                            <Badge variant="emerald" className="text-[9px] uppercase font-mono px-1.5 py-0">
                              {uploadedFile.type.includes('pdf') ? 'PDF' : 'IMAGE'}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {formatFileSize(uploadedFile.size)} • Document attached
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-rose-600 hover:bg-rose-50 h-8 px-2.5 text-xs font-bold shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}

                  {/* Validation Error Message */}
                  {uploadError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Client Organization Form */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Organization Name / Company *</label>
                  <Input
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Mood Indigo Fest Committee / GrowthCraft"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Registration Document / Authorization Letter *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleNativeFileChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                  />
                  {!uploadedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/60 hover:bg-slate-100 cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-slate-700 block">
                        Upload proof of organization or business registration (PNG, JPG, PDF up to 5MB)
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between">
                      <div className="text-xs">
                        <strong>{uploadedFile.name}</strong> ({formatFileSize(uploadedFile.size)})
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="text-rose-600 h-7 text-xs">
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button (Guarded) */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                {!uploadedFile
                  ? '⚠️ Attach your college ID document to enable submission.'
                  : '✓ All required verification details attached.'}
              </span>

              <Button
                type="submit"
                variant="default"
                disabled={loading || !isFormValid}
                className="font-bold px-6 text-xs h-10 shadow-xs"
              >
                {loading ? 'Submitting Credentials...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Visual ID Card & Privacy Policy */}
        <div className="lg:col-span-1 space-y-4 sticky top-20">
          <SkillSetuIdCard user={isStudent ? student : client} type={isStudent ? 'student' : 'client'} />

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900">Privacy & Data Governance</h4>
            <p className="leading-relaxed text-[11px]">
              Institutional documents are encrypted and reviewed solely for marketplace authentication. SkillSetu never stores national identity numbers or exposes student documents publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
