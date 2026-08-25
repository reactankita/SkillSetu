'use client';

import React from 'react';
import Link from 'next/link';
import { CommunityPost } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useSkillSetuStore } from '@/lib/data/store';
import { formatINR, formatDate } from '@/lib/utils';
import { Check, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';

interface ResponsesDrawerProps {
  post: CommunityPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHireClick?: (studentId: string) => void;
}

export function ResponsesDrawer({ post, open, onOpenChange, onHireClick }: ResponsesDrawerProps) {
  const store = useSkillSetuStore();

  if (!post) return null;

  const responses = store.getCommunityResponses(post.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proposals Received ({responses.length})</DialogTitle>
          <DialogDescription className="truncate">
            Requirement: {post.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {responses.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No student proposals received yet for this requirement.
            </div>
          ) : (
            responses.map((resp) => (
              <div
                key={resp.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={resp.student_avatar}
                      alt={resp.student_name}
                      fallback={resp.student_name}
                      size="md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{resp.student_name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                        <span>{resp.student_college}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Proposed Quote</div>
                    <div className="text-base font-extrabold text-slate-900">
                      {formatINR(resp.proposed_rate)}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  {resp.proposal_text}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Submitted {formatDate(resp.created_at)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/students/${resp.student_id}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Portfolio</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        onOpenChange(false);
                        onHireClick?.(resp.student_id);
                      }}
                      className="text-xs font-bold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Hire Student
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
