'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useSkillSetuStore } from '@/lib/data/store';

interface DisputeModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisputeModal({ booking, open, onOpenChange }: DisputeModalProps) {
  const store = useSkillSetuStore();
  const [issueType, setIssueType] = useState('Incomplete Deliverables');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    store.raiseDispute({
      booking_id: booking.id,
      issue_type: issueType,
      description,
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <span>Report an Issue</span>
              </DialogTitle>
              <DialogDescription>
                SkillSetu Moderation will review your case. Payment remains safely protected while the issue is evaluated.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Issue Category</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Incomplete Deliverables">Incomplete Deliverables</option>
                <option value="No-Show / Unresponsive">No-Show / Unresponsive</option>
                <option value="Quality Substantially Below Agreement">Quality Substantially Below Agreement</option>
                <option value="Timeline Missed Without Notice">Timeline Missed Without Notice</option>
                <option value="Other">Other Conflict</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Detailed Explanation</label>
              <Textarea
                required
                placeholder="Explain exactly what went wrong, what was agreed upon vs what was delivered..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Safety notice */}
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Payment Protected:</strong> The booking status is marked as Disputed. No funds will be released until resolution.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" className="font-bold">
                Submit Dispute Report
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Dispute Logged</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Our moderation team has received your ticket for {booking.booking_code}. You will receive an update in notifications.
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
