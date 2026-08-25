'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillSetuStore } from '@/lib/data/store';
import { Building2, ArrowRight } from 'lucide-react';

export default function ClientLoginPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const [email, setEmail] = useState('rohan.kapoor@techfest.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      store.setUserRole('client');
      router.push('/browse');
    }, 600);
  };

  const handleQuickDemo = () => {
    store.setUserRole('client');
    router.push('/browse');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Client & Organization Login
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Discover verified student talent, track active bookings, and manage payments
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-5">
          {/* Quick Demo Login Alert */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold flex items-center gap-1">
                <Building2 className="w-4 h-4 text-teal-600" />
                Quick Client Demo
              </span>
              <p className="text-[11px] text-teal-700">Pre-loaded as Tech Fest Committee</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="teal"
              onClick={handleQuickDemo}
              className="text-xs font-bold"
            >
              1-Click Demo
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Password</label>
                <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="navy"
              disabled={loading}
              className="w-full font-bold h-11 text-sm mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In as Client'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Don&apos;t have a client account?{' '}
              <Link href="/register/client" className="font-bold text-orange-600 hover:underline">
                Register as Client
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Are you a student instead?{' '}
              <Link href="/login/student" className="font-bold text-slate-800 hover:underline">
                Student Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
