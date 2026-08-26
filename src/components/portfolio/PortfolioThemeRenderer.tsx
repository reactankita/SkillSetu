'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Portfolio,
  PortfolioProject,
  StudentProfile,
  Service,
} from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/brand/StarRating';
import { VerificationBadge } from '@/components/brand/VerificationBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  ExternalLink,
  Github,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Mail,
  Phone,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface PortfolioThemeRendererProps {
  portfolio: Portfolio;
  student: StudentProfile;
  services?: Service[];
  isOwner?: boolean;
  onEditProject?: (project: PortfolioProject) => void;
  onDeleteProject?: (projectId: string) => void;
  onBookService?: (service: Service) => void;
  previewMode?: boolean;
}

export function PortfolioThemeRenderer({
  portfolio,
  student,
  services = [],
  isOwner = false,
  onEditProject,
  onDeleteProject,
  onBookService,
  previewMode = false,
}: PortfolioThemeRendererProps) {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const theme = portfolio.theme || 'professional';

  // ============================================================================
  // THEME 1: PROFESSIONAL (Deep Navy Editorial Layout)
  // ============================================================================
  if (theme === 'professional') {
    return (
      <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-16">
        {/* Navy Header Strip */}
        <div className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar
                  src={student.avatar_url}
                  alt={student.full_name}
                  fallback={student.full_name}
                  size="xl"
                  className="ring-4 ring-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      {student.full_name}
                    </h1>
                    <VerificationBadge status={student.verification_status} size="sm" />
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 font-medium">
                    {portfolio.headline || `${student.course} | ${student.college}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                      {student.college}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {student.location}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-orange-400 font-bold">{student.skillsetu_id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                {services.length > 0 && onBookService && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onBookService(services[0])}
                    className="font-bold text-xs shadow-md"
                  >
                    Hire / Book Service
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rating</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <StarRating rating={student.rating} showCount={false} size="sm" />
                  <span className="text-xs font-extrabold text-white">({student.review_count})</span>
                </div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Projects</span>
                <span className="text-sm font-extrabold text-white mt-0.5 block">{portfolio.projects.length} Showcased</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                <span className="text-sm font-extrabold text-emerald-400 mt-0.5 block">{student.completed_bookings_count} Client Orders</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Availability</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                  {student.availability_days.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
          {/* About Section Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              About & Professional Background
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {portfolio.about_bio || student.about}
            </p>

            {/* Skills Chips */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-900 block mb-2">Core Skills & Tools:</span>
              <div className="flex flex-wrap gap-1.5">
                {(portfolio.skills.length > 0 ? portfolio.skills : student.skills).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Projects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Portfolio Projects</h2>
                <p className="text-xs text-slate-500">Real deliverables, case studies, and verified outcomes</p>
              </div>
              <Badge variant="navy" className="text-xs font-mono font-bold">
                {portfolio.projects.length} Projects
              </Badge>
            </div>

            {portfolio.projects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No projects added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Header */}
                      <div
                        className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProject(proj)}
                      >
                        <Image
                          src={proj.cover_image_url}
                          alt={proj.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                            {proj.category}
                          </span>
                          {proj.is_featured && (
                            <span className="text-[10px] font-extrabold bg-orange-600 text-white px-2 py-0.5 rounded-md">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3
                            className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors cursor-pointer"
                            onClick={() => setSelectedProject(proj)}
                          >
                            {proj.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {proj.short_description}
                          </p>
                        </div>

                        {/* Outcome Pill */}
                        {proj.project_outcome && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 leading-snug">
                            <strong className="text-emerald-950 font-bold block mb-0.5 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Outcome / Result:
                            </strong>
                            {proj.project_outcome}
                          </div>
                        )}

                        {/* Tools Chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.tools_used.slice(0, 4).map((tool) => (
                            <span
                              key={tool}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                            >
                              {tool}
                            </span>
                          ))}
                          {proj.tools_used.length > 4 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                              +{proj.tools_used.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-400 text-[11px] font-medium">
                        {proj.role} • {proj.completion_date}
                      </div>

                      <div className="flex items-center gap-2">
                        {isOwner && onEditProject && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditProject(proj)}
                            className="text-xs h-7 px-2.5"
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProject(proj)}
                          className="text-xs h-7 px-2 font-bold text-orange-600 hover:text-orange-700"
                        >
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Services Offered Strip */}
          {services.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Services Offered by {student.full_name.split(' ')[0]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase text-slate-500">{svc.category}</span>
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatINR(svc.price)}/{svc.pricing_unit.replace('per_', '')}
                        </span>
                      </div>
                      <Link
                        href={`/services/${svc.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
                      >
                        {svc.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{svc.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 capitalize">{svc.delivery_mode.replace('_', ' ')}</span>
                      {onBookService ? (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onBookService(svc)}
                          className="h-7 text-xs font-bold"
                        >
                          Book Now
                        </Button>
                      ) : (
                        <Link href={`/services/${svc.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs font-bold">
                            View Service
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-orange-600" />
                Experience & Roles
              </h3>
              {portfolio.experience.length === 0 ? (
                <p className="text-xs text-slate-400">No experience records added.</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {portfolio.experience.map((exp) => (
                    <div key={exp.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{exp.duration}</span>
                      </div>
                      <span className="text-xs text-orange-600 font-semibold block">{exp.organization}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education & Achievements */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Education & Achievements
              </h3>
              {portfolio.education.length === 0 && portfolio.achievements.length === 0 ? (
                <p className="text-xs text-slate-400">No academic entries recorded.</p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{edu.degree_or_course}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{edu.year}</span>
                      </div>
                      <span className="text-xs text-teal-600 font-semibold block">{edu.institution}</span>
                      {edu.grade_or_score && (
                        <span className="text-[11px] text-slate-500 block font-mono">{edu.grade_or_score}</span>
                      )}
                    </div>
                  ))}

                  {portfolio.achievements.map((ach) => (
                    <div key={ach.id} className="pt-3 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          {ach.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{ach.year}</span>
                      </div>
                      <p className="text-xs text-slate-600">{ach.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        />
      </div>
    );
  }

  // ============================================================================
  // THEME 2: CREATIVE (Visual Gallery & High-Impact Media Showcase)
  // ============================================================================
  if (theme === 'creative') {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 font-sans pb-16">
        {/* Creative Hero Banner */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-4">
              <Avatar
                src={student.avatar_url}
                alt={student.full_name}
                fallback={student.full_name}
                size="xl"
                className="ring-2 ring-orange-500"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">{student.full_name}</h1>
                  <VerificationBadge status={student.verification_status} size="sm" />
                </div>
                <p className="text-sm text-orange-400 font-medium">{portfolio.headline || student.course}</p>
                <div className="text-xs text-slate-400">
                  {student.college} • {student.location}
                </div>
              </div>
            </div>

            {services.length > 0 && onBookService && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onBookService(services[0])}
                className="font-bold text-xs shadow-md bg-orange-600 hover:bg-orange-500 text-white"
              >
                Hire Creative Talent
              </Button>
            )}
          </div>

          {/* About Creative */}
          <div className="max-w-3xl space-y-3">
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {portfolio.about_bio || student.about}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(portfolio.skills.length > 0 ? portfolio.skills : student.skills).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Gallery Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Featured Works & Creations</h2>
            <span className="text-xs font-mono text-orange-400">{portfolio.projects.length} Works</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 cursor-pointer hover:border-orange-500/60 transition-all flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                  <Image
                    src={proj.cover_image_url}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight drop-shadow-sm">
                      {proj.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-2.5 bg-slate-900/90">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.short_description}
                  </p>
                  {proj.project_outcome && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40 font-medium">
                      ✓ {proj.project_outcome}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>{proj.role}</span>
                    <span>{proj.completion_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
        />
      </div>
    );
  }

  // ============================================================================
  // THEME 3: MINIMAL (Clean Swiss Editorial Layout)
  // ============================================================================
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Minimal Header */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{student.full_name}</h1>
                <VerificationBadge status={student.verification_status} size="sm" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {portfolio.headline || `${student.course} — ${student.college}`}
              </p>
            </div>
            <Avatar
              src={student.avatar_url}
              alt={student.full_name}
              fallback={student.full_name}
              size="lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span>{student.college}</span>
            <span>/</span>
            <span>{student.location}</span>
            <span>/</span>
            <span className="text-orange-600 font-bold">{student.skillsetu_id}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
            {portfolio.about_bio || student.about}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {(portfolio.skills.length > 0 ? portfolio.skills : student.skills).map((s) => (
              <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-xs font-mono">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Minimal Projects List */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected Work</h2>

          <div className="space-y-6 divide-y divide-slate-100">
            {portfolio.projects.map((proj) => (
              <div
                key={proj.id}
                className="pt-6 first:pt-0 grid grid-cols-1 sm:grid-cols-3 gap-5 items-start cursor-pointer group"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="sm:col-span-1 relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={proj.cover_image_url}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {proj.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{proj.completion_date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.short_description}</p>
                  {proj.project_outcome && (
                    <p className="text-xs text-emerald-700 font-medium">✓ {proj.project_outcome}</p>
                  )}
                  <div className="text-[11px] font-mono text-slate-400">
                    {proj.role} • {proj.tools_used.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Education & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-slate-200">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Experience</h3>
            {portfolio.experience.map((exp) => (
              <div key={exp.id} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{exp.role}</div>
                <div className="text-slate-500 font-mono text-[11px]">{exp.organization} • {exp.duration}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Education</h3>
            {portfolio.education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{edu.degree_or_course}</div>
                <div className="text-slate-500 font-mono text-[11px]">{edu.institution} • {edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// PROJECT DETAIL MODAL / DRAWER
// ----------------------------------------------------------------------------
function ProjectDetailModal({
  project,
  open,
  onOpenChange,
}: {
  project: PortfolioProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {project.category}
            </span>
            {project.is_featured && (
              <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded">
                Featured
              </span>
            )}
          </div>
          <DialogTitle className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {project.role} • Completed {project.completion_date} {project.client_or_organization ? `for ${project.client_or_organization}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Cover Media */}
          <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Outcome Card */}
          {project.project_outcome && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Measurable Impact / Outcome:
              </span>
              <p className="leading-relaxed font-medium">{project.project_outcome}</p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Project Overview</h4>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {project.detailed_description || project.short_description}
            </p>
          </div>

          {/* Tools Used */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block">Tools, Skills & Stack:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools_used.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {(project.live_url || project.github_url) && (
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Preview / Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source Code / Gallery
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
