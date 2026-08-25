import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { VerificationStatus } from '@/types';

interface VerificationBadgeProps {
  status?: VerificationStatus;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function VerificationBadge({
  status = 'verified',
  label,
  size = 'sm',
  className = '',
}: VerificationBadgeProps) {
  if (status === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
        } ${className}`}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        <span>{label || 'Verified Student'}</span>
      </span>
    );
  }

  if (status === 'under_review' || status === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
        } ${className}`}
      >
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
        <span>{label || 'Under Review'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      } ${className}`}
    >
      <AlertCircle className={size === 'sm' ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
      <span>{label || 'Unverified'}</span>
    </span>
  );
}
