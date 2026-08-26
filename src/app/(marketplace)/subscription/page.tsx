'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { useSkillSetuStore } from '@/lib/data/store';
import { SubscriptionPlanId, SubscriptionBillingCycle } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Zap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function SubscriptionPage() {
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();
  const currentSub = store.getStudentSubscription(student.id);

  const [billingCycle, setBillingCycle] = useState<SubscriptionBillingCycle>('yearly');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlanId | null>(null);

  const plans = SITE_CONFIG.subscriptionPlans;
  const matrix = SITE_CONFIG.featureComparisonMatrix;

  const handleSelectPlan = (planId: SubscriptionPlanId) => {
    setLoadingPlan(planId);
    setTimeout(() => {
      store.updateStudentSubscription(student.id, planId, billingCycle);
      setLoadingPlan(null);
      try {
        confetti({ particleCount: 70, spread: 70 });
      } catch {}
      const targetPlan = plans.find((p) => p.id === planId);
      setSuccessMessage(`🎉 You are now active on ${targetPlan?.name} (${billingCycle === 'yearly' ? 'Annual Pass' : 'Monthly Pass'})!`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-bold tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5 text-orange-600" />
          <span>Student Creator & Freelancer Passes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Keep 100% of Your Earnings. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
            Choose Your Growth Plan.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Zero middlemen and 0% commission on Pro plans. Build your verified campus reputation, unlock unlimited leads, and get paid directly to UPI.
        </p>

        {/* Billing Switcher (Monthly vs Annual) */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200 flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                billingCycle === 'yearly' ? 'bg-orange-800/80 text-orange-100' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Save 33%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold text-center shadow-sm animate-in zoom-in-95">
          {successMessage}
        </div>
      )}

      {/* 2. 3-Tier Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => {
          const isCurrentActive = currentSub.plan_id === plan.id;
          const isPro = plan.id === 'pro';
          const isAgency = plan.id === 'agency';

          const displayedPrice =
            plan.id === 'free'
              ? 0
              : billingCycle === 'yearly'
              ? plan.yearlyMonthlyEquivalent
              : plan.monthlyPrice;

          return (
            <Card
              key={plan.id}
              className={`rounded-3xl flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                isPro
                  ? 'border-2 border-orange-500 shadow-xl bg-gradient-to-b from-orange-50/30 via-white to-white'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300 bg-white'
              }`}
            >
              {/* Highlight ribbon for Pro */}
              {isPro && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[11px] font-extrabold px-4 py-1 rounded-bl-xl shadow-xs">
                  {plan.badge}
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-6">
                {/* Header info */}
                <div>
                  {!isPro && (
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[36px]">
                    {plan.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900">
                      {formatINR(displayedPrice)}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/ month</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1 font-medium">
                    {plan.id === 'free' ? (
                      <span className="text-emerald-600 font-bold">Free for verified college students</span>
                    ) : billingCycle === 'yearly' ? (
                      <span>Billed annually at <strong className="text-slate-900">{formatINR(plan.yearlyTotalPrice)}/yr</strong></span>
                    ) : (
                      <span>Billed monthly • Cancel anytime</span>
                    )}
                  </div>
                </div>

                {/* What You Get vs What You Miss Breakdown */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
                    <span>Included Benefits:</span>
                    <span className="text-orange-600 font-mono">{plan.commissionRate}</span>
                  </div>

                  <div className="space-y-2.5">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs">
                        {feat.included ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </div>
                        )}
                        <span className={`${
                          feat.included
                            ? ('highlight' in feat && feat.highlight)
                              ? 'font-bold text-slate-900'
                              : 'text-slate-700 font-medium'
                            : 'text-slate-400 line-through'
                        }`}>
                          {feat.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action CTA */}
              <div className="p-6 sm:p-8 pt-0">
                <Button
                  type="button"
                  variant={isCurrentActive ? 'outline' : isPro ? 'default' : isAgency ? 'navy' : 'outline'}
                  disabled={loadingPlan !== null}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full font-bold h-12 text-xs sm:text-sm shadow-xs ${
                    isPro && !isCurrentActive ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md' : ''
                  }`}
                >
                  {loadingPlan === plan.id
                    ? 'Updating Pass...'
                    : isCurrentActive
                    ? '✓ Current Active Pass'
                    : plan.cta}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Detailed Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Detailed Plan Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare commission rates, listing limits, search boosting, and team support across tiers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold text-slate-900 uppercase tracking-wider text-[11px]">Feature</th>
                <th className="py-3.5 px-4 font-bold text-slate-600 text-center">Free Student</th>
                <th className="py-3.5 px-4 font-bold text-orange-600 text-center bg-orange-50/50 rounded-t-xl">
                  Student Pro ⚡
                </th>
                <th className="py-3.5 px-4 font-bold text-slate-900 text-center">Campus Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-600">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className={row.free.includes('5%') ? 'font-mono text-rose-600 font-bold' : ''}>
                        {row.free}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center bg-orange-50/30 font-semibold text-orange-900">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className={row.pro.includes('0%') ? 'text-emerald-700 font-bold' : ''}>
                        {row.pro}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-800 font-medium">
                    {typeof row.agency === 'boolean' ? (
                      row.agency ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )
                    ) : (
                      <span className={row.agency.includes('0%') ? 'text-emerald-700 font-bold' : ''}>
                        {row.agency}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Student FAQ & Trust Guarantee */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span>Why is Pro 0% Commission?</span>
          </h3>
          <p className="leading-relaxed">
            SkillSetu is designed to empower Indian students to build sustainable freelance careers. Rather than taking heavy 20% commission like Upwork or Fiverr, our monthly pass lets you keep 100% of your earnings.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Escrow Payment Guarantee</span>
          </h3>
          <p className="leading-relaxed">
            All client payments are held safely in 10-state escrow before work begins. Upon client satisfaction, funds are released instantly to your verified UPI ID with zero deduction.
          </p>
        </div>
      </div>
    </div>
  );
}
