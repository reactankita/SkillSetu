'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { Avatar } from '@/components/ui/avatar';
import { StarRating } from '@/components/brand/StarRating';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ThumbsUp, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ReviewsPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const allReviews = store.getReviews();

  const [viewScope, setViewScope] = useState<'my' | 'all'>('my');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4'>('all');

  const myReviews = allReviews.filter((r) =>
    role === 'student' ? r.student_id === student.id : r.client_id === client.id
  );

  const baseReviews = viewScope === 'my' ? (myReviews.length > 0 ? myReviews : allReviews) : allReviews;

  const displayedReviews = ratingFilter === 'all'
    ? baseReviews
    : baseReviews.filter((r) => r.rating === Number(ratingFilter));

  const avgRating = baseReviews.length > 0
    ? (baseReviews.reduce((acc, r) => acc + r.rating, 0) / baseReviews.length).toFixed(1)
    : '5.0';

  const fiveStarCount = baseReviews.filter((r) => r.rating === 5).length;
  const fourStarCount = baseReviews.filter((r) => r.rating === 4).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {role === 'student' ? 'Client Reviews & Verified Reputation' : 'Reviews & Service Feedback'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {role === 'student'
              ? 'Verified ratings submitted by clients after completed and confirmed bookings.'
              : 'Feedback you have provided to student providers on completed deliverables.'}
          </p>
        </div>

        {/* Rating Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="flex flex-col items-center justify-center pr-3 border-r border-slate-100">
            <div className="text-2xl font-black text-slate-900 leading-none">{avgRating}</div>
            <StarRating rating={Number(avgRating)} showCount={false} size="sm" className="mt-1" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              100% Recommended
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Based on {baseReviews.length} verified ratings
            </div>
          </div>
        </div>
      </div>

      {/* Scope Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <Tabs value={viewScope} onValueChange={(val) => setViewScope(val as 'my' | 'all')}>
          <TabsList>
            <TabsTrigger value="my">
              {role === 'student' ? 'My Reviews' : 'My Given Reviews'} ({myReviews.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Marketplace Reviews ({allReviews.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Star Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              ratingFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({baseReviews.length})
          </button>
          <button
            onClick={() => setRatingFilter('5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
              ratingFilter === '5'
                ? 'bg-amber-500 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            5 Stars ({fiveStarCount})
          </button>
          {fourStarCount > 0 && (
            <button
              onClick={() => setRatingFilter('4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                ratingFilter === '4'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              4 Stars ({fourStarCount})
            </button>
          )}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <p className="text-xs text-slate-400">No reviews found matching this filter.</p>
            <Link href="/browse" className="text-xs font-bold text-orange-600 hover:underline">
              Explore Marketplace →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedReviews.map((review) => (
              <Card key={review.id} className="p-5 space-y-3 hover:border-slate-300 transition-colors">
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
                      {review.client_org ? (
                        <div className="text-xs font-medium text-orange-600">{review.client_org}</div>
                      ) : (
                        <div className="text-xs text-slate-400">Verified Client</div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <StarRating rating={review.rating} showCount={false} size="sm" />
                    <span className="text-[10px] text-slate-400 block mt-0.5">{formatDate(review.created_at)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  &ldquo;{review.review_text}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Protected Booking
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {review.booking_id}
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
