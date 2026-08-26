'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '@/config/site';
import { DeliveryMode } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSkillSetuStore } from '@/lib/data/store';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostRequirementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostRequirementDialog({ open, onOpenChange }: PostRequirementDialogProps) {
  const store = useSkillSetuStore();
  const currentClient = store.getCurrentClient();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(5000);
  const [deadline, setDeadline] = useState('2026-09-15');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('online');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    store.addCommunityPost({
      title,
      category,
      description,
      budget: Number(budget),
      deadline,
      delivery_mode: deliveryMode,
      client_id: currentClient.id,
      client_name: currentClient.full_name,
      client_org: currentClient.organization_name,
      client_verified: currentClient.verification_status === 'verified',
      status: 'open',
    });

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {}

    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-600" />
                <span>Post a Student Requirement</span>
              </DialogTitle>
              <DialogDescription>
                Publish an opportunity to the verified student network. Verified students will respond with proposals.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Requirement Title</label>
              <Input
                required
                placeholder="e.g. Need Event Photographer for 2-Day College Fest"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Delivery Mode</label>
                <select
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="online">Online / Remote</option>
                  <option value="on_campus">On Campus / In-Person</option>
                  <option value="both">Flexible / Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Detailed Description & Scope</label>
              <Textarea
                required
                placeholder="Describe project deliverables, expected time commitment, format requirements, and timeline..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Target Budget (₹)</label>
                <Input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Application Deadline</label>
                <Input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="font-bold">
                Publish Opportunity
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Requirement Published!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Your requirement is live on the Community board. Verified students will submit quotes and proposals.
            </p>
            <Button type="button" variant="default" onClick={handleClose} className="mt-2">
              Back to Community
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
