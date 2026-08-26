'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useSkillSetuStore } from '@/lib/data/store';
import { GraduationCap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function StudentLoginPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const [email, setEmail] = useState('sarah.chen@iitb.ac.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      store.setUserRole('student');
      router.push('/browse');
    }, 600);
  };

  const handleQuickDemo = () => {
    store.setUserRole('student');
    router.push('/browse');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Provider Login
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage your services, client bookings, and earnings dashboard
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-5">
          <GoogleSignInButton text="Continue with Google" redirectTo="/browse" />

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              or with email
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Quick Demo Login Alert */}
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-orange-600" />
                Quick Demo Access
              </span>
              <p className="text-[11px] text-orange-700">Pre-loaded as Sarah Chen (IIT Bombay)</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleQuickDemo}
              className="text-xs font-bold"
            >
              1-Click Demo
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Student Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.ac.in"
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
              variant="default"
              disabled={loading}
              className="w-full font-bold h-11 text-sm mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In as Student'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Don&apos;t have a student account?{' '}
              <Link href="/register/student" className="font-bold text-orange-600 hover:underline">
                Register as Student
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Looking to hire instead?{' '}
              <Link href="/login/client" className="font-bold text-slate-800 hover:underline">
                Client Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
