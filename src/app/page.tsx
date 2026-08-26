'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Star,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  Calendar,
  Lock,
} from 'lucide-react';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/config/site';
import { SEED_STUDENTS, SEED_SERVICES, SEED_COMMUNITY_POSTS } from '@/lib/data/seedData';
import { StudentCard } from '@/components/marketplace/StudentCard';
import { ServiceCard } from '@/components/marketplace/ServiceCard';
import { Footer } from '@/components/layout/Footer';
import { formatINR } from '@/lib/utils';

export default function LandingPage() {
  const featuredStudents = SEED_STUDENTS.slice(0, 4);
  const featuredServices = SEED_SERVICES.slice(0, 6);
  const featuredCommunity = SEED_COMMUNITY_POSTS.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Public Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <SkillSetuLogo size="md" />

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/browse" className="hover:text-orange-600 transition-colors">
              Browse Skills
            </Link>
            <Link href="/community" className="hover:text-orange-600 transition-colors">
              Community Board
            </Link>
            <Link href="#how-it-works" className="hover:text-orange-600 transition-colors">
              How It Works
            </Link>
            <Link href="#safety" className="hover:text-orange-600 transition-colors">
              Payment Protection
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login/student"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle geometric backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-orange-400 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Indian College Talent Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Skills that connect.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Opportunities that grow.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with verified Indian student talent for projects, events, creative work, tutoring, and technology. Protected payments, transparent fees, no middlemen.
            </p>

            {/* Dual Onboarding Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-6 text-left">
              {/* Card 1: Client Pathway */}
              <div className="rounded-2xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 p-6 transition-all hover:border-orange-500/50 shadow-xl group">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  I want to hire talent
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Startups, event organizers & businesses discover verified student freelancers with protected payments.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
                  >
                    <span>Find Skilled Students</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Student Pathway */}
              <div className="rounded-2xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 p-6 transition-all hover:border-teal-500/50 shadow-xl group">
                <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                  I want to offer skills
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  College students verify college IDs, list services, earn income, and build verified client reviews.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <Link
                    href="/register/student"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
                  >
                    <span>Become a Provider</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Micro proof strip */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>College ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-sky-400" />
                <span>Protected Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Verified Client Reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Popular Categories Grid */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Diverse Student Skills
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              SkillSetu connects talent across 12+ creative, technical, academic, and event categories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl border border-slate-200 bg-white hover:border-orange-500/50 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {cat.popularSkills.slice(0, 2).map((skill) => (
                    <span key={skill} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 3: Featured Services */}
        <section className="py-16 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Featured Offerings
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Top Rated Student Services
                </h2>
              </div>
              <Link
                href="/browse"
                className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
              >
                <span>View all services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: How SkillSetu Works */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Transparent Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How SkillSetu Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From discovery to completion, every transaction is backed by verifiable credentials and safety safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 relative shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 font-extrabold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Discover & Schedule</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse verified portfolios from top Indian universities. Choose time slots, set project deliverables, and see transparent 5% platform pricing upfront.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 relative shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Protected Payment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Client authorizes payment via Razorpay. Funds remain safely protected with SkillSetu until the student delivers satisfactory work.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 relative shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Confirmation & Payout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student marks service completed. Client reviews the deliverables and confirms completion. Funds are released instantly, and a verified review is posted.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Trust & Payment Protection Showcase */}
        <section id="safety" className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <Badge variant="orange" className="text-xs uppercase tracking-wider">
                  Peace of Mind
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Zero Risk. 100% Payment Protection.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike traditional unverified freelancing channels, SkillSetu safeguards both parties. Clients never lose funds to no-shows, and students are guaranteed payout upon delivering agreed work.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-950 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">College ID Verification</h4>
                      <p className="text-xs text-slate-400">Every student provider submits university proof before publishing listings.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-sky-950 text-sky-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Protected Funds Holding</h4>
                      <p className="text-xs text-slate-400">Client payments are securely logged and released only upon client approval.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-amber-950 text-amber-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Dispute Safety Buffer</h4>
                      <p className="text-xs text-slate-400">Moderation team reviews conflict reports with one-click refund/settlement options.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual ID / Protection preview card */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-orange-600 flex items-center justify-center font-bold text-xs">
                      SS
                    </div>
                    <span className="font-bold text-sm">SkillSetu Trust Protocol</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Active Protection
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-700/50">
                    <span>Client Authorization</span>
                    <span className="font-mono text-emerald-400">COMPLETED</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/50">
                    <span>Payment Vault Status</span>
                    <span className="font-mono text-sky-400">PROTECTED (INR 2,678)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700/50">
                    <span>Student Verification</span>
                    <span className="font-mono text-emerald-400">IIT Bombay Verified</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Release Condition</span>
                    <span className="font-mono text-orange-400">Client Completion Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Community Opportunities Highlight */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Live Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Recent Client Requirements
              </h2>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors"
            >
              <span>Explore community board</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCommunity.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs font-bold text-orange-600">
                      {formatINR(post.budget)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {post.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Posted by {post.client_name}
                  </span>
                  <Link
                    href="/community"
                    className="text-xs font-bold text-orange-600 hover:underline"
                  >
                    View & Apply →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Final Conversion Banner */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to tap into India&apos;s brightest student minds?
            </h2>
            <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto">
              Join hundreds of startups, event committees, and clients already hiring verified college talent on SkillSetu.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/browse"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg transition-colors"
              >
                Browse Student Talent
              </Link>
              <Link
                href="/register/student"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold shadow-lg transition-colors"
              >
                Offer Your Skills
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
