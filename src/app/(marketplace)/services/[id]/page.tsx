'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  MapPin,
  Globe,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Star,
  Users,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useSkillSetuStore } from '@/lib/data/store';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/brand/StarRating';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { formatINR, formatDate } from '@/lib/utils';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const store = useSkillSetuStore();
  const service = store.getServiceById(serviceId);
  const student = service ? store.getStudentById(service.student_id) : null;
  const allReviews = store.getReviews().filter((r) => r.student_id === service?.student_id);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Service Not Found</h2>
        <p className="text-xs text-slate-500">The requested service listing does not exist or has been paused.</p>
        <Link href="/browse">
          <Button variant="default" size="sm">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Nav Back Link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="orange" className="text-xs">
            {service.category}
          </Badge>
          <span className="text-xs text-slate-400 font-mono">ID: {service.student_skillsetu_id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Title Header */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {service.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1">
                <StarRating
                  rating={service.student_rating}
                  reviewCount={service.student_review_count}
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-1">
                {service.delivery_mode === 'online' ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>Online / Remote</span>
                  </>
                ) : service.delivery_mode === 'on_campus' ? (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>On Campus ({service.location})</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>Online / On Campus ({service.location})</span>
                  </>
                )}
              </div>

              {service.team_service && (
                <Badge variant="teal" className="text-[10px]">
                  Team Service Available
                </Badge>
              )}
            </div>
          </div>

          {/* Student Freelancer Profile Strip */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href={`/students/${service.student_id}`}
              className="flex items-center gap-4 group/st min-w-0"
            >
              <Avatar
                src={service.student_avatar}
                alt={service.student_name}
                fallback={service.student_name}
                size="lg"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover/st:text-orange-600 transition-colors truncate">
                    {service.student_name}
                  </h3>
                  <VerificationBadge status="verified" size="sm" />
                </div>
                <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {service.student_college}
                </p>
                {student && (
                  <p className="text-[11px] text-slate-400 truncate">
                    {student.course} ({student.year})
                  </p>
                )}
              </div>
            </Link>

            <Link
              href={`/students/${service.student_id}`}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              View Full Portfolio →
            </Link>
          </div>

          {/* Description & Scope */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">About This Service</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            {/* Skills Tags */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Included Skills & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Samples Gallery & Connected Projects */}
          {(() => {
            const studentPortfolio = store.getPortfolioByStudentId(service.student_id);
            const connectedProjects = studentPortfolio?.projects.filter(
              (p) => p.connected_service_id === service.id || p.category.toLowerCase() === service.category.toLowerCase()
            ) || [];
            const usernameSlug = studentPortfolio?.username || service.student_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Portfolio Examples & Deliverables</h3>
                    <p className="text-xs text-slate-500">Real case studies and verified project results</p>
                  </div>
                  {studentPortfolio?.status === 'published' && (
                    <Link href={`/portfolio/${usernameSlug}`} target="_blank">
                      <Button variant="outline" size="sm" className="font-bold text-xs">
                        <ExternalLink className="w-3.5 h-3.5 mr-1 text-orange-600" />
                        Full Portfolio
                      </Button>
                    </Link>
                  )}
                </div>

                {connectedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {connectedProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative h-40 w-full bg-slate-100">
                          <Image
                            src={proj.cover_image_url}
                            alt={proj.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 space-y-1.5">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{proj.title}</h4>
                          <p className="text-[11px] text-slate-600 line-clamp-2">{proj.short_description}</p>
                          {proj.project_outcome && (
                            <p className="text-[10px] text-emerald-800 font-medium line-clamp-1">
                              ✓ {proj.project_outcome}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.portfolio_urls.map((url, idx) => (
                      <div key={idx} className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <Image
                          src={url}
                          alt={`Portfolio sample ${idx + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Verified Client Reviews */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Verified Client Reviews</h3>
                <span className="text-xs text-slate-500 font-semibold">({allReviews.length})</span>
              </div>
              <StarRating rating={service.student_rating} showCount={false} size="sm" />
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {allReviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No reviews recorded yet for this student.</p>
              ) : (
                allReviews.map((review) => (
                  <div key={review.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={review.client_avatar}
                          alt={review.client_name}
                          fallback={review.client_name}
                          size="sm"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{review.client_name}</div>
                          {review.client_org && (
                            <div className="text-[11px] text-slate-400">{review.client_org}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <StarRating rating={review.rating} showCount={false} size="sm" />
                        <span className="text-[10px] text-slate-400">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      {review.review_text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Action Card */}
        <div className="lg:col-span-1 sticky top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="text-xs text-slate-400 font-medium">Standard Pricing</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatINR(service.price)}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  /{service.pricing_unit.replace('per_', '')}
                </span>
              </div>
            </div>

            {/* Availability details */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span>Available: {service.availability_days.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Fast response (avg. 2 hours)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200/80">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-medium">
                  <strong>Payment Protected:</strong> Funds released only when you confirm completion.
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={() => setBookingModalOpen(true)}
              className="w-full h-11 text-sm font-bold shadow-md"
            >
              Book Service Now
            </Button>

            <p className="text-center text-[11px] text-slate-400">
              Transparent 5% platform fee calculated at checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Checkout Modal */}
      <BookingModal
        service={service}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </div>
  );
}
