'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  MapPin,
  Calendar,
  ShieldCheck,
  Briefcase,
  Star,
  Award,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useSkillSetuStore } from '@/lib/data/store';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/brand/StarRating';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { SkillSetuIdCard } from '@/components/brand/SkillSetuIdCard';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { Service } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const store = useSkillSetuStore();
  const student = store.getStudentById(studentId) || store.getStudents()[0];
  const studentServices = store.getServices().filter((s) => s.student_id === student.id && s.status === 'published');
  const studentReviews = store.getReviews().filter((r) => r.student_id === student.id);
  const portfolio = store.getPortfolioByStudentId(student.id);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const hasPublishedPortfolio = portfolio && portfolio.status === 'published';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      {/* Hero Profile Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar
              src={student.avatar_url}
              alt={student.full_name}
              fallback={student.full_name}
              size="xl"
              className="border-2 border-orange-500/20"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{student.full_name}</h1>
                <VerificationBadge status={student.verification_status} size="md" />
                {hasPublishedPortfolio && (
                  <Badge variant="navy" className="text-[10px]">
                    <Briefcase className="w-3 h-3 mr-1 text-orange-400" />
                    Portfolio Available
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{student.college}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {student.course} • <span className="font-bold text-slate-700 dark:text-slate-200">{student.year}</span>
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {student.location}
                </span>
                <span>•</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{student.skillsetu_id}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Block */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-8 text-center w-full md:w-auto">
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{student.rating} ★</div>
              <div className="text-[11px] text-slate-400 font-medium">{student.review_count} reviews</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{student.completed_bookings_count}</div>
              <div className="text-[11px] text-slate-400 font-medium">Completed</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{formatINR(student.hourly_rate_base)}</div>
              <div className="text-[11px] text-slate-400 font-medium">Starting /hr</div>
            </div>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Earned Badges:</span>
          {student.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <Award className="w-3.5 h-3.5 text-orange-600" />
              <span>{badge}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: About, Portfolio, Services, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">About Me</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {portfolio?.about || student.about}
            </p>
          </div>

          {/* Skills & Tooling */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Skills & Tooling</h3>
            <div className="flex flex-wrap gap-2">
              {(portfolio?.skills || student.skills).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* PUBLISHED PORTFOLIO SHOWCASE */}
          {hasPublishedPortfolio && portfolio.projects && portfolio.projects.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-600" />
                    <span>Featured Portfolio Projects ({portfolio.projects.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Verified case studies and deliverable samples</p>
                </div>
                <Badge variant="teal" className="text-[10px] capitalize">
                  {portfolio.template} layout
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 overflow-hidden flex flex-col justify-between"
                  >
                    {proj.image_url && (
                      <div className="h-36 w-full relative bg-slate-200 dark:bg-slate-700">
                        <Image src={proj.image_url} alt={proj.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 font-bold">
                            {proj.category}
                          </span>
                          <span>{proj.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{proj.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{proj.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        {proj.outcome && (
                          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <span>✓</span>
                            <span>{proj.outcome}</span>
                          </div>
                        )}
                        {proj.project_link && (
                          <a
                            href={proj.project_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                          >
                            <span>Live Project</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Experience & Credentials</h3>
            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-orange-600" />
                  Practical Experience
                </div>
                <p className="leading-relaxed">{portfolio?.experience || student.experience}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  Education
                </div>
                <p className="leading-relaxed">{portfolio?.education || student.education}</p>
              </div>
            </div>
          </div>

          {/* Published Services */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Services by {student.full_name} ({studentServices.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentServices.map((service) => (
                <ServiceCard key={service.id} service={service} onBookClick={handleBook} />
              ))}
            </div>
          </div>

          {/* Verified Client Reviews */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Verified Client Reviews ({studentReviews.length})</h3>
              <StarRating rating={student.rating} showCount={false} size="sm" />
            </div>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {studentReviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No reviews yet for this student.</p>
              ) : (
                studentReviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={rev.client_avatar}
                          alt={rev.client_name}
                          fallback={rev.client_name}
                          size="sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{rev.client_name}</div>
                          {rev.client_org && (
                            <div className="text-[11px] text-slate-400">{rev.client_org}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <StarRating rating={rev.rating} showCount={false} size="sm" />
                        <span className="text-[10px] text-slate-400">{formatDate(rev.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-10">
                      {rev.review_text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: SkillSetu ID Card & Schedule */}
        <div className="lg:col-span-1 space-y-6 sticky top-20">
          <SkillSetuIdCard user={student} type="student" />

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Weekly Availability</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isAvailable = student.availability_days.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      isAvailable
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        service={selectedService}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </div>
  );
}
