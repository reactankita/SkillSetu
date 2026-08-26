'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/brand/StarRating';
import { useSkillSetuStore } from '@/lib/data/store';
import { CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewModal({ booking, open, onOpenChange }: ReviewModalProps) {
  const store = useSkillSetuStore();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    store.addReview({
      bookingId: booking.id,
      rating,
      reviewText,
    });

    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch {}

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setReviewText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Review & Rate Student</DialogTitle>
              <DialogDescription>
                Share your verified feedback for {booking.student_name} on {booking.service_title}.
              </DialogDescription>
            </DialogHeader>

            {/* Star Picker */}
            <div className="text-center py-2 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Overall Rating
              </label>
              <StarRating
                rating={rating}
                size="lg"
                interactive
                showCount={false}
                onRatingChange={setRating}
                className="justify-center"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Your Written Review</label>
              <Textarea
                required
                placeholder="What did you like about the work? Was communication smooth and delivery on time?"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="font-bold">
                Submit Verified Review
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Thank You!</h3>
            <p className="text-xs text-slate-600">
              Your verified review has been published on {booking.student_name}&apos;s profile.
            </p>
            <Button type="button" variant="default" onClick={handleClose} className="mt-2">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
