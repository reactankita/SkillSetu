'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSkillSetuStore } from '@/lib/data/store';
import { Building2, ShieldCheck } from 'lucide-react';

export default function ClientRegisterPage() {
  const router = useRouter();
  const store = useSkillSetuStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Register client & set active role
      store.setUserRole('client');
      router.push('/browse');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Client Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Hire verified college talent with protected payments and zero risk
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-4">
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Contact Person Name</label>
              <Input
                required
                placeholder="e.g. Rohan Kapoor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Email Address</label>
              <Input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Contact Phone Number</label>
              <Input
                type="tel"
                required
                placeholder="+91 98200 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Company / Startup / Organization / Individual</label>
              <Input
                required
                placeholder="e.g. Tech Fest Committee / Bloom Cafe"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Password</label>
              <Input
                type="password"
                required
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Payments are only charged when you book a verified student service.</span>
            </div>

            <Button
              type="submit"
              variant="navy"
              disabled={loading}
              className="w-full font-bold h-11 text-sm mt-2"
            >
              {loading ? 'Registering Account...' : 'Register as Client'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/login/client" className="font-bold text-orange-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
