'use client';

import React, { useState } from 'react';
import { CommunityPost } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSkillSetuStore } from '@/lib/data/store';
import { CheckCircle2, Send } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface RespondDialogProps {
  post: CommunityPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RespondDialog({ post, open, onOpenChange }: RespondDialogProps) {
  const store = useSkillSetuStore();
  const [proposalText, setProposalText] = useState('');
  const [proposedRate, setProposedRate] = useState<number>(post?.budget || 3000);
  const [submitted, setSubmitted] = useState(false);

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) return;

    store.addCommunityResponse({
      post_id: post.id,
      proposal_text: proposalText,
      proposed_rate: Number(proposedRate),
    });

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setProposalText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-orange-600" />
                <span>Submit Proposal & Quote</span>
              </DialogTitle>
              <DialogDescription>
                Applying for: <strong className="text-slate-900 dark:text-slate-100">{post.title}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-700 dark:text-slate-300">
              <div><strong>Client:</strong> {post.client_name} {post.client_org ? `(${post.client_org})` : ''}</div>
              <div><strong>Target Budget:</strong> {formatINR(post.budget)}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Your Proposed Quote (₹)</label>
              <Input
                type="number"
                required
                min={200}
                value={proposedRate}
                onChange={(e) => setProposedRate(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Cover Note & Relevant Experience</label>
              <Textarea
                required
                placeholder="Explain why you're a great fit, link to similar work samples or portfolio pieces, and your turnaround timeline..."
                rows={4}
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="font-bold">
                Send Proposal
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Proposal Sent!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              {post.client_name} has received your quote of {formatINR(proposedRate)}. You will be notified if they accept or shortlist you.
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
