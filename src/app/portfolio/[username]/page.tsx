'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSkillSetuStore } from '@/lib/data/store';
import { PortfolioThemeRenderer } from '@/components/portfolio/PortfolioThemeRenderer';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { Button } from '@/components/ui/button';
import { Service } from '@/types';
import { Share2, ArrowLeft, Edit3, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PublicPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = params?.username as string;

  const store = useSkillSetuStore();
  const currentStudent = store.getCurrentStudent();
  const portfolio = store.getPortfolioByUsername(rawUsername);

  const student = portfolio ? store.getStudentById(portfolio.student_id) : null;
  const services = student ? store.getServices().filter((s) => s.student_id === student.id && s.status === 'published') : [];

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [copied, setCopied] = useState(false);

  const isOwner = student?.id === currentStudent.id;

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      try {
        confetti({ particleCount: 35, spread: 45 });
      } catch {}
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!portfolio || !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Portfolio Not Found</h2>
          <p className="text-xs text-slate-500">
            We couldn&apos;t find a portfolio under <code className="text-orange-600 font-mono font-bold">{rawUsername}</code>.
          </p>
          <Link href="/browse">
            <Button variant="default" size="sm" className="font-bold text-xs">
              Explore SkillSetu Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If draft and not owner
  if (portfolio.status !== 'published' && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Portfolio in Draft</h2>
          <p className="text-xs text-slate-500">
            {student.full_name}&apos;s portfolio is currently being prepared and has not been published to the public yet.
          </p>
          <Link href={`/students/${student.id}`}>
            <Button variant="outline" size="sm" className="text-xs font-bold">
              View Student Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Floating Control Strip */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/students/${student.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Student Profile</span>
            </Link>

            {isOwner && (
              <span className="hidden sm:inline-block text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                Owner Preview ({portfolio.status})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-xs h-8 font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" />
              {copied ? 'Link Copied!' : 'Share'}
            </Button>

            {isOwner && (
              <Link href="/portfolio/builder">
                <Button variant="default" size="sm" className="text-xs h-8 font-bold">
                  <Edit3 className="w-3.5 h-3.5 mr-1" />
                  Edit in Builder
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Theme View */}
      <main className="flex-1">
        <PortfolioThemeRenderer
          portfolio={portfolio}
          student={student}
          services={services}
          isOwner={isOwner}
          onBookService={handleBookService}
        />
      </main>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
      />
    </div>
  );
}
