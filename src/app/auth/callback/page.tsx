'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useSkillSetuStore } from '@/lib/data/store';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useSkillSetuStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isSubscribed = true;

    async function handleAuth() {
      try {
        // 1. Check if session exists in storage / hash
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (sessionData.session?.user) {
          if (isSubscribed) {
            syncUserAndRedirect(sessionData.session.user);
          }
          return;
        }

        // 2. Listen for auth change if token is in URL hash
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user && isSubscribed) {
              syncUserAndRedirect(session.user);
            }
          }
        );

        // 3. Fallback check after 2 seconds
        const timer = setTimeout(async () => {
          if (!isSubscribed) return;
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            syncUserAndRedirect(userData.user);
          } else {
            // Check for error in query params
            const errorDesc = searchParams.get('error_description') || searchParams.get('error');
            if (errorDesc) {
              setStatus('error');
              setErrorMessage(errorDesc);
            } else {
              // Fallback to browse if already logged in locally
              setStatus('success');
              router.push('/browse');
            }
          }
        }, 2000);

        return () => {
          isSubscribed = false;
          authListener?.subscription?.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err: unknown) {
        console.error('Auth callback error:', err);
        if (isSubscribed) {
          setStatus('error');
          setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
        }
      }
    }

    function syncUserAndRedirect(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
      const metadata = user.user_metadata || {};
      const userRole = (metadata.role as 'student' | 'client') || 'student';
      const fullName = (metadata.full_name as string) || (metadata.name as string) || user.email?.split('@')[0] || 'SkillSetu User';
      const avatarUrl = (metadata.avatar_url as string) || (metadata.picture as string);

      store.setUserRole(userRole);

      if (userRole === 'student') {
        store.registerStudent({
          email: user.email || 'student@skillsetu.com',
          full_name: fullName,
          college: (metadata.college as string) || 'University Student',
          course: (metadata.course as string) || 'Undergraduate',
          year: (metadata.year as string) || '3rd Year',
          avatar_url: avatarUrl,
        });
      } else {
        store.registerClient({
          email: user.email || 'client@skillsetu.com',
          full_name: fullName,
          client_type: (metadata.client_type as 'individual' | 'student' | 'organization' | 'business') || 'individual',
          avatar_url: avatarUrl,
        });
      }

      setStatus('success');
      const next = searchParams.get('next') || '/browse';
      setTimeout(() => {
        router.push(next);
      }, 400);
    }

    handleAuth();
  }, [router, searchParams, store]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg max-w-sm w-full text-center space-y-4">
        {status === 'loading' && (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Completing Sign-In</h3>
            <p className="text-xs text-slate-500">Securing your SkillSetu account session...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Authentication Successful</h3>
            <p className="text-xs text-slate-500">Redirecting to your dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Sign-In Notice</h3>
            <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              {errorMessage || 'Authentication could not be completed.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="button"
                variant="default"
                onClick={() => router.push('/login/student')}
                className="text-xs font-bold w-full"
              >
                Back to Student Login
              </Button>
              <Link href="/login/client" className="text-xs text-slate-600 hover:underline">
                Or Client Login →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
