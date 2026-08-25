import React from 'react';
import Link from 'next/link';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <SkillSetuLogo size="md" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The verified Indian student skills marketplace. Connecting college talent with startups, event organizers, small businesses, and individuals with protected payments.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified College Credentials</span>
            </div>
          </div>

          {/* Col 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="hover:text-orange-600 transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-orange-600 transition-colors">
                  Community Board
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-orange-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/browse?category=technology" className="hover:text-orange-600 transition-colors">
                  Technology & Code
                </Link>
              </li>
              <li>
                <Link href="/browse?category=photography" className="hover:text-orange-600 transition-colors">
                  Event Photography
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: For Students */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">For Students</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="hover:text-orange-600 transition-colors">
                  Offer Your Skills
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-orange-600 transition-colors">
                  College Verification
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-orange-600 transition-colors">
                  Student Pro Plans
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-600 transition-colors">
                  Earnings Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Clients & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Company & Trust</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#safety" className="hover:text-orange-600 transition-colors">
                  Payment Protection
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-orange-600 transition-colors">
                  Client Verification
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Terms & Privacy</span>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-slate-700 transition-colors">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SkillSetu. Built for Indian student talent & entrepreneurial ecosystem.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed with precision for students & clients</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
