import React from 'react';
import Link from 'next/link';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-300 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkillSetuLogo href="/admin" size="md" />
            <Badge variant="navy" className="text-xs uppercase font-extrabold px-2.5 py-0.5 tracking-wider">
              ADMIN AREA
            </Badge>
          </div>

          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
