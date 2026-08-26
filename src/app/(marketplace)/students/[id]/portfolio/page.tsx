'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSkillSetuStore } from '@/lib/data/store';

export default function StudentPortfolioRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;
  const store = useSkillSetuStore();

  useEffect(() => {
    const portfolio = store.getPortfolioByStudentId(studentId);
    if (portfolio?.username) {
      router.replace(`/portfolio/${portfolio.username}`);
    } else {
      const student = store.getStudentById(studentId);
      if (student) {
        const slug = student.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        router.replace(`/portfolio/${slug}`);
      } else {
        router.replace('/browse');
      }
    }
  }, [studentId, router, store]);

  return (
    <div className="max-w-4xl mx-auto py-20 text-center text-xs text-slate-400">
      Loading student portfolio...
    </div>
  );
}
