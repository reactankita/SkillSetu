'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSkillSetuStore } from '@/lib/data/store';
import {
  Portfolio,
  PortfolioProject,
  PortfolioTheme,
  PortfolioStatus,
  PortfolioExperience,
  PortfolioEducation,
  PortfolioAchievement,
} from '@/types';
import { ProjectEditModal } from '@/components/portfolio/ProjectEditModal';
import { PortfolioThemeRenderer } from '@/components/portfolio/PortfolioThemeRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Save,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Smartphone,
  Monitor,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PortfolioBuilderPage() {
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();
  const services = store.getServices().filter((s) => s.student_id === student.id);
  const existingPortfolio = store.getPortfolioByStudentId(student.id);

  // Form States
  const [headline, setHeadline] = useState(
    existingPortfolio?.headline || `${student.course} | ${student.college}`
  );
  const [aboutBio, setAboutBio] = useState(
    existingPortfolio?.about_bio || student.about || ''
  );
  const [theme, setTheme] = useState<PortfolioTheme>(
    existingPortfolio?.theme || 'professional'
  );
  const [status, setStatus] = useState<PortfolioStatus>(
    existingPortfolio?.status || 'draft'
  );
  const [skillsInput, setSkillsInput] = useState(
    (existingPortfolio?.skills || student.skills).join(', ')
  );
  const [projects, setProjects] = useState<PortfolioProject[]>(
    existingPortfolio?.projects || []
  );
  const [experience, setExperience] = useState<PortfolioExperience[]>(
    existingPortfolio?.experience || []
  );
  const [education, setEducation] = useState<PortfolioEducation[]>(
    existingPortfolio?.education || [
      {
        id: 'edu-default',
        portfolio_id: existingPortfolio?.id || 'portfolio-temp',
        degree_or_course: student.course,
        institution: student.college,
        year: student.year,
      },
    ]
  );
  const [achievements, setAchievements] = useState<PortfolioAchievement[]>(
    existingPortfolio?.achievements || []
  );
  const [contactEmail, setContactEmail] = useState(
    existingPortfolio?.contact_email || student.email || ''
  );
  const [contactPhone, setContactPhone] = useState(
    existingPortfolio?.contact_phone || student.phone || ''
  );
  const [githubLink, setGithubLink] = useState(
    existingPortfolio?.social_links?.github || ''
  );

  // Collapsible Accordion sections
  const [expandedSection, setExpandedSection] = useState<string>('projects');

  // Preview & Modal States
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Experience input form
  const [expRole, setExpRole] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Achievement input form
  const [achTitle, setAchTitle] = useState('');
  const [achYear, setAchYear] = useState('2024');
  const [achDesc, setAchDesc] = useState('');

  const usernameSlug = student.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Live Assembled Portfolio Object
  const livePortfolio: Portfolio = {
    id: existingPortfolio?.id || 'portfolio-temp',
    student_id: student.id,
    username: usernameSlug,
    headline,
    about_bio: aboutBio,
    theme,
    status,
    skills: skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    projects,
    experience,
    education,
    certifications: existingPortfolio?.certifications || [],
    achievements,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    social_links: {
      github: githubLink,
    },
    views_count: existingPortfolio?.views_count || 0,
    published_at: existingPortfolio?.published_at,
    updated_at: new Date().toISOString(),
    created_at: existingPortfolio?.created_at || new Date().toISOString(),
  };

  const handleSaveDraft = () => {
    store.savePortfolio({
      ...livePortfolio,
      status: 'draft',
    });
    setStatus('draft');
    setSaveToast('Draft saved successfully');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handlePublish = () => {
    if (!headline || !aboutBio) {
      alert('Please fill in your professional headline and bio before publishing.');
      return;
    }

    store.savePortfolio({
      ...livePortfolio,
      status: 'published',
      published_at: new Date().toISOString(),
    });
    setStatus('published');

    try {
      confetti({ particleCount: 60, spread: 55 });
    } catch {}

    setSaveToast('Portfolio published! Live at your public link.');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleUnpublish = () => {
    store.unpublishPortfolio(student.id);
    setStatus('unpublished');
    setSaveToast('Portfolio unpublished');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleSaveProject = (
    projectData: Omit<PortfolioProject, 'id' | 'portfolio_id' | 'created_at'>
  ) => {
    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id ? { ...p, ...projectData } : p
      );
      setProjects(updated);
      store.updatePortfolioProject(student.id, editingProject.id, projectData);
    } else {
      const newProj: PortfolioProject = {
        ...projectData,
        id: `proj-${Date.now()}`,
        portfolio_id: existingPortfolio?.id || 'portfolio-temp',
        created_at: new Date().toISOString(),
      };
      setProjects([newProj, ...projects]);
      store.addPortfolioProject(student.id, projectData);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    store.deletePortfolioProject(student.id, projectId);
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole || !expOrg) return;
    const newExp: PortfolioExperience = {
      id: `exp-${Date.now()}`,
      portfolio_id: existingPortfolio?.id || 'portfolio-temp',
      role: expRole,
      organization: expOrg,
      duration: expDuration || '2024 – 2025',
      description: expDesc,
      is_current: false,
    };
    setExperience([...experience, newExp]);
    setExpRole('');
    setExpOrg('');
    setExpDuration('');
    setExpDesc('');
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achTitle) return;
    const newAch: PortfolioAchievement = {
      id: `ach-${Date.now()}`,
      portfolio_id: existingPortfolio?.id || 'portfolio-temp',
      title: achTitle,
      year: achYear,
      description: achDesc,
    };
    setAchievements([...achievements, newAch]);
    setAchTitle('');
    setAchDesc('');
  };

  const toggleSection = (sec: string) => {
    setExpandedSection(expandedSection === sec ? '' : sec);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Portfolio Builder</h1>
            <Badge
              variant={status === 'published' ? 'emerald' : 'secondary'}
              className="text-[10px] uppercase font-bold tracking-wider"
            >
              {status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Public Link: <span className="text-orange-600 font-bold">skillsetu.app/portfolio/{usernameSlug}</span>
          </p>
        </div>

        {/* Action Controls & Theme Selector */}
        <div className="flex items-center gap-3 flex-wrap self-stretch md:self-auto justify-between md:justify-end">
          {saveToast && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {saveToast}
            </span>
          )}

          {/* Compact Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['professional', 'creative', 'minimal'] as PortfolioTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  theme === t
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="text-xs font-bold h-9">
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Draft
          </Button>

          {status === 'published' ? (
            <div className="flex items-center gap-2">
              <Link href={`/portfolio/${usernameSlug}`} target="_blank">
                <Button variant="outline" size="sm" className="text-xs font-bold h-9">
                  <ExternalLink className="w-3.5 h-3.5 mr-1 text-orange-600" />
                  View Public
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleUnpublish} className="text-xs font-semibold h-9">
                Unpublish
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={handlePublish} className="font-bold text-xs h-9 shadow-xs">
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Publish Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Editor & Preview 55% / 45% Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Section-Based Clean Editor (55% -> 7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* SECTION 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                1. Basic Information & Headline
              </span>
              {expandedSection === 'basic' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'basic' && (
              <div className="p-5 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Professional Headline *</label>
                  <Input
                    required
                    placeholder="e.g. Full-Stack Web & Next.js Developer | IIT Bombay '26"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900">Contact Email</label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900">GitHub or Behance URL</label>
                    <Input
                      placeholder="https://github.com/..."
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: About & Skills */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('about')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                2. About Bio & Core Skills
              </span>
              {expandedSection === 'about' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'about' && (
              <div className="p-5 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">About Me / Bio *</label>
                  <Textarea
                    rows={4}
                    placeholder="Tell clients about your background, specializations, and what drives your work..."
                    value={aboutBio}
                    onChange={(e) => setAboutBio(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-900">Skills & Tooling (Comma separated)</label>
                  <Input
                    placeholder="e.g. React, Next.js, Figma, Python, Video Editing, Studio Lighting"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Projects (CORE) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('projects')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Portfolio Projects ({projects.length})
                </span>
              </div>
              {expandedSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'projects' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Showcase technical & creative work, fests, coding apps, and designs</p>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectModalOpen(true);
                    }}
                    className="text-xs font-bold h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Project
                  </Button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center space-y-2.5 bg-slate-50/40">
                    <p className="text-xs text-slate-600 font-semibold">No projects added yet.</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Start with a college fest production, course project, graphic set, tutoring guide, or freelance app.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectModalOpen(true);
                      }}
                      className="text-xs font-bold"
                    >
                      Add First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                            <Image
                              src={proj.cover_image_url}
                              alt={proj.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold uppercase bg-slate-100 px-1.5 py-0.2 rounded text-slate-600">
                                {proj.category}
                              </span>
                              {proj.is_featured && (
                                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{proj.title}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{proj.short_description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectModalOpen(true);
                            }}
                            className="h-7 w-7 p-0 text-slate-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="h-7 w-7 p-0 text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 4: Experience & Roles */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('experience')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                4. Experience & Roles ({experience.length})
              </span>
              {expandedSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'experience' && (
              <div className="p-5 space-y-3.5">
                <form onSubmit={handleAddExperience} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Role (e.g. Frontend Intern)"
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      className="text-xs bg-white"
                    />
                    <Input
                      placeholder="Organization (e.g. Razorpay)"
                      value={expOrg}
                      onChange={(e) => setExpOrg(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Duration (e.g. May 2025 – Jul 2025)"
                      value={expDuration}
                      onChange={(e) => setExpDuration(e.target.value)}
                      className="text-xs bg-white"
                    />
                    <Input
                      placeholder="Summary of responsibilities"
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                  <Button type="submit" size="sm" variant="outline" className="text-xs font-bold">
                    Add Experience Entry
                  </Button>
                </form>

                {experience.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <strong>{exp.role}</strong> • <span className="text-orange-600 font-semibold">{exp.organization}</span>
                      <span className="text-slate-400 block text-[11px]">{exp.duration}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExperience(experience.filter((x) => x.id !== exp.id))}
                      className="text-rose-600 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 5: Education & Academics */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('education')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                5. Education & Academics
              </span>
              {expandedSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'education' && (
              <div className="p-5 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div><strong>Degree / Course:</strong> {student.course}</div>
                  <div><strong>Institution:</strong> {student.college}</div>
                  <div><strong>Year:</strong> {student.year}</div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: Achievements & Awards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('achievements')}
              className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50/70 hover:bg-slate-50 transition-colors text-left cursor-pointer border-b border-slate-100"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                6. Achievements & Awards ({achievements.length})
              </span>
              {expandedSection === 'achievements' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {expandedSection === 'achievements' && (
              <div className="p-5 space-y-3.5">
                <form onSubmit={handleAddAchievement} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Award Title (e.g. Smart India Hackathon)"
                      value={achTitle}
                      onChange={(e) => setAchTitle(e.target.value)}
                      className="col-span-2 text-xs bg-white"
                    />
                    <Input
                      placeholder="Year"
                      value={achYear}
                      onChange={(e) => setAchYear(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                  <Input
                    placeholder="Short description / context"
                    value={achDesc}
                    onChange={(e) => setAchDesc(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <Button type="submit" size="sm" variant="outline" className="text-xs font-bold">
                    Add Award
                  </Button>
                </form>

                {achievements.map((ach) => (
                  <div key={ach.id} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <strong>{ach.title}</strong> ({ach.year})
                      {ach.description && <span className="text-slate-400 block text-[11px]">{ach.description}</span>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAchievements(achievements.filter((a) => a.id !== ach.id))}
                      className="text-rose-600 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live Portfolio Website Preview (45% -> 5 Cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          {/* Simulated Browser Frame Bar */}
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="font-mono text-[11px] text-slate-300 ml-2 truncate max-w-[180px]">
                skillsetu.app/portfolio/{usernameSlug}
              </span>
            </div>

            {/* Desktop / Mobile Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Browser Window Viewport */}
          <div
            className={`border border-t-0 border-slate-300 rounded-b-2xl overflow-hidden bg-white shadow-md max-h-[76vh] overflow-y-auto ${
              previewDevice === 'mobile' ? 'max-w-xs mx-auto border-x' : 'w-full'
            }`}
          >
            <PortfolioThemeRenderer
              portfolio={livePortfolio}
              student={student}
              services={services}
              isOwner={true}
              previewMode={true}
            />
          </div>
        </div>
      </div>

      {/* Project Creator / Editor Dialog */}
      <ProjectEditModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        project={editingProject}
        services={services}
        onSave={handleSaveProject}
      />
    </div>
  );
}
