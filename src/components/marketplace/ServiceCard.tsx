import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Globe, Sparkles, Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { Service } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/brand/StarRating';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { formatINR } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onBookClick?: (service: Service) => void;
}

export function ServiceCard({ service, onBookClick }: ServiceCardProps) {
  const getUnitLabel = (unit: Service['pricing_unit']) => {
    switch (unit) {
      case 'per_hour':
        return '/hr';
      case 'per_project':
        return '/project';
      case 'per_session':
        return '/session';
      case 'per_item':
        return '/item';
      default:
        return '/hr';
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div>
        {/* Top Student Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
          <Link
            href={`/students/${service.student_id}`}
            className="flex items-center gap-3 min-w-0 group/student"
          >
            <Avatar
              src={service.student_avatar}
              alt={service.student_name}
              fallback={service.student_name}
              size="md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900 truncate group-hover/student:text-orange-600 transition-colors">
                  {service.student_name}
                </h4>
                {service.team_service && (
                  <Badge variant="teal" className="text-[10px] px-1.5 py-0">
                    Team
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate font-medium">
                {service.student_college}
              </p>
            </div>
          </Link>

          <VerificationBadge status="verified" size="sm" />
        </div>

        {/* Service Content */}
        <div className="pt-3.5 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
              {service.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              {service.delivery_mode === 'online' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Online</span>
                </>
              ) : service.delivery_mode === 'on_campus' ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>On Campus</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-teal-600" />
                  <span>Online / Campus</span>
                </>
              )}
            </div>
          </div>

          <Link href={`/services/${service.id}`} className="block group/title">
            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover/title:text-orange-600 transition-colors line-clamp-2">
              {service.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Skills Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {service.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium text-slate-700 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {service.skills.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium self-center">
                +{service.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Pricing & Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              {formatINR(service.price)}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {getUnitLabel(service.pricing_unit)}
            </span>
          </div>
          <StarRating
            rating={service.student_rating}
            reviewCount={service.student_review_count}
            size="sm"
            className="mt-0.5"
          />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/services/${service.id}`}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={() => onBookClick?.(service)}
            className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
