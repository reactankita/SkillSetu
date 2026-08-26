'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillSetuStore } from '@/lib/data/store';
import { AlertCircle } from 'lucide-react';

export default function ClientLoginPage() {
  const router = useRouter();
  const store = useSkillSetuStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const foundClient = store.getClientByEmail(email);
      if (foundClient) {
        store.setUserRole('client');
      } else {
        // Auto-provision demo client session if email is new
        store.registerClient({
          email: email.trim(),
          full_name: email.split('@')[0].replace('.', ' '),
          client_type: 'individual',
        });
      }

      setLoading(false);
      router.push('/browse');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Client Login
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Find verified student talent for your next project.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="text-xs h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">Password</label>
                <span className="text-[11px] text-orange-600 hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="text-xs h-10"
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
              className="w-full font-bold h-10 text-xs shadow-xs mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
              Are you a student?{' '}
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
