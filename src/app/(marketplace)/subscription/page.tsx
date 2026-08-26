'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { useSkillSetuStore } from '@/lib/data/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';

export default function SubscriptionPage() {
  const store = useSkillSetuStore();
  const student = store.getCurrentStudent();

  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');
  const [successMessage, setSuccessMessage] = useState('');

  const monthlyPlan = SITE_CONFIG.subscriptionTiers.monthly;
  const yearlyPlan = SITE_CONFIG.subscriptionTiers.yearly;

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setActivePlan(plan);
    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch {}
    setSuccessMessage(`Successfully switched to ${plan === 'monthly' ? monthlyPlan.name : yearlyPlan.name}!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <Badge variant="orange" className="text-xs uppercase tracking-wider">
          Student Provider Plans
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Monetize Your Skills with Zero Commission
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Students retain 100% of their service earnings with our transparent monthly and annual membership tiers.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in zoom-in-95">
          {successMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Monthly Plan */}
        <Card className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between transition-all ${
          activePlan === 'monthly'
            ? 'border-2 border-slate-900 shadow-lg'
            : 'border-slate-200 hover:border-slate-300'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{monthlyPlan.name}</h3>
              {activePlan === 'monthly' && (
                <Badge variant="navy" className="text-xs">Current Active Plan</Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{formatINR(monthlyPlan.price)}</span>
              <span className="text-xs text-slate-500 font-semibold">{monthlyPlan.period}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Ideal for students starting out offering tutoring, photography, design or web development.
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Included Benefits:
              </span>
              {monthlyPlan.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant={activePlan === 'monthly' ? 'outline' : 'navy'}
              onClick={() => handleSelectPlan('monthly')}
              className="w-full font-bold h-11 text-xs"
            >
              {activePlan === 'monthly' ? 'Current Plan Active' : 'Switch to Monthly (₹199)'}
            </Button>
          </div>
        </Card>

        {/* Annual Plan */}
        <Card className={`p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative transition-all ${
          activePlan === 'yearly'
            ? 'border-2 border-orange-600 shadow-xl'
            : 'border-slate-200 hover:border-orange-500/50'
        }`}>
          {/* Badge */}
          <div className="absolute -top-3 right-6 bg-orange-600 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-sm">
            {yearlyPlan.discount}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{yearlyPlan.name}</h3>
              {activePlan === 'yearly' && (
                <Badge variant="orange" className="text-xs">Current Active Plan</Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">{formatINR(yearlyPlan.price)}</span>
              <span className="text-xs text-slate-500 font-semibold">{yearlyPlan.period}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Best value for serious student freelancers seeking priority leads, badges, and maximum exposure.
            </p>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Everything in Monthly, plus:
              </span>
              {yearlyPlan.benefits.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-semibold">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant={activePlan === 'yearly' ? 'outline' : 'default'}
              onClick={() => handleSelectPlan('yearly')}
              className="w-full font-bold h-11 text-xs shadow-md"
            >
              {activePlan === 'yearly' ? 'Current Plan Active' : 'Switch to Annual (₹1,499)'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Plan Details Strip */}
      <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-900 block">Prototype Subscription Demo</span>
          <span>Plans can be simulated instantly without entering live credit card credentials.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-600 font-bold">Auto-Renew: Active</span>
        </div>
      </div>
    </div>
  );
}
