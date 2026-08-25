'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Service } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { calculateBookingPrice } from '@/lib/payment/razorpay';
import { useSkillSetuStore } from '@/lib/data/store';
import { formatINR } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ service, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const store = useSkillSetuStore();

  const [date, setDate] = useState('2026-08-30');
  const [timeSlot, setTimeSlot] = useState('14:00 - 16:00');
  const [duration, setDuration] = useState(2);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);

  if (!service) return null;

  const pricing = calculateBookingPrice(service.price, duration);

  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
    '18:00 - 20:00',
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        store.createBooking({
          serviceId: service.id,
          bookingDate: date,
          timeSlot,
          durationHours: duration,
          message,
        });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas-confetti unsupported
        }

        setLoading(false);
        setStep('success');
      } catch (err) {
        setLoading(false);
        alert('Booking creation failed');
      }
    }, 1000);
  };

  const handleFinish = () => {
    onOpenChange(false);
    setStep('details');
    router.push('/bookings');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Book Student Service</DialogTitle>
              <DialogDescription>
                Schedule verified student talent. Funds remain protected until you confirm delivery.
              </DialogDescription>
            </DialogHeader>

            {/* Service Summary Strip */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Avatar
                src={service.student_avatar}
                alt={service.student_name}
                fallback={service.student_name}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{service.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{service.student_name} • {service.student_college}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-slate-900">{formatINR(service.price)}</div>
                <div className="text-[10px] text-slate-500 font-medium">/{service.pricing_unit.replace('per_', '')}</div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>Booking Date</span>
                </label>
                <Input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Duration / Quantity</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={1}>1 {service.pricing_unit === 'per_hour' ? 'Hour' : 'Unit'}</option>
                  <option value={2}>2 {service.pricing_unit === 'per_hour' ? 'Hours' : 'Units'}</option>
                  <option value={3}>3 {service.pricing_unit === 'per_hour' ? 'Hours' : 'Units'}</option>
                  <option value={4}>4 {service.pricing_unit === 'per_hour' ? 'Hours' : 'Units'}</option>
                  <option value={6}>6 {service.pricing_unit === 'per_hour' ? 'Hours' : 'Units'}</option>
                  <option value={8}>Full Day (8 Hours)</option>
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Select Preferred Time Slot</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-1 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      timeSlot === slot
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {slot.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Requirements / Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Requirements & Deliverables</label>
              <Textarea
                placeholder="Briefly describe what you need delivered, format requirements, event venue details, or goals..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            {/* Transparent Dynamic Price Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Service Fee ({formatINR(service.price)} × {duration})</span>
                <span className="font-semibold text-slate-900">{formatINR(pricing.serviceTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <span>Platform Convenience Fee (5%)</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </span>
                <span className="font-semibold text-slate-900">{formatINR(pricing.platformFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount Payable</span>
                <span className="text-orange-600">{formatINR(pricing.totalClientPayable)}</span>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Payment Protected: Student receives funds only after you confirm satisfactory delivery.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" className="font-bold">
                Continue to Payment ({formatINR(pricing.totalClientPayable)})
              </Button>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span>Payment Protection Gateway</span>
              </DialogTitle>
              <DialogDescription>
                Razorpay Secure Checkout Simulation
              </DialogDescription>
            </DialogHeader>

            {/* Razorpay Card Simulator */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-orange-600 font-bold flex items-center justify-center text-xs">
                    SS
                  </div>
                  <span className="font-bold text-sm">SkillSetu Pay</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Lock className="w-3 h-3" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-400">Paying for booking</div>
                <div className="text-sm font-bold text-white truncate">{service.title}</div>
                <div className="text-xs text-slate-300">{date} • {timeSlot}</div>
              </div>

              <div className="bg-slate-800/90 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total Amount</div>
                  <div className="text-xl font-mono font-extrabold text-orange-400">
                    {formatINR(pricing.totalClientPayable)}
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 text-right">
                  Includes ₹{pricing.platformFee} platform fee
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Payment Method</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-orange-500/40 bg-orange-950/30 p-2 text-center text-xs font-bold text-orange-300">
                    UPI / QR
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-center text-xs font-medium text-slate-300">
                    Cards
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-800/40 p-2 text-center text-xs font-medium text-slate-300">
                    NetBanking
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('details')}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleConfirmPayment}
                disabled={loading}
                className="flex-1 font-bold"
              >
                {loading ? 'Processing Payment...' : `Authorize & Protect ${formatINR(pricing.totalClientPayable)}`}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Booking Confirmed!</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Your payment of <strong className="text-slate-900">{formatINR(pricing.totalClientPayable)}</strong> is safely protected. {service.student_name} has been notified.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left max-w-sm mx-auto space-y-1">
              <div><strong>Scheduled Date:</strong> {date} ({timeSlot})</div>
              <div><strong>Service:</strong> {service.title}</div>
              <div><strong>Status:</strong> Payment Protected</div>
            </div>

            <div className="pt-2">
              <Button type="button" variant="default" onClick={handleFinish} className="w-full sm:w-auto px-8 font-bold">
                Go to My Bookings
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
