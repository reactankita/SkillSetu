'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '@/config/site';
import { CommunityPost } from '@/types';
import { useSkillSetuStore } from '@/lib/data/store';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { PostRequirementDialog } from '@/components/community/PostRequirementDialog';
import { RespondDialog } from '@/components/community/RespondDialog';
import { ResponsesDrawer } from '@/components/community/ResponsesDrawer';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, MessageSquare, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CommunityPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const posts = store.getCommunityPosts();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [postRequirementOpen, setPostRequirementOpen] = useState(false);
  const [selectedPostForApply, setSelectedPostForApply] = useState<CommunityPost | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedPostForResponses, setSelectedPostForResponses] = useState<CommunityPost | null>(null);
  const [responsesDrawerOpen, setResponsesDrawerOpen] = useState(false);

  const handleApplyClick = (post: CommunityPost) => {
    setSelectedPostForApply(post);
    setApplyDialogOpen(true);
  };

  const handleViewResponsesClick = (post: CommunityPost) => {
    setSelectedPostForResponses(post);
    setResponsesDrawerOpen(true);
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchClient = p.client_name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchClient) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Opportunity Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Clients post urgent requirements, fest gigs, and project briefs. Verified students respond with custom quotes.
          </p>
        </div>

        {role === 'client' && (
          <Button
            variant="default"
            onClick={() => setPostRequirementOpen(true)}
            className="font-bold text-xs shadow-xs"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Post Requirement
          </Button>
        )}
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search requirements, keywords, organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Opportunities ({posts.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-xs text-slate-400">No opportunities found in this category.</p>
          {role === 'client' && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setPostRequirementOpen(true)}
              className="text-xs font-bold"
            >
              Post First Requirement
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              role={role}
              onApplyClick={handleApplyClick}
              onViewResponsesClick={handleViewResponsesClick}
            />
          ))}
        </div>
      )}

      {/* Post Requirement Dialog */}
      <PostRequirementDialog
        open={postRequirementOpen}
        onOpenChange={setPostRequirementOpen}
      />

      {/* Student Apply Dialog */}
      <RespondDialog
        post={selectedPostForApply}
        open={applyDialogOpen}
        onOpenChange={setApplyDialogOpen}
      />

      {/* Client Responses Viewer Drawer */}
      <ResponsesDrawer
        post={selectedPostForResponses}
        open={responsesDrawerOpen}
        onOpenChange={setResponsesDrawerOpen}
      />
    </div>
  );
}
