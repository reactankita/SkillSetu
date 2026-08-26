'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSkillSetuStore } from '@/lib/data/store';
import { Building2, ArrowRight, ShieldCheck, User, Repeat, AlertCircle } from 'lucide-react';

export default function ClientLoginPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const [email, setEmail] = useState('rohan.kapoor@techfest.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentRole = mounted ? store.getUserRole() : 'client';
  const currentStudent = mounted ? store.getCurrentStudent() : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your client account email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const foundClient = store.getClientByEmail(email);
      if (foundClient) {
        store.setUserRole('client');
      } else {
        // Auto-provision demo client account if email is new
        store.registerClient({
          email: email.trim(),
          full_name: email.split('@')[0].replace('.', ' '),
          client_type: 'individual',
        });
      }

      setLoading(false);
      // Route immediately to Browse as required by client onboarding specification
      router.push('/browse');
    }, 500);
  };

  const handleSwitchFromStudent = () => {
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
          Discover verified student talent, track active bookings, and manage protected payments
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-5">
          {/* Quick Switch if already logged in as Student */}
          {currentRole === 'student' && currentStudent && (
            <div className="p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 text-xs text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-900 flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5 text-orange-600" />
                  Logged in as {currentStudent.full_name}
                </span>
                <Badge variant="orange" className="text-[10px]">Student Active</Badge>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                You can switch directly to your client workspace without creating a separate account.
              </p>
              <Button
                type="button"
                size="sm"
                variant="default"
                onClick={handleSwitchFromStudent}
                className="w-full text-xs font-bold h-8"
              >
                Switch to Client Mode →
              </Button>
            </div>
          )}

          {/* Quick Pre-filled Demo Selector */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              Quick Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setEmail('rohan.kapoor@techfest.org')}
                className={`p-2 rounded-lg text-left border text-[11px] transition-colors ${
                  email === 'rohan.kapoor@techfest.org'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block truncate">Tech Fest Committee</span>
                <span className="text-[9px] opacity-75">Organization</span>
              </button>
              <button
                type="button"
                onClick={() => setEmail('sneha.pillai@startupsprint.co')}
                className={`p-2 rounded-lg text-left border text-[11px] transition-colors ${
                  email === 'sneha.pillai@startupsprint.co'
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="font-bold block truncate">Startup Sprint</span>
                <span className="text-[9px] opacity-75">Company / Startup</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Client / Organization Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Password</label>
                <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xs"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full font-bold h-10 text-xs shadow-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In as Client'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Don&apos;t have a client account?{' '}
              <Link href="/register/client" className="font-bold text-orange-600 hover:underline">
                Create Client Account
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Are you a student instead?{' '}
              <Link href="/login/student" className="font-bold text-slate-800 hover:underline">
                Continue as Student →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
