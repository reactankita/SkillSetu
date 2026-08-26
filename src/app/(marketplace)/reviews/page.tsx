'use client';

import React from 'react';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/brand/StarRating';
import { Card } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ReviewsPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const allReviews = store.getReviews();

  const relevantReviews = allReviews.filter((r) =>
    role === 'student' ? r.student_id === student.id : r.client_id === client.id
  );

  const avgRating = relevantReviews.length > 0
    ? (relevantReviews.reduce((acc, r) => acc + r.rating, 0) / relevantReviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {role === 'student' ? 'Client Reviews & Reputation' : 'Reviews You Have Given'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {role === 'student'
              ? 'Verified ratings submitted by clients after completed and confirmed bookings.'
              : 'Feedback you have provided to student providers on completed deliverables.'}
          </p>
        </div>

        {/* Rating Summary Pill */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
          <StarRating rating={Number(avgRating)} showCount={false} size="lg" />
          <div>
            <div className="text-base font-extrabold text-slate-900 leading-none">{avgRating} / 5.0</div>
            <div className="text-[10px] text-slate-400 font-medium">{relevantReviews.length} total reviews</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {relevantReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-xs text-slate-400">No reviews recorded yet.</p>
            <Link href="/browse" className="text-xs font-bold text-orange-600 hover:underline">
              Explore Marketplace →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantReviews.map((review) => (
              <Card key={review.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={review.client_avatar}
                      alt={review.client_name}
                      fallback={review.client_name}
                      size="md"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{review.client_name}</div>
                      {review.client_org && (
                        <div className="text-xs text-slate-500">{review.client_org}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <StarRating rating={review.rating} showCount={false} size="sm" />
                    <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(review.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Completed Booking
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
