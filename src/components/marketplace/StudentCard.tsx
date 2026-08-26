'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { StudentProfile } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/brand/StarRating';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { formatINR } from '@/lib/utils';

export function StudentCard({ student }: { student: StudentProfile }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={student.avatar_url}
              alt={student.full_name}
              fallback={student.full_name}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-bold text-slate-900">{student.full_name}</h4>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-orange-600" />
                <span className="truncate max-w-[170px]">{student.college}</span>
              </p>
            </div>
          </div>
          <VerificationBadge status={student.verification_status} size="sm" />
        </div>

        {/* Course & Location */}
        <div className="mt-3 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800">{student.course} ({student.year})</div>
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.location}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {student.about}
        </p>

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {student.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
          {student.skills.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium self-center">
              +{student.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-medium">Starting from</div>
          <div className="text-base font-extrabold text-slate-900">
            {formatINR(student.hourly_rate_base)}
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>
        </div>

        <Link
          href={`/students/${student.id}`}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
        >
          <span>Portfolio</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
