'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SkillSetuLogo } from '@/components/brand/SkillSetuLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useSkillSetuStore } from '@/lib/data/store';
import { supabase } from '@/lib/supabase/client';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function StudentRegisterPage() {
  const router = useRouter();
  const store = useSkillSetuStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('3rd Year');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      // 1. Supabase Auth Sign Up
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'student',
            college: college.trim(),
            course: course.trim(),
            year: year,
          },
        },
      });

      // 2. Register in client store
      store.registerStudent({
        email: email.trim(),
        full_name: fullName.trim(),
        college: college.trim(),
        course: course.trim(),
        year: year,
      });

      store.setUserRole('student');

      if (signUpError) {
        // Still allow immediate access in prototype demo
        router.push('/browse');
        return;
      }

      router.push('/browse');
    } catch {
      store.registerStudent({
        email: email.trim(),
        full_name: fullName.trim(),
        college: college.trim(),
        course: course.trim(),
        year: year,
      });
      store.setUserRole('student');
      router.push('/browse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <SkillSetuLogo size="lg" className="justify-center" />
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
          Join as a Student Provider
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Monetize your skills, earn income, and build a verified portfolio
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-md rounded-2xl border border-slate-200 space-y-4">
          <GoogleSignInButton text="Sign up with Google" redirectTo="/browse" />

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              or register with email
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Full Name</label>
              <Input
                required
                placeholder="e.g. Arjun Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Student Email Address</label>
              <Input
                type="email"
                required
                placeholder="name@college.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">College / Institute</label>
              <Input
                required
                placeholder="e.g. IIT Bombay, COEP, BITS Pilani"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Course / Major</label>
                <Input
                  required
                  placeholder="e.g. B.Tech CSE"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year">Final Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
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
              <span>College ID verification is completed inside your account.</span>
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="w-full font-bold h-11 text-sm mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Student Registration'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/login/student" className="font-bold text-orange-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
