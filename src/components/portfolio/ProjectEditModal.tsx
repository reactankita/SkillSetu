'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioProject, Service } from '@/types';
import { CATEGORIES } from '@/config/site';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Link as LinkIcon,
  Github,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface ProjectEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: PortfolioProject | null;
  services?: Service[];
  onSave: (projectData: Omit<PortfolioProject, 'id' | 'portfolio_id' | 'created_at'>) => void;
}

export function ProjectEditModal({
  open,
  onOpenChange,
  project,
  services = [],
  onSave,
}: ProjectEditModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [role, setRole] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [duration, setDuration] = useState('1 Month');
  const [completionDate, setCompletionDate] = useState('Jan 2025');
  const [clientOrg, setClientOrg] = useState('');
  const [projectOutcome, setProjectOutcome] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [connectedServiceId, setConnectedServiceId] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setCategory(project.category);
      setShortDescription(project.short_description);
      setDetailedDescription(project.detailed_description || '');
      setRole(project.role);
      setToolsInput(project.tools_used.join(', '));
      setDuration(project.duration);
      setCompletionDate(project.completion_date);
      setClientOrg(project.client_or_organization || '');
      setProjectOutcome(project.project_outcome);
      setCoverImageUrl(project.cover_image_url);
      setLiveUrl(project.live_url || '');
      setGithubUrl(project.github_url || '');
      setConnectedServiceId(project.connected_service_id || '');
      setIsFeatured(project.is_featured);
    } else {
      setTitle('');
      setCategory('Technology');
      setShortDescription('');
      setDetailedDescription('');
      setRole('');
      setToolsInput('React, Next.js, Tailwind CSS');
      setDuration('1 Month');
      setCompletionDate('Jan 2025');
      setClientOrg('');
      setProjectOutcome('');
      setCoverImageUrl('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80');
      setLiveUrl('');
      setGithubUrl('');
      setConnectedServiceId('');
      setIsFeatured(false);
    }
  }, [project, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title,
      category,
      short_description: shortDescription,
      detailed_description: detailedDescription,
      role: role || 'Lead Contributor',
      tools_used: tools,
      duration,
      completion_date: completionDate,
      client_or_organization: clientOrg || undefined,
      project_outcome: projectOutcome,
      cover_image_url: coverImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      media: [
        {
          id: `m-${Date.now()}`,
          type: 'image',
          url: coverImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
          title: title,
          is_cover: true,
        },
      ],
      live_url: liveUrl || undefined,
      github_url: githubUrl || undefined,
      connected_service_id: connectedServiceId || undefined,
      is_featured: isFeatured,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}</DialogTitle>
          <DialogDescription>
            Showcase your actual work, problem solving approach, tools used, and measurable results.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Project Title *</label>
              <Input
                required
                placeholder="e.g. Mood Indigo Fest Portal or College Sports Photography"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900">Short Summary *</label>
            <Input
              required
              placeholder="1–2 sentence overview of what you built or created"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Detailed Description & Context</label>
              <span className="text-[10px] text-slate-400">Problem, approach, and deliverables</span>
            </div>
            <Textarea
              rows={3}
              placeholder="Describe the background, how you solved the challenges, team structure, and what you delivered..."
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Role, Duration & Completion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Your Role *</label>
              <Input
                required
                placeholder="e.g. Lead Architect / Solo Photographer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Duration</label>
              <Input
                placeholder="e.g. 2 Months / 4 Days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Completion Date</label>
              <Input
                placeholder="e.g. Dec 2024"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Client / Organization & Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Client / Organization (Optional)</label>
              <Input
                placeholder="e.g. Mood Indigo / CarePlus Health / Self-Initiated"
                value={clientOrg}
                onChange={(e) => setClientOrg(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Tools & Skills (Comma separated) *</label>
              <Input
                required
                placeholder="e.g. Next.js, TypeScript, Figma, Sony A7"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Project Outcome with Guidance Hint */}
          <div className="p-3.5 rounded-xl border border-orange-200/80 bg-orange-50/40 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <label className="text-xs font-bold text-slate-900">Project Outcome & Impact *</label>
            </div>
            <p className="text-[11px] text-slate-500">
              Guidance: Explain what was achieved. Example: <em>&ldquo;Scaled to 85,000+ registered attendees with sub-100ms response times&rdquo;</em> or <em>&ldquo;Increased client Instagram engagement by 65% across 4 days.&rdquo;</em>
            </p>
            <Input
              required
              placeholder="e.g. Increased event registrations by 30% and processed 4,500 candidates"
              value={projectOutcome}
              onChange={(e) => setProjectOutcome(e.target.value)}
              className="text-xs bg-white"
            />
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Cover Image URL *</label>
              <span className="text-[10px] text-slate-400">Unsplash or hosted media link</span>
            </div>
            <Input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Links & Connected Service */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Live URL / Demo</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">GitHub / Source / Behance</label>
              <Input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900">Connect to Service</label>
              <select
                value={connectedServiceId}
                onChange={(e) => setConnectedServiceId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">None (Standalone project)</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Featured Project</span>
              <span className="text-slate-500 text-[11px]">Pin this project prominently at the top of your portfolio</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" size="sm" className="font-bold text-xs">
              {project ? 'Update Project' : 'Add to Portfolio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
