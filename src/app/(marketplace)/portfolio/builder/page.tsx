'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSkillSetuStore } from '@/lib/data/store';
import {
  Portfolio,
  PortfolioProject,
  PortfolioTheme,
  PortfolioStatus,
  PortfolioExperience,
  PortfolioEducation,
  PortfolioCertification,
  PortfolioAchievement,
} from '@/types';
import { ProjectEditModal } from '@/components/portfolio/ProjectEditModal';
import { PortfolioThemeRenderer } from '@/components/portfolio/PortfolioThemeRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Sparkles,
  Eye,
  Save,
  Globe,
  Plus,
  Trash2,
  Edit,
  Smartphone,
  Monitor,
  CheckCircle2,
  Share2,
  ExternalLink,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PortfolioBuilderPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();
  const services = store.getServices().filter((s) => s.student_id === student.id);
  const existingPortfolio = store.getPortfolioByStudentId(student.id);

  // Form State
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
        id: `edu-default`,
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
  const [certifications, setCertifications] = useState<PortfolioCertification[]>(
    existingPortfolio?.certifications || []
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
  const [linkedinLink, setLinkedinLink] = useState(
    existingPortfolio?.social_links?.linkedin || ''
  );

  // Preview & Project Modal state
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [saveToast, setSaveToast] = useState('');

  // Experience modal inputs
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpOrg, setNewExpOrg] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // Achievement modal inputs
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchYear, setNewAchYear] = useState('2024');
  const [newAchDesc, setNewAchDesc] = useState('');

  const usernameSlug = student.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Assembled Live Portfolio Object
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
    certifications,
    achievements,
    contact_email: contactEmail,
    contact_phone: contactPhone,
    social_links: {
      github: githubLink,
      linkedin: linkedinLink,
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
    setSaveToast('Draft saved successfully.');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handlePublish = () => {
    if (!headline || !aboutBio) {
      alert('Please fill in your headline and about bio before publishing.');
      return;
    }

    store.savePortfolio({
      ...livePortfolio,
      status: 'published',
      published_at: new Date().toISOString(),
    });
    setStatus('published');

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    setSaveToast('Portfolio published to your public link!');
    setTimeout(() => setSaveToast(''), 4000);
  };

  const handleUnpublish = () => {
    store.unpublishPortfolio(student.id);
    setStatus('unpublished');
    setSaveToast('Portfolio unpublished.');
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
    if (!newExpRole || !newExpOrg) return;
    const newExp: PortfolioExperience = {
      id: `exp-${Date.now()}`,
      portfolio_id: existingPortfolio?.id || 'portfolio-temp',
      role: newExpRole,
      organization: newExpOrg,
      duration: newExpDuration || '2024 – 2025',
      description: newExpDesc,
      is_current: false,
    };
    setExperience([...experience, newExp]);
    setNewExpRole('');
    setNewExpOrg('');
    setNewExpDuration('');
    setNewExpDesc('');
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle) return;
    const newAch: PortfolioAchievement = {
      id: `ach-${Date.now()}`,
      portfolio_id: existingPortfolio?.id || 'portfolio-temp',
      title: newAchTitle,
      year: newAchYear,
      description: newAchDesc,
    };
    setAchievements([...achievements, newAch]);
    setNewAchTitle('');
    setNewAchDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Portfolio Builder
            </h1>
            <Badge
              variant={status === 'published' ? 'emerald' : 'secondary'}
              className="capitalize text-xs font-mono"
            >
              {status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Build your personal portfolio on SkillSetu — no external website needed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {saveToast && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in zoom-in-95">
              {saveToast}
            </span>
          )}

          <Button variant="outline" size="sm" onClick={handleSaveDraft} className="text-xs font-semibold">
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Draft
          </Button>

          {status === 'published' ? (
            <>
              <Link href={`/portfolio/${usernameSlug}`} target="_blank">
                <Button variant="outline" size="sm" className="text-xs font-semibold text-slate-700">
                  <ExternalLink className="w-3.5 h-3.5 mr-1 text-orange-600" />
                  Public Link
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleUnpublish}
                className="text-xs font-semibold"
              >
                Unpublish
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handlePublish}
              className="font-bold text-xs shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Publish Portfolio
            </Button>
          )}
        </div>
      </div>

      {/* Editor & Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Section Editor (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Theme & Design Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Portfolio Theme
              </span>
              <span className="text-[11px] text-slate-400">3 Restrained Layout Options</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'professional', label: 'Professional', desc: 'Navy Editorial' },
                { id: 'creative', label: 'Creative', desc: 'Visual Showcase' },
                { id: 'minimal', label: 'Minimal', desc: 'Swiss Typography' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id as PortfolioTheme)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block">{t.label}</span>
                  <span className={`text-[10px] ${theme === t.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tabbed Section Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-slate-100 px-4 pt-3 bg-slate-50/50">
                <TabsList className="bg-slate-100 p-1">
                  <TabsTrigger value="projects" className="text-xs font-bold">
                    Projects ({projects.length})
                  </TabsTrigger>
                  <TabsTrigger value="bio" className="text-xs font-bold">
                    Bio & Skills
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="text-xs font-bold">
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="text-xs font-bold">
                    Academics
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* 1. PROJECTS TAB */}
              <TabsContent value="projects" className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Featured Projects & Deliverables</h3>
                    <p className="text-xs text-slate-500">Add client work, fest productions, coding apps, or creative designs</p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectModalOpen(true);
                    }}
                    className="font-bold text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Project
                  </Button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/40">
                    <p className="text-xs text-slate-500">
                      No projects added yet. Show clients what you can build or deliver.
                    </p>
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div>💡 <em>Tip: Start with your best college project, fest photography, or freelance gig.</em></div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectModalOpen(true);
                      }}
                      className="text-xs font-bold"
                    >
                      Add Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                              {proj.category}
                            </span>
                            {proj.is_featured && (
                              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate">{proj.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{proj.short_description}</p>
                          {proj.project_outcome && (
                            <p className="text-[10px] text-emerald-700 font-medium line-clamp-1">
                              ✓ {proj.project_outcome}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectModalOpen(true);
                            }}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="h-7 w-7 p-0 text-rose-600 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* 2. BIO & SKILLS TAB */}
              <TabsContent value="bio" className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Professional Headline *</label>
                  <Input
                    required
                    placeholder="e.g. Full-Stack Web & Next.js Developer | IIT Bombay '26"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">About / Professional Bio *</label>
                  <Textarea
                    rows={4}
                    placeholder="Tell clients about your background, specializations, and what drives your work..."
                    value={aboutBio}
                    onChange={(e) => setAboutBio(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Skills & Tech Stack (comma separated)</label>
                  <Input
                    placeholder="e.g. React, Next.js, Figma, Python, Video Editing"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">Contact Email</label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">GitHub or Portfolio URL</label>
                    <Input
                      value={githubLink}
                      placeholder="https://github.com/..."
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 3. EXPERIENCE TAB */}
              <TabsContent value="experience" className="p-5 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Add Experience</h4>
                  <form onSubmit={handleAddExperience} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Role / Title (e.g. Frontend Intern)"
                        value={newExpRole}
                        onChange={(e) => setNewExpRole(e.target.value)}
                        className="text-xs bg-white"
                      />
                      <Input
                        placeholder="Organization (e.g. Razorpay / Club)"
                        value={newExpOrg}
                        onChange={(e) => setNewExpOrg(e.target.value)}
                        className="text-xs bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        placeholder="Duration (e.g. May 2025 – Jul 2025)"
                        value={newExpDuration}
                        onChange={(e) => setNewExpDuration(e.target.value)}
                        className="text-xs bg-white"
                      />
                      <Input
                        placeholder="Brief description of responsibilities"
                        value={newExpDesc}
                        onChange={(e) => setNewExpDesc(e.target.value)}
                        className="text-xs bg-white"
                      />
                    </div>
                    <Button type="submit" size="sm" variant="outline" className="text-xs font-bold">
                      Add Experience Entry
                    </Button>
                  </form>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-900">Recorded Experience ({experience.length})</h4>
                  {experience.map((exp) => (
                    <div key={exp.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div>
                        <strong>{exp.role}</strong> at <span className="text-orange-600 font-semibold">{exp.organization}</span>
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
              </TabsContent>

              {/* 4. ACADEMICS & ACHIEVEMENTS TAB */}
              <TabsContent value="education" className="p-5 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Education Details</h4>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div><strong>Course:</strong> {student.course}</div>
                    <div><strong>Institution:</strong> {student.college}</div>
                    <div><strong>Current Year:</strong> {student.year}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Add Achievement / Award</h4>
                  <form onSubmit={handleAddAchievement} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Title (e.g. Smart India Hackathon)"
                        value={newAchTitle}
                        onChange={(e) => setNewAchTitle(e.target.value)}
                        className="col-span-2 text-xs bg-white"
                      />
                      <Input
                        placeholder="Year (e.g. 2024)"
                        value={newAchYear}
                        onChange={(e) => setNewAchYear(e.target.value)}
                        className="text-xs bg-white"
                      />
                    </div>
                    <Input
                      placeholder="Description / Context"
                      value={newAchDesc}
                      onChange={(e) => setNewAchDesc(e.target.value)}
                      className="text-xs bg-white"
                    />
                    <Button type="submit" size="sm" variant="outline" className="text-xs font-bold">
                      Add Award Entry
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Preview (6 Cols) */}
        <div className="lg:col-span-6 space-y-3 sticky top-20">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-orange-600" />
              Live {theme} Theme Preview
            </span>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preview Viewport Container */}
          <div
            className={`border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-md max-h-[78vh] overflow-y-auto transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
          >
            <PortfolioThemeRenderer
              portfolio={livePortfolio}
              student={student}
              services={services}
              isOwner={true}
              onEditProject={(proj) => {
                setEditingProject(proj);
                setProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
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
