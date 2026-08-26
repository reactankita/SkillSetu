'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/brand/StarRating';
import { useSkillSetuStore } from '@/lib/data/store';
import { CheckCircle2, Star } from 'lucide-react';
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
      booking_id: booking.id,
      service_id: booking.service_id,
      student_id: booking.student_id,
      rating,
      review_text: reviewText,
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
              <DialogTitle className="text-slate-900 dark:text-slate-100">Review & Rate Student</DialogTitle>
              <DialogDescription>
                Share your verified feedback for {booking.student_name} on {booking.service_title}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 text-center py-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">Your Rating</label>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Public Review Comment</label>
              <Textarea
                required
                placeholder="Share your experience: quality of deliverable, communication, punctuality..."
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
                Submit Review
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Review Published!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Thank you for rating {booking.student_name}. Your review helps maintain high quality across SkillSetu.
            </p>
            <Button type="button" variant="default" onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
