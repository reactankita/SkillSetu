'use client';

import React, { useState } from 'react';
import { useSkillSetuStore } from '@/lib/data/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  User,
  Bell,
  CreditCard,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building,
  Smartphone,
} from 'lucide-react';

export default function SettingsPage() {
  const store = useSkillSetuStore();
  const role = store.getUserRole();
  const student = store.getCurrentStudent();
  const client = store.getCurrentClient();
  const currentUser = role === 'student' ? student : client;

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [upiId, setUpiId] = useState('sarah.chen@okhdfcbank');
  const [gstin, setGstin] = useState('27AADCS1234F1Z5');
  const [toastMessage, setToastMessage] = useState('');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Settings saved successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
            <Badge variant="navy" className="text-xs font-mono capitalize">
              {role} Account
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal credentials, payout methods, notifications, and security preferences.
          </p>
        </div>

        {toastMessage && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            {toastMessage}
          </span>
        )}
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <div className="bg-white p-1 rounded-xl border border-slate-200 max-w-md shadow-2xs">
          <TabsList className="grid grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger value="account" className="text-xs font-bold">
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs font-bold">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="payouts" className="text-xs font-bold">
              {role === 'student' ? 'Payouts' : 'Billing'}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. Account Info Tab */}
        <TabsContent value="account">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Your core contact information on SkillSetu.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">SkillSetu Digital ID</label>
                <Input value={currentUser.skillsetu_id} readOnly className="bg-slate-50 text-slate-600 font-mono text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Registered Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900">Phone Number</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="text-xs" />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <Button type="submit" variant="default" size="sm" className="font-bold text-xs">
                Save Account Changes
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* 2. Notifications Tab */}
        <TabsContent value="notifications">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
              <p className="text-xs text-slate-500">Choose how and when SkillSetu contacts you about bookings and matches.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <strong className="text-slate-900 block font-bold">Email Notifications</strong>
                  <span className="text-slate-500">Receive order confirmations, dispute updates, and reviews via email.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <strong className="text-slate-900 block font-bold">SMS / WhatsApp Alerts</strong>
                  <span className="text-slate-500">Instant notification when a client books a service or releases payment.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <strong className="text-slate-900 block font-bold">Community Requirement Matches</strong>
                  <span className="text-slate-500">Get notified when a new community gig matches your campus or skills.</span>
                </div>
                <input
                  type="checkbox"
                  checked={communityAlerts}
                  onChange={(e) => setCommunityAlerts(e.target.checked)}
                  className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <Button type="submit" variant="default" size="sm" className="font-bold text-xs">
                Save Notification Settings
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* 3. Payouts / Billing Tab */}
        <TabsContent value="payouts">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">
                {role === 'student' ? 'Direct Payout Method (UPI / Bank)' : 'Business Billing & Invoicing'}
              </h3>
              <p className="text-xs text-slate-500">
                {role === 'student'
                  ? 'Earnings are released directly to your verified bank account or UPI ID upon client confirmation.'
                  : 'Company billing details and GST invoices for bookkeeping.'}
              </p>
            </div>

            {role === 'student' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">UPI ID for Instant Settlement</label>
                  <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} className="text-xs font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Bank IFSC Code</label>
                  <Input defaultValue="HDFC0000128" className="text-xs font-mono bg-slate-50" readOnly />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Company GSTIN Number</label>
                  <Input value={gstin} onChange={(e) => setGstin(e.target.value)} className="text-xs font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-900">Invoicing Email</label>
                  <Input defaultValue={email} className="text-xs" />
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <Button type="submit" variant="default" size="sm" className="font-bold text-xs">
                Save Financial Details
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
