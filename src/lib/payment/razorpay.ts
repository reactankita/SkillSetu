import { SITE_CONFIG } from '@/config/site';

export interface PaymentCalculation {
  basePrice: number;
  durationHours: number;
  serviceTotal: number;
  platformFee: number;
  totalClientPayable: number;
  studentDisbursable: number;
}

export function calculateBookingPrice(baseRate: number, durationHours: number = 1): PaymentCalculation {
  const serviceTotal = Math.max(0, baseRate * durationHours);
  const platformFee = Math.round(serviceTotal * SITE_CONFIG.platformFeeRate);
  const totalClientPayable = serviceTotal + platformFee;
  const studentDisbursable = serviceTotal;

  return {
    basePrice: baseRate,
    durationHours,
    serviceTotal,
    platformFee,
    totalClientPayable,
    studentDisbursable,
  };
}

export const isRazorpayConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID !== 'rzp_test_placeholder'
  );
};
