'use client';

import React from 'react';
import { CommunityPost } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, Calendar, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';

interface CommunityPostCardProps {
  post: CommunityPost;
  role: 'student' | 'client' | 'admin';
  onApplyClick?: (post: CommunityPost) => void;
  onViewResponsesClick?: (post: CommunityPost) => void;
}

export function CommunityPostCard({
  post,
  role,
  onApplyClick,
  onViewResponsesClick,
}: CommunityPostCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {post.delivery_mode === 'online' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>Campus</span>
                </>
              )}
            </div>
          </div>

          {post.client_verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Client</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {post.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>

        {/* Client Meta */}
        <div className="text-xs text-slate-500 pt-1">
          Posted by <strong className="text-slate-800">{post.client_name}</strong>
          {post.client_org && <span> ({post.client_org})</span>}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Budget</div>
          <div className="text-base font-extrabold text-slate-900">
            {formatINR(post.budget)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Deadline: {formatDate(post.deadline)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role === 'student' ? (
            <Button
              size="sm"
              variant="default"
              onClick={() => onApplyClick?.(post)}
              className="text-xs font-bold px-3.5"
            >
              Apply & Quote
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewResponsesClick?.(post)}
              className="text-xs font-semibold"
            >
              <Users className="w-3.5 h-3.5 mr-1" />
              <span>{post.responses_count} Proposals</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
