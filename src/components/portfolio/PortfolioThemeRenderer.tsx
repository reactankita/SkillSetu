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
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle2,
  Mail,
  Phone,
  ArrowRight,
  Globe,
  Star,
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
  // THEME 1: PROFESSIONAL (Deep Navy & Clean Editorial Layout)
  // ============================================================================
  if (theme === 'professional') {
    return (
      <div className="bg-white min-h-full text-slate-900 font-sans pb-16">
        {/* Navy Editorial Header Banner */}
        <div className="bg-slate-900 text-white pt-10 pb-12 px-6 sm:px-10 border-b border-slate-800">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <Avatar
                  src={student.avatar_url}
                  alt={student.full_name}
                  fallback={student.full_name}
                  size="xl"
                  className="ring-2 ring-slate-700"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">
                      {student.full_name}
                    </h1>
                    <VerificationBadge status={student.verification_status} size="sm" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">
                    {portfolio.headline || `${student.course} | ${student.college}`}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-400" />
                      {student.college}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {student.location}
                    </span>
                  </div>
                </div>
              </div>

              {services.length > 0 && onBookService && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onBookService(services[0])}
                  className="font-bold text-xs shadow-sm bg-orange-600 hover:bg-orange-500 text-white"
                >
                  Book / Hire
                </Button>
              )}
            </div>

            {/* Quick Skills Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
              {(portfolio.skills.length > 0 ? portfolio.skills : student.skills).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8 space-y-10">
          {/* About Section */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">About Me</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              {portfolio.about_bio || student.about}
            </p>
          </div>

          {/* Featured Projects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Featured Projects ({portfolio.projects.length})
              </h2>
            </div>

            {portfolio.projects.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No portfolio projects added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => setSelectedProject(proj)}
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={proj.cover_image_url}
                          alt={proj.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 text-white px-2 py-0.5 rounded">
                            {proj.category}
                          </span>
                          {proj.is_featured && (
                            <span className="text-[10px] font-extrabold bg-orange-600 text-white px-2 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {proj.short_description}
                        </p>

                        {proj.project_outcome && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-100 font-medium">
                            ✓ {proj.project_outcome}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[11px]">{proj.role} • {proj.completion_date}</span>
                      <span className="text-orange-600 font-bold text-xs hover:underline">View →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
            {/* Experience */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-orange-600" />
                Experience & Roles
              </h3>
              {portfolio.experience.length === 0 ? (
                <p className="text-xs text-slate-400">No experience records added.</p>
              ) : (
                <div className="space-y-3">
                  {portfolio.experience.map((exp) => (
                    <div key={exp.id} className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{exp.role}</div>
                      <div className="text-orange-600 font-medium">{exp.organization} • <span className="text-slate-400 font-normal">{exp.duration}</span></div>
                      {exp.description && <p className="text-slate-600 leading-relaxed mt-0.5">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education & Achievements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                Education & Achievements
              </h3>
              <div className="space-y-3">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="text-xs space-y-0.5">
                    <div className="font-bold text-slate-900">{edu.degree_or_course}</div>
                    <div className="text-slate-500">{edu.institution} • {edu.year}</div>
                  </div>
                ))}

                {portfolio.achievements.map((ach) => (
                  <div key={ach.id} className="text-xs space-y-0.5 pt-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {ach.title} ({ach.year})
                    </div>
                    {ach.description && <p className="text-slate-500">{ach.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact / Availability Footer */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 block">Available for Freelance & Project Inquiries</span>
              <span>Based in {student.location} • Verified on SkillSetu ({student.skillsetu_id})</span>
            </div>
            {portfolio.contact_email && (
              <a
                href={`mailto:${portfolio.contact_email}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                {portfolio.contact_email}
              </a>
            )}
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
  // THEME 2: CREATIVE (Visual Gallery Layout)
  // ============================================================================
  if (theme === 'creative') {
    return (
      <div className="bg-slate-950 min-h-full text-slate-100 font-sans pb-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-10 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
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
                  <h1 className="text-2xl font-extrabold text-white">{student.full_name}</h1>
                  <VerificationBadge status={student.verification_status} size="sm" />
                </div>
                <p className="text-xs text-orange-400 font-medium">{portfolio.headline || student.course}</p>
                <div className="text-xs text-slate-400">{student.college} • {student.location}</div>
              </div>
            </div>

            {services.length > 0 && onBookService && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onBookService(services[0])}
                className="font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white"
              >
                Book Creative Work
              </Button>
            )}
          </div>

          {/* About */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {portfolio.about_bio || student.about}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(portfolio.skills.length > 0 ? portfolio.skills : student.skills).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects Visual Gallery */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Work & Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/70 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full bg-slate-950">
                    <Image
                      src={proj.cover_image_url}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-950/80 text-white px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h3 className="text-xs font-bold text-white line-clamp-1">{proj.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{proj.short_description}</p>
                    {proj.project_outcome && (
                      <p className="text-[10px] text-emerald-400 font-medium line-clamp-1">
                        ✓ {proj.project_outcome}
                      </p>
                    )}
                  </div>
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

  // ============================================================================
  // THEME 3: MINIMAL (Clean Swiss Typography Layout)
  // ============================================================================
  return (
    <div className="bg-white min-h-full text-slate-900 font-sans pb-16">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{student.full_name}</h1>
                <VerificationBadge status={student.verification_status} size="sm" />
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
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

          <div className="text-xs text-slate-500 font-mono">
            {student.college} • {student.location}
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
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
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected Projects</h2>
          <div className="space-y-4 divide-y divide-slate-100">
            {portfolio.projects.map((proj) => (
              <div
                key={proj.id}
                className="pt-4 first:pt-0 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start cursor-pointer group"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={proj.cover_image_url}
                    alt={proj.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {proj.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{proj.completion_date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{proj.short_description}</p>
                  {proj.project_outcome && (
                    <p className="text-xs text-emerald-700 font-medium">✓ {proj.project_outcome}</p>
                  )}
                </div>
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
// PROJECT DETAIL MODAL
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
          <DialogTitle className="text-lg font-extrabold text-slate-900 mt-1">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {project.role} • Completed {project.completion_date} {project.client_or_organization ? `for ${project.client_or_organization}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="relative h-60 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {project.project_outcome && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Measurable Impact / Result:
              </span>
              <p className="leading-relaxed font-medium">{project.project_outcome}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Project Overview</h4>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {project.detailed_description || project.short_description}
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-900 block">Tools & Tech:</span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools_used.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {(project.live_url || project.github_url) && (
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Preview
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Source Code
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
