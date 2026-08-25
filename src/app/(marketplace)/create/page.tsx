'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/config/site';
import { DeliveryMode, PricingUnit, Service } from '@/types';
import { useSkillSetuStore } from '@/lib/data/store';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldCheck, ShieldAlert, Sparkles, Upload, ArrowRight, Eye, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function CreateServicePage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();

  const isVerified = student.verification_status === 'verified';

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Remote / Pune / Mumbai');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('online');
  const [price, setPrice] = useState(650);
  const [pricingUnit, setPricingUnit] = useState<PricingUnit>('per_hour');
  const [availabilityDays, setAvailabilityDays] = useState<string[]>(['Mon', 'Wed', 'Fri', 'Sat']);
  const [teamService, setTeamService] = useState(false);
  const [skillsInput, setSkillsInput] = useState('React, Next.js, API Design');
  const [portfolioUrl, setPortfolioUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80');
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    if (availabilityDays.includes(day)) {
      setAvailabilityDays(availabilityDays.filter((d) => d !== day));
    } else {
      setAvailabilityDays([...availabilityDays, day]);
    }
  };

  const parsedSkills = skillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Live Service Preview Object
  const previewService: Service = {
    id: 'preview',
    student_id: student.id,
    student_name: student.full_name,
    student_avatar: student.avatar_url,
    student_college: student.college,
    student_rating: student.rating || 5.0,
    student_review_count: student.review_count || 0,
    student_skillsetu_id: student.skillsetu_id,
    student_badges: student.badges,
    title: title || 'Your Service Title Here',
    slug: 'preview-slug',
    category,
    description: description || 'Describe your deliverables, workflow, and what the client receives...',
    location,
    delivery_mode: deliveryMode,
    price: Number(price) || 500,
    pricing_unit: pricingUnit,
    availability_days: availabilityDays,
    team_service: teamService,
    portfolio_urls: [portfolioUrl],
    skills: parsedSkills.length > 0 ? parsedSkills : ['Skills', 'Tools'],
    status: 'published',
    views_count: 0,
    bookings_count: 0,
    created_at: new Date().toISOString(),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return;

    setLoading(true);
    setTimeout(() => {
      store.addService({
        student_id: student.id,
        student_name: student.full_name,
        student_avatar: student.avatar_url,
        student_college: student.college,
        student_rating: student.rating,
        student_review_count: student.review_count,
        student_skillsetu_id: student.skillsetu_id,
        student_badges: student.badges,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description,
        location,
        delivery_mode: deliveryMode,
        price: Number(price),
        pricing_unit: pricingUnit,
        availability_days: availabilityDays,
        team_service: teamService,
        portfolio_urls: [portfolioUrl],
        skills: parsedSkills,
        status: 'published',
      });

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}

      setLoading(false);
      router.push('/my-services');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Service Listing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Only verified college students can publish listings on the SkillSetu marketplace.
          </p>
        </div>

        <Link href="/my-services">
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            My Services Catalog
          </Button>
        </Link>
      </div>

      {/* Verification Warning if unverified */}
      {!isVerified && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">College Verification Required</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Your student profile is currently {student.verification_status}. You must verify your college ID before publishing active services to clients.
              </p>
            </div>
          </div>
          <Link href="/verification">
            <Button size="sm" variant="default" className="whitespace-nowrap font-bold text-xs">
              Go to Verification Center →
            </Button>
          </Link>
        </div>
      )}

      {/* Form + Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form: 2 cols */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Service Details
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Service / Skill Title</label>
                <Input
                  required
                  placeholder="e.g. Next.js Full-Stack App Development or Fest Event Photography"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Category</label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Delivery Mode</label>
                  <select
                    value={deliveryMode}
                    onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="online">Online / Remote</option>
                    <option value="on_campus">On Campus / Local</option>
                    <option value="both">Both (Online & Campus)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Description & Deliverables</label>
                <Textarea
                  required
                  placeholder="What exactly will you deliver? What tools will you use? What is the expected turnaround time?"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Skills & Tech Stack (comma separated)</label>
                <Input
                  placeholder="e.g. Figma, Mobile UI, Design Systems"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. Pricing & Structure
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Base Price (₹)</label>
                  <Input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Pricing Unit</label>
                  <select
                    value={pricingUnit}
                    onChange={(e) => setPricingUnit(e.target.value as PricingUnit)}
                    className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="per_hour">Per Hour (/hr)</option>
                    <option value="per_project">Per Project (/project)</option>
                    <option value="per_session">Per Session (/session)</option>
                    <option value="per_item">Per Item (/item)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Availability Days */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900">3. Availability Days</h3>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isSelected = availabilityDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Portfolio Sample & Team Mode */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900">4. Portfolio & Team Mode</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Portfolio Image URL / Sample</label>
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Team Services Available</h4>
                  <p className="text-[11px] text-slate-500">Allow clients to book you alongside your college team for larger project budgets.</p>
                </div>
                <input
                  type="checkbox"
                  checked={teamService}
                  onChange={(e) => setTeamService(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={!isVerified || loading}
                className="font-bold px-8 h-11 text-sm shadow-md"
              >
                {loading ? 'Publishing...' : 'Publish Service Listing'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Responsive Preview Card */}
        <div className="lg:col-span-1 space-y-4 sticky top-20">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Eye className="w-4 h-4 text-orange-600" />
            <span>Live Marketplace Preview</span>
          </div>

          <ServiceCard service={previewService} />

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Publisher Guarantee
            </div>
            <p className="leading-relaxed">
              Once published, clients can discover your listing in search, view your portfolio, and book with protected payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
