import React from 'react';
import Image from 'next/image';
import { ShieldCheck, GraduationCap, Building2, QrCode } from 'lucide-react';
import { StudentProfile, ClientProfile } from '@/types';

interface SkillSetuIdCardProps {
  user: StudentProfile | ClientProfile;
  type?: 'student' | 'client';
}

export function SkillSetuIdCard({ user, type = 'student' }: SkillSetuIdCardProps) {
  const isStudent = type === 'student' || 'college' in user;
  const student = isStudent ? (user as StudentProfile) : null;
  const client = !isStudent ? (user as ClientProfile) : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl max-w-md w-full">
      {/* Decorative subtle circuit overlay */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm">
            SS
          </div>
          <div>
            <div className="text-xs tracking-widest text-slate-400 font-semibold uppercase">SkillSetu Verified Identity</div>
            <div className="text-sm font-bold text-white tracking-wide">
              {isStudent ? 'STUDENT TALENT CREDENTIAL' : 'CLIENT BUSINESS CREDENTIAL'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0">
          <Image
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={user.full_name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-white truncate">{user.full_name}</h4>
          
          {isStudent && student && (
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
                <GraduationCap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{student.college}</span>
              </div>
              <div className="text-xs text-slate-400 truncate">{student.course} ({student.year})</div>
            </div>
          )}

          {!isStudent && client && (
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
                <Building2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{client.organization_name || 'Individual Client'}</span>
              </div>
              <div className="text-xs text-slate-400 truncate">{client.location}</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Unique ID Strip */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Unique Verification ID</div>
          <div className="text-sm font-mono font-bold text-orange-400 tracking-wider">
            {user.skillsetu_id}
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <QrCode className="w-6 h-6 text-slate-300" />
        </div>
      </div>
    </div>
  );
}
