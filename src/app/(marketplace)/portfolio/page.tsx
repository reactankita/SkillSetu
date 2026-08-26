'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSkillSetuStore } from '@/lib/data/store';
import { Portfolio, PortfolioProject, PortfolioTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Briefcase,
  PlusCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Edit,
  Globe,
  Upload,
  Sparkles,
  ExternalLink,
  Award,
  GraduationCap,
  Calendar,
  Layers,
  FileCheck,
  RefreshCw,
  Share2,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Palette,
  Layout,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PortfolioBuilderPage() {
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();
  const existingPortfolio = store.getPortfolioByStudentId(student.id);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [headline, setHeadline] = useState(existingPortfolio?.headline || 'Senior Full-Stack Engineer & Next.js Specialist');
  const [about, setAbout] = useState(existingPortfolio?.about || student.about);
  const [skillsInput, setSkillsInput] = useState(existingPortfolio?.skills?.join(', ') || student.skills.join(', '));
  const [education, setEducation] = useState(existingPortfolio?.education || `${student.course}, ${student.college}`);
  const [experience, setExperience] = useState(existingPortfolio?.experience || student.experience);
  const [achievementsInput, setAchievementsInput] = useState(existingPortfolio?.achievements?.join('\n') || 'Smart India Hackathon 2025 National Winner\nDean\'s List of Academic Excellence');
  const [certificationsInput, setCertificationsInput] = useState(existingPortfolio?.certifications?.join('\n') || 'AWS Certified Cloud Practitioner\nMeta Front-End Developer Professional');
  const [servicesSummary, setServicesSummary] = useState(existingPortfolio?.services_summary || 'Full-Stack Web Development, Interactive UI, API Design');
  const [template, setTemplate] = useState<PortfolioTemplate>(existingPortfolio?.template || 'professional');
  const [status, setStatus] = useState<'draft' | 'published'>(existingPortfolio?.status || 'published');

  const [projects, setProjects] = useState<PortfolioProject[]>(existingPortfolio?.projects || []);

  // New Project Dialog State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('Technology');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectRole, setProjectRole] = useState('Lead Developer');
  const [projectSkillsInput, setProjectSkillsInput] = useState('React, Next.js, PostgreSQL');
  const [projectDate, setProjectDate] = useState('Jan 2026');
  const [projectOutcome, setProjectOutcome] = useState('Adopted by 3,000+ campus students with 99.9% uptime.');
  const [projectLink, setProjectLink] = useState('https://campusconnect.dev');
  const [projectImageUrl, setProjectImageUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');

  // Real Image Upload for Project
  const projectFileInputRef = useRef<HTMLInputElement | null>(null);
  const [projectUploading, setProjectUploading] = useState(false);
  const [projectUploadError, setProjectUploadError] = useState<string | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const parsedSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
  const parsedAchievements = achievementsInput.split('\n').map((a) => a.trim()).filter(Boolean);
  const parsedCertifications = certificationsInput.split('\n').map((c) => c.trim()).filter(Boolean);

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProjectUploadError(null);

      if (file.size > 5 * 1024 * 1024) {
        setProjectUploadError('Image size exceeds 5MB limit.');
        return;
      }

      setProjectUploading(true);
      setTimeout(() => {
        const previewUrl = URL.createObjectURL(file);
        setProjectImageUrl(previewUrl);
        setProjectUploading(false);
      }, 300);
    }
  };

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectCategory('Technology');
    setProjectDesc('');
    setProjectRole('Lead Developer / Designer');
    setProjectSkillsInput('React, Next.js, Figma');
    setProjectDate('2026');
    setProjectOutcome('Delivered on schedule with 100% client satisfaction.');
    setProjectLink('');
    setProjectImageUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80');
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = projectSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProjectId
            ? {
                ...p,
                title: projectTitle,
                category: projectCategory,
                description: projectDesc,
                role: projectRole,
                skills,
                date: projectDate,
                outcome: projectOutcome,
                image_url: projectImageUrl,
                project_link: projectLink,
              }
            : p
        )
      );
    } else {
      const newProj: PortfolioProject = {
        id: `proj-${Date.now()}`,
        title: projectTitle,
        category: projectCategory,
        description: projectDesc,
        role: projectRole,
        skills,
        date: projectDate,
        outcome: projectOutcome,
        image_url: projectImageUrl,
        project_link: projectLink,
      };
      setProjects((prev) => [newProj, ...prev]);
    }

    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditProject = (proj: PortfolioProject) => {
    setEditingProjectId(proj.id);
    setProjectTitle(proj.title);
    setProjectCategory(proj.category);
    setProjectDesc(proj.description);
    setProjectRole(proj.role);
    setProjectSkillsInput(proj.skills.join(', '));
    setProjectDate(proj.date);
    setProjectOutcome(proj.outcome);
    setProjectLink(proj.project_link || '');
    setProjectImageUrl(proj.image_url || '');
    setProjectModalOpen(true);
  };

  const handleSavePortfolio = (publish: boolean = false) => {
    const nextStatus = publish ? 'published' : 'draft';
    setStatus(nextStatus);

    store.savePortfolio({
      student_id: student.id,
      headline,
      about,
      skills: parsedSkills,
      education,
      experience,
      achievements: parsedAchievements,
      certifications: parsedCertifications,
      services_summary: servicesSummary,
      template,
      status: nextStatus,
      projects,
    });

    if (publish) {
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Preview Object
  const currentPortfolio: Portfolio = {
    id: existingPortfolio?.id || 'preview-portfolio',
    student_id: student.id,
    headline,
    about,
    skills: parsedSkills,
    education,
    experience,
    achievements: parsedAchievements,
    certifications: parsedCertifications,
    services_summary: servicesSummary,
    template,
    status,
    projects,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Student Portfolio Builder
            </h1>
            <Badge variant={status === 'published' ? 'emerald' : 'secondary'} className="text-xs capitalize">
              {status}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showcase your projects, achievements, and deliverables directly on your verified SkillSetu profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Tab Toggle */}
          <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${
                activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-bold rounded-lg ${
                activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
              }`}
            >
              Live Preview
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSavePortfolio(false)}
            className="text-xs font-semibold"
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => handleSavePortfolio(true)}
            className="text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Publish Portfolio
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Portfolio saved successfully! {status === 'published' ? 'Now visible on your public profile.' : 'Saved as private draft.'}</span>
          </div>
          <Link href={`/students/${student.id}`} className="text-emerald-900 dark:text-emerald-200 underline font-extrabold text-xs">
            View Public Profile →
          </Link>
        </div>
      )}

      {/* Main Builder Grid: Left Editor (2 cols) | Right Live Preview (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: PORTFOLIO FORM & PROJECTS EDITOR (7 Cols) */}
        <div className={`lg:col-span-6 space-y-6 ${activeTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
          {/* 1. Template & Theme Style */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-4 h-4 text-orange-600" />
              <span>Select Portfolio Template</span>
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'professional', label: 'Professional', desc: 'Clean corporate layout' },
                { id: 'creative', label: 'Creative', desc: 'Visual media cards' },
                { id: 'minimal', label: 'Minimal', desc: 'High typography focus' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id as PortfolioTemplate)}
                  className={`p-3 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    template === t.id
                      ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <span className="text-xs font-bold block">{t.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Bio & Headline */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              1. Professional Overview
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Professional Headline</label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer & Next.js Specialist"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">About Bio & Story</label>
              <Textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell clients about your background, tools, and turnaround time..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Skills & Tech Stack (comma separated)</label>
              <Input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, Next.js, TypeScript, PostgreSQL"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Education & College</label>
                <Input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Experience & Internships</label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 3. Projects Showcase */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">2. Featured Projects ({projects.length})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add deliverables, live links, and case studies</p>
              </div>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleOpenAddProject}
                className="text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Add Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-500">You don&apos;t have any projects in your portfolio yet.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenAddProject}
                  className="text-xs font-semibold"
                >
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {proj.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{proj.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{proj.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.skills.map((sk) => (
                          <span key={sk} className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProject(proj)}
                        className="h-7 text-xs px-2"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="h-7 text-xs px-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Achievements & Certifications */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              3. Achievements & Certifications
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Key Achievements (one per line)</label>
              <Textarea
                rows={3}
                value={achievementsInput}
                onChange={(e) => setAchievementsInput(e.target.value)}
                placeholder="Smart India Hackathon 2025 National Winner"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Certifications (one per line)</label>
              <Textarea
                rows={3}
                value={certificationsInput}
                onChange={(e) => setCertificationsInput(e.target.value)}
                placeholder="AWS Certified Cloud Practitioner"
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE RESPONSIVE PREVIEW (5 Cols) */}
        <div className={`lg:col-span-6 space-y-4 sticky top-20 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1 text-orange-600">
              <Eye className="w-4 h-4" /> Live Profile Preview ({template})
            </span>
            <span className="text-[11px] font-mono capitalize">Status: {status}</span>
          </div>

          {/* PREVIEW CONTAINER CARD */}
          <div className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-md transition-all ${
            template === 'creative' ? 'border-teal-200 dark:border-teal-900' : ''
          }`}>
            {/* Header Banner */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 relative">
                    <Image
                      src={student.avatar_url}
                      alt={student.full_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{student.full_name}</h3>
                    <p className="text-xs text-orange-400 font-semibold">{headline}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{student.college} • {student.year}</p>
                  </div>
                </div>

                <Badge variant="emerald" className="text-[10px]">Verified Student</Badge>
              </div>

              <div className="pt-2 border-t border-slate-700/80 flex flex-wrap gap-1.5">
                {parsedSkills.slice(0, 5).map((sk) => (
                  <span key={sk} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
              {/* About Section */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">About Me</h4>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">{about}</p>
              </div>

              {/* Projects Grid Preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  Featured Projects ({projects.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between"
                    >
                      {p.image_url && (
                        <div className="h-28 w-full relative bg-slate-200">
                          <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-3 space-y-1.5 flex-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{p.category}</span>
                          <span>{p.date}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.title}</h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{p.description}</p>
                        {p.outcome && (
                          <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                            ✓ {p.outcome}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Credentials */}
              {parsedAchievements.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Key Achievements</h4>
                  <ul className="space-y-1">
                    {parsedAchievements.map((ach) => (
                      <li key={ach} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Award className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT CREATOR / EDITOR MODAL */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProjectId ? 'Edit Project Case Study' : 'Add Project to Portfolio'}</DialogTitle>
            <DialogDescription>
              Detail your deliverables, tools, outcomes, and attach project screenshots.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProject} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Project Title</label>
              <Input
                required
                placeholder="e.g. CampusConnect — Decentralized Resource Hub"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Category</label>
                <Input
                  required
                  placeholder="Technology / Photography"
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Year / Date</label>
                <Input
                  placeholder="e.g. Jan 2026"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Description & Problem Solved</label>
              <Textarea
                rows={3}
                required
                placeholder="What did this project do? What was the client requirement?"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Your Role</label>
                <Input
                  placeholder="e.g. Lead Architect"
                  value={projectRole}
                  onChange={(e) => setProjectRole(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Live Project URL (Optional)</label>
                <Input
                  placeholder="https://..."
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Skills / Tools Used (comma separated)</label>
              <Input
                placeholder="React, Next.js, Tailwind, PostgreSQL"
                value={projectSkillsInput}
                onChange={(e) => setProjectSkillsInput(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Measurable Outcome / Result</label>
              <Input
                placeholder="e.g. 3,000+ active users, 1st place hackathon prize"
                value={projectOutcome}
                onChange={(e) => setProjectOutcome(e.target.value)}
              />
            </div>

            {/* REAL PROJECT IMAGE UPLOAD */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Project Screenshot / Sample Image</label>
              <input
                type="file"
                ref={projectFileInputRef}
                onChange={handleProjectImageUpload}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => projectFileInputRef.current?.click()}
                  className="text-xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  {projectUploading ? 'Uploading...' : 'Upload Image File'}
                </Button>
                <span className="text-[11px] text-slate-400">or provide image URL below</span>
              </div>
              {projectUploadError && <p className="text-xs text-rose-500">{projectUploadError}</p>}
              <Input
                placeholder="https://images.unsplash.com/..."
                value={projectImageUrl}
                onChange={(e) => setProjectImageUrl(e.target.value)}
                className="text-xs mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" size="sm" onClick={() => setProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" size="sm" className="font-bold text-xs">
                Save Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
